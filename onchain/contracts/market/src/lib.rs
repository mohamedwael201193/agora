use async_graphql::{Request, Response, SimpleObject};
use linera_sdk::{
    base::{AccountOwner, ApplicationId, ChainId, Timestamp},
    views::{linera_views, MapView, RegisterView, RootView, ViewStorageContext},
    Contract, ContractRuntime,
};
use serde::{Deserialize, Serialize};
use thiserror::Error;

/// Application state for a market
#[derive(RootView, SimpleObject)]
#[view(context = "ViewStorageContext")]
pub struct Market {
    /// Unique market ID (from registry)
    pub market_id: RegisterView<u64>,
    /// Market title
    pub title: RegisterView<String>,
    /// Market description
    pub description: RegisterView<String>,
    /// Market creator
    pub creator: RegisterView<AccountOwner>,
    /// Registry chain ID (for sending finalization message)
    pub registry_chain_id: RegisterView<ChainId>,
    /// Registry app ID
    pub registry_app_id: RegisterView<ApplicationId>,
    /// Current market phase
    pub phase: RegisterView<MarketPhase>,
    /// Timestamp when market ends
    pub ends_at: RegisterView<Timestamp>,
    /// Map of user to their commit hash
    pub commits: MapView<AccountOwner, Vec<u8>>,
    /// Map of user to their revealed choice
    pub reveals: MapView<AccountOwner, Choice>,
    /// Final result (if finalized)
    pub result: RegisterView<Option<Choice>>,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, SimpleObject)]
pub enum MarketPhase {
    Draft,
    Open,
    Reveal,
    Final,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, SimpleObject)]
pub enum Choice {
    Yes,
    No,
}

/// Operations that can be performed on a market
#[derive(Debug, Deserialize, Serialize)]
pub enum Operation {
    /// Initialize the market with parameters
    Initialize {
        market_id: u64,
        title: String,
        description: String,
        creator: AccountOwner,
        registry_chain_id: ChainId,
        registry_app_id: ApplicationId,
        ends_at: Timestamp,
    },
    /// Open the market for commitments
    Open,
    /// Commit a prediction (hash of choice + salt)
    Commit { commit_hash: Vec<u8> },
    /// Start the reveal phase
    StartReveal,
    /// Reveal a prediction (choice + salt)
    Reveal { choice: Choice, salt: Vec<u8> },
    /// Finalize the market with a result
    Finalize { result: Choice },
}

/// Messages the market can send
#[derive(Debug, Deserialize, Serialize)]
pub enum Message {
    /// Notify registry that this market has been finalized
    MarketFinalized { market_id: u64, result: Choice },
}

/// Events emitted by the market
#[derive(Debug, Serialize, Deserialize, SimpleObject)]
pub enum Event {
    /// Market was initialized
    Initialized { market_id: u64 },
    /// Market opened for commitments
    Opened,
    /// User committed a prediction
    Committed { user: AccountOwner },
    /// Reveal phase started
    RevealStarted,
    /// User revealed their prediction
    Revealed { user: AccountOwner, choice: Choice },
    /// Market was finalized
    Finalized { result: Choice },
}

#[derive(Debug, Error)]
pub enum MarketError {
    #[error("Invalid phase transition from {0:?} to {1:?}")]
    InvalidPhaseTransition(MarketPhase, MarketPhase),

    #[error("Operation not allowed in phase {0:?}")]
    InvalidPhase(MarketPhase),

    #[error("User has already committed")]
    AlreadyCommitted,

    #[error("No commit found for user")]
    NoCommitFound,

    #[error("Reveal does not match commit")]
    RevealMismatch,

    #[error("Only creator can perform this operation")]
    NotCreator,

    #[error("View error: {0}")]
    ViewError(#[from] linera_sdk::views::views::ViewError),
}

pub struct MarketContract;

impl Contract for MarketContract {
    type Error = MarketError;
    type Storage = Market;
    type State = Market;
    type Message = Message;
    type Parameters = ();
    type InstantiationArgument = ();

    async fn instantiate(
        &mut self,
        _state: Self::State,
        _runtime: &mut ContractRuntime,
        _argument: Self::InstantiationArgument,
    ) -> Result<(), Self::Error> {
        Ok(())
    }

