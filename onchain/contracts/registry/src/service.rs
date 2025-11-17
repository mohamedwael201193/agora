/*!
 * Registry service implementation.
 * 
 * This provides the GraphQL API for querying registry state.
 */

#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use async_graphql::{EmptySubscription, Object, Request, Response, Schema};
use linera_sdk::{
    linera_base_types::WithServiceAbi,
    views::View,
    Service, ServiceRuntime,
};
use registry::MarketMeta;
use self::state::RegistryState;
use std::sync::Arc;

pub struct RegistryService {
    state: Arc<RegistryState>,
}

linera_sdk::service!(RegistryService);

impl WithServiceAbi for RegistryService {
    type Abi = registry::RegistryAbi;
}

impl Service for RegistryService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = RegistryState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load registry state");
        RegistryService {
            state: Arc::new(state),
        }
    }

    async fn handle_query(&self, request: Request) -> Response {
        let schema = Schema::build(
            QueryRoot {
                state: Arc::clone(&self.state),
            },
            EmptyMutation,
            EmptySubscription,
        )
        .finish();

        schema.execute(request).await
    }
}

struct QueryRoot {
    state: Arc<RegistryState>,
}

#[Object]
impl QueryRoot {
    /// List all markets
    async fn markets(&self) -> Vec<MarketMeta> {
        let mut results = Vec::new();
        
        // Get next_market_id to know how many markets exist
        let next_id = *self.state.next_market_id.get();
        
        // Iterate through all created markets
        for market_id in 1..next_id {
            if let Ok(Some(meta_json)) = self.state.markets.get(&market_id).await {
                if let Ok(meta) = serde_json::from_str::<MarketMeta>(&meta_json) {
                    results.push(meta);
                }
            }
        }
        
        results
    }

    /// Get a specific market by ID
    async fn market(&self, market_id: u64) -> Option<MarketMeta> {
        if let Ok(Some(meta_json)) = self.state.markets.get(&market_id).await {
            serde_json::from_str(&meta_json).ok()
        } else {
            None
        }
    }

    /// Get the next market ID that will be allocated
    async fn next_market_id(&self) -> u64 {
        *self.state.next_market_id.get()
    }
}

struct EmptyMutation;

#[Object]
impl EmptyMutation {
    /// Placeholder - mutations are handled by contract operations
    async fn _dummy(&self) -> bool {
        true
    }
}

