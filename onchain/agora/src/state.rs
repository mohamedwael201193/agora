use linera_sdk::{
    linera_base_types::AccountOwner,
    views::{linera_views, MapView, RegisterView, RootView, ViewStorageContext},
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, Default, async_graphql::Enum)]
pub enum Choice {
    #[default]
    Yes,
    No,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, Default, async_graphql::Enum)]
pub enum Phase {
    #[default]
    Draft,
    Open,
    Reveal,
    Final,
}

#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct MarketMeta {
    pub market_id: u64,
    pub question: String,
    pub description: String,
    pub chain_id: String,
    pub phase: Phase,
    pub result: Option<Choice>,
    pub closes_at: u64,
}

#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct AgoraState {
    // Registry state (lives on the designated registry chain)
    pub markets: MapView<u64, MarketMeta>,
    pub next_market_id: RegisterView<u64>,

    // Market state (used on market chains)
    pub question: RegisterView<String>,
    pub description: RegisterView<String>,
    pub closes_at: RegisterView<u64>,
    pub phase: RegisterView<Phase>,
    pub result: RegisterView<Option<Choice>>,
    pub market_id: RegisterView<Option<u64>>,

    // Commit-reveal storage
    pub commits: MapView<AccountOwner, [u8; 32]>,
    pub reveals: MapView<AccountOwner, Choice>,
}