    async fn execute_operation(
        &mut self,
        state: Self::State,
        runtime: &mut ContractRuntime,
        operation: Self::Operation,
    ) -> Result<Vec<u8>, Self::Error> {
        let signer = runtime
            .authenticated_signer()
            .expect("Operation must be signed");

        match operation {
            Operation::Initialize {
                market_id,
                title,
                description,
                creator,
                registry_chain_id,
                registry_app_id,
                ends_at,
            } => {
                state.market_id.set(market_id);
                state.title.set(title);
                state.description.set(description);
                state.creator.set(creator);
                state.registry_chain_id.set(registry_chain_id);
                state.registry_app_id.set(registry_app_id);
                state.phase.set(MarketPhase::Draft);
                state.ends_at.set(ends_at);
                state.result.set(None);

                runtime.emit(Event::Initialized { market_id });
                Ok(vec![])
            }

            Operation::Open => {
                let phase = state.phase.get();
                if phase != MarketPhase::Draft {
                    return Err(MarketError::InvalidPhaseTransition(phase, MarketPhase::Open));
                }

                let creator = state.creator.get();
                if signer != creator {
                    return Err(MarketError::NotCreator);
                }

                state.phase.set(MarketPhase::Open);
                runtime.emit(Event::Opened);
                Ok(vec![])
            }

            Operation::Commit { commit_hash } => {
                let phase = state.phase.get();
                if phase != MarketPhase::Open {
                    return Err(MarketError::InvalidPhase(phase));
                }

                // Check if user already committed
                if state.commits.get(&signer).await?.is_some() {
                    return Err(MarketError::AlreadyCommitted);
                }

                state.commits.insert(&signer, commit_hash)?;
                runtime.emit(Event::Committed { user: signer });
                Ok(vec![])
            }

            Operation::StartReveal => {
                let phase = state.phase.get();
                if phase != MarketPhase::Open {
                    return Err(MarketError::InvalidPhaseTransition(phase, MarketPhase::Reveal));
                }

                let creator = state.creator.get();
                if signer != creator {
                    return Err(MarketError::NotCreator);
                }

                state.phase.set(MarketPhase::Reveal);
                runtime.emit(Event::RevealStarted);
                Ok(vec![])
            }

            Operation::Reveal { choice, salt } => {
                let phase = state.phase.get();
                if phase != MarketPhase::Reveal {
                    return Err(MarketError::InvalidPhase(phase));
                }

                // Get user's commit
                let commit_hash = state
                    .commits
                    .get(&signer)
                    .await?
                    .ok_or(MarketError::NoCommitFound)?;

                // Verify reveal matches commit
                let mut reveal_data = bcs::to_bytes(&choice).expect("Serialization failed");
                reveal_data.extend_from_slice(&salt);
                let computed_hash = linera_sdk::util::sha3(&reveal_data);

                if computed_hash.as_ref() != commit_hash.as_slice() {
                    return Err(MarketError::RevealMismatch);
                }

                state.reveals.insert(&signer, choice)?;
                runtime.emit(Event::Revealed { user: signer, choice });
                Ok(vec![])
            }

            Operation::Finalize { result } => {
                let phase = state.phase.get();
                if phase != MarketPhase::Reveal {
                    return Err(MarketError::InvalidPhaseTransition(phase, MarketPhase::Final));
                }

                let creator = state.creator.get();
                if signer != creator {
                    return Err(MarketError::NotCreator);
                }

                state.phase.set(MarketPhase::Final);
                state.result.set(Some(result));

                runtime.emit(Event::Finalized { result });

                // Send cross-chain message to registry
                let market_id = state.market_id.get();
                let registry_chain_id = state.registry_chain_id.get();
                let registry_app_id = state.registry_app_id.get();

                let message = Message::MarketFinalized { market_id, result };
                runtime
                    .prepare_message(message)
                    .with_authentication()
                    .send_to(registry_chain_id);

                Ok(vec![])
            }
        }
    }

    async fn execute_message(
        &mut self,
        _state: Self::State,
        _runtime: &mut ContractRuntime,
        _message: Self::Message,
    ) -> Result<(), Self::Error> {
        // Market doesn't receive messages
        Ok(())
    }

    async fn finalize(&mut self, _state: Self::State, _runtime: &mut ContractRuntime) {}
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_commit_reveal() {
        // Test will be implemented with proper test harness
    }
}
