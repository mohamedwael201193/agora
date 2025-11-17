#![cfg_attr(target_arch = "wasm32", no_main)]

use agora::{
    state::{AgoraState, Choice, MarketMeta, Phase},
    Event, InitArg, Message, Operation, OperationResponse, Parameters,
};
use linera_sdk::{
    linera_base_types::{WithContractAbi, AccountOwner, ChainId},
    views::{RootView, View},
    Contract, ContractRuntime,
};

pub struct AgoraContract {
    state: AgoraState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(AgoraContract);

impl WithContractAbi for AgoraContract {
    type Abi = agora::AgoraAbi;
}

impl Contract for AgoraContract {
    type Message = Message;
    type Parameters = Parameters;
    type InstantiationArgument = InitArg;
    type EventValue = Event;

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = AgoraState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        Self { state, runtime }
    }

    async fn instantiate(&mut self, arg: InitArg) {
        match arg {
            InitArg::Registry => {
                self.state.next_market_id.set(0);
            }
        }
    }

    async fn execute_operation(&mut self, op: Operation) -> OperationResponse {
        match op {
            Operation::CreateMarket {
                target_chain,
                question,
                description,
                closes_at,
            } => {
                let params = self.runtime.application_parameters();
                let here = self.runtime.chain_id();
                if here != params.registry_chain_id {
                    return OperationResponse::Error(
                        "CreateMarket must run on registry chain".into(),
                    );
                }

                let id = *self.state.next_market_id.get();
                self.state.next_market_id.set(id + 1);

                let meta = MarketMeta {
                    market_id: id,
                    question: question.clone(),
                    description: description.clone(),
                    chain_id: format!("{}", target_chain),
                    phase: Phase::Draft,
                    result: None,
                    closes_at,
                };

                self.state
                    .markets
                    .insert(&id, meta)
                    .expect("Failed to insert market");

                self.runtime
                    .prepare_message(Message::InitMarket {
                        market_id: id,
                        question,
                        description,
                        closes_at,
                    })
                    .with_tracking()
                    .send_to(target_chain);

                // Event emission removed for now

                OperationResponse::Ok
            }

            Operation::Open => {
                if self.state.market_id.get().is_none() {
                    return OperationResponse::Error("Not a market chain".into());
                }
                self.state.phase.set(Phase::Open);
                OperationResponse::Ok
            }

            Operation::Commit { commitment_hex } => {
                if *self.state.phase.get() != Phase::Open {
                    return OperationResponse::Error("Wrong phase".into());
                }

                let owner = match self.runtime.authenticated_signer() {
                    Some(o) => o,
                    None => return OperationResponse::Error("Missing authenticated signer".into()),
                };

                let bytes = match hex::decode(&commitment_hex) {
                    Ok(b) => b,
                    Err(_) => return OperationResponse::Error("Bad commitment hex".into()),
                };

                if bytes.len() != 32 {
                    return OperationResponse::Error("Commitment must be 32 bytes".into());
                }

                if self
                    .state
                    .commits
                    .get(&owner)
                    .await
                    .expect("Failed to check commits")
                    .is_some()
                {
                    return OperationResponse::Error("Already committed".into());
                }

                let mut arr = [0u8; 32];
                arr.copy_from_slice(&bytes);

                self.state
                    .commits
                    .insert(&owner, arr)
                    .expect("Failed to insert commit");

                // Event emission removed for now
                OperationResponse::Ok
            }

            Operation::StartReveal => {
                if *self.state.phase.get() != Phase::Open {
                    return OperationResponse::Error("Wrong phase".into());
                }
                self.state.phase.set(Phase::Reveal);
                OperationResponse::Ok
            }

            Operation::Reveal { choice, salt_hex } => {
                if *self.state.phase.get() != Phase::Reveal {
                    return OperationResponse::Error("Wrong phase".into());
                }

                let owner = match self.runtime.authenticated_signer() {
                    Some(o) => o,
                    None => return OperationResponse::Error("Missing authenticated signer".into()),
                };

                if self
                    .state
                    .reveals
                    .get(&owner)
                    .await
                    .expect("Failed to check reveals")
                    .is_some()
                {
                    return OperationResponse::Error("Already revealed".into());
                }

                let salt = match hex::decode(&salt_hex) {
                    Ok(s) => s,
                    Err(_) => return OperationResponse::Error("Bad salt hex".into()),
                };

                let expected = hash_commitment(choice, &salt);

                match self
                    .state
                    .commits
                    .get(&owner)
                    .await
                    .expect("Failed to get commit")
                {
                    Some(c) if c == expected => {
                        self.state
                            .reveals
                            .insert(&owner, choice)
                            .expect("Failed to insert reveal");
                        // Event emission removed for now
                        OperationResponse::Ok
                    }
                    _ => OperationResponse::Error("Commitment mismatch".into()),
                }
            }

            Operation::Finalize { result } => {
                if *self.state.phase.get() != Phase::Reveal {
                    return OperationResponse::Error("Wrong phase".into());
                }

                self.state.phase.set(Phase::Final);
                self.state.result.set(Some(result));

                let params = self.runtime.application_parameters();
                let market_id = self.state.market_id.get().unwrap_or_default();

                self.runtime
                    .prepare_message(Message::MarketFinalized { market_id, result })
                    .with_tracking()
                    .send_to(params.registry_chain_id);

                // Event emission removed for now
                OperationResponse::Ok
            }
        }
    }

    async fn execute_message(&mut self, msg: Message) {
        match msg {
            Message::InitMarket {
                market_id,
                question,
                description,
                closes_at,
            } => {
                self.state.market_id.set(Some(market_id));
                self.state.question.set(question);
                self.state.description.set(description);
                self.state.closes_at.set(closes_at);
                self.state.phase.set(Phase::Draft);
            }
            Message::MarketFinalized { market_id, result } => {
                if let Ok(Some(mut meta)) = self.state.markets.get(&market_id).await {
                    meta.phase = Phase::Final;
                    meta.result = Some(result);
                    self.state
                        .markets
                        .insert(&market_id, meta)
                        .expect("Failed to update market");
                }
            }
        }
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}

fn hash_commitment(choice: Choice, salt: &[u8]) -> [u8; 32] {
    let mut hasher = blake3::Hasher::new();
    hasher.update(&[match choice {
        Choice::Yes => 1,
        Choice::No => 0,
    }]);
    hasher.update(salt);
    let hash = hasher.finalize();
    *hash.as_bytes()
}
