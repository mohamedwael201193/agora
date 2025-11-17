/*!
 * Market service implementation.
 * 
 * This provides the GraphQL API for querying market state.
 */

#![cfg_attr(target_arch = "wasm32", no_main)]

use async_graphql::{EmptyMutation, EmptySubscription, Object, Request, Response, Schema, SimpleObject};
use linera_sdk::{
    base::{AccountOwner, ApplicationId, ChainId, Timestamp},
    service::system_api,
    QueryContext, Service, ServiceRuntime,
};
use market::{Choice, Market, MarketPhase, MarketError};
use std::sync::Arc;

#[derive(Clone, SimpleObject)]
pub struct UserCommit {
    pub user: AccountOwner,
    pub commit_hash: Vec<u8>,
}

#[derive(Clone, SimpleObject)]
pub struct UserReveal {
    pub user: AccountOwner,
    pub choice: Choice,
}

pub struct MarketService {
    state: Arc<Market>,
}

#[Object]
impl MarketService {
    /// Get market ID
    async fn market_id(&self) -> u64 {
        self.state.market_id.get()
    }

    /// Get market title
    async fn title(&self) -> String {
        self.state.title.get()
    }

    /// Get market description
    async fn description(&self) -> String {
        self.state.description.get()
    }

    /// Get market creator
    async fn creator(&self) -> AccountOwner {
        self.state.creator.get()
    }

    /// Get current phase
    async fn phase(&self) -> MarketPhase {
        self.state.phase.get()
    }

    /// Get market end time
    async fn ends_at(&self) -> Timestamp {
        self.state.ends_at.get()
    }

    /// Get final result (if finalized)
    async fn result(&self) -> Option<Choice> {
        self.state.result.get()
    }

    /// Get all commits
    async fn commits(&self) -> Vec<UserCommit> {
        let mut results = Vec::new();
        
        // In production, this would need proper iteration
        // For now, this is a placeholder
        
        results
    }

    /// Get all reveals
    async fn reveals(&self) -> Vec<UserReveal> {
        let mut results = Vec::new();
        
        // In production, this would need proper iteration
        
        results
    }

    /// Check if a user has committed
    async fn has_committed(&self, user: AccountOwner) -> bool {
        self.state.commits.get(&user).await.ok().flatten().is_some()
    }

    /// Check if a user has revealed
    async fn has_revealed(&self, user: AccountOwner) -> bool {
        self.state.reveals.get(&user).await.ok().flatten().is_some()
    }
}

impl Service for MarketService {
    type Error = MarketError;
    type Storage = Market;
    type State = Market;

    async fn handle_query(
        &mut self,
        _runtime: &mut ServiceRuntime,
        request: Request,
    ) -> Result<Response, Self::Error> {
        let schema = Schema::build(
            self.clone(),
            EmptyMutation,
            EmptySubscription,
        )
        .finish();
        
        Ok(schema.execute(request).await)
    }
}

impl Clone for MarketService {
    fn clone(&self) -> Self {
        MarketService {
            state: Arc::clone(&self.state),
        }
    }
}

#[cfg(target_arch = "wasm32")]
#[no_mangle]
pub unsafe extern "C" fn handle_query(argument: u32) -> u32 {
    system_api::handle_service_query::<MarketService, Market>(argument)
}
