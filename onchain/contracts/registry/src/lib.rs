use async_graphql::{Request, Response, SimpleObject};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    linera_base_types::{ContractAbi, ServiceAbi},
};
use serde::{Deserialize, Serialize};

pub struct RegistryAbi;

impl ContractAbi for RegistryAbi {
    type Operation = Operation;
    type Response = u64; // Returns market_id
}

impl ServiceAbi for RegistryAbi {
    type Query = Request;
    type QueryResponse = Response;
}

/// Metadata for a market
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
pub struct MarketMeta {
    pub market_id: u64,
    pub title: String,
    pub description: String,
    pub creator: String,
    pub market_app_id: String,
    pub status: String,
    pub result: Option<String>,
}

/// Operations that can be performed on the registry
#[derive(Debug, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    /// Create a new market
    CreateMarket {
        title: String,
        description: String,
    },
}

/// Messages the registry can receive from market chains
#[derive(Debug, Deserialize, Serialize)]
pub enum Message {
    /// Notification from a market that it has been finalized
    MarketFinalized { market_id: u64, result: String },
}

// Re-export state for use in binaries
pub mod state {
    pub use crate::MarketMeta;
    use linera_sdk::views::{linera_views, MapView, RegisterView, RootView, ViewStorageContext};

    /// The application state for the registry
    #[derive(RootView)]
    #[view(context = "ViewStorageContext")]
    pub struct RegistryState {
        /// Map of market ID to market metadata (stored as JSON)
        pub markets: MapView<u64, String>,
        /// Next market ID to allocate
        pub next_market_id: RegisterView<u64>,
    }
}

