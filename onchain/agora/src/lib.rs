use async_graphql::{Request, Response};
use linera_sdk::{linera_base_types::{ContractAbi, ServiceAbi}};
use serde::{Deserialize, Serialize};

pub mod state;

pub struct AgoraAbi;

impl ContractAbi for AgoraAbi {
    type Operation = Operation;
    type Response = OperationResponse;
}

impl ServiceAbi for AgoraAbi {
    type Query = Request;
    type QueryResponse = Response;
}

// Re-export types for convenience
pub use state::{AgoraState, Choice, Phase, MarketMeta};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Parameters {
    pub registry_chain_id: linera_sdk::linera_base_types::ChainId,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum InitArg {
    Registry,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Operation {
    CreateMarket {
        target_chain: linera_sdk::linera_base_types::ChainId,
        question: String,
        description: String,
        closes_at: u64,
    },
    Open,
    Commit {
        commitment_hex: String,
    },
    StartReveal,
    Reveal {
        choice: Choice,
        salt_hex: String,
    },
    Finalize {
        result: Choice,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Message {
    InitMarket {
        market_id: u64,
        question: String,
        description: String,
        closes_at: u64,
    },
    MarketFinalized {
        market_id: u64,
        result: Choice,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Event {
    MarketCreated {
        market_id: u64,
        chain_id: linera_sdk::linera_base_types::ChainId,
    },
    CommitReceived {
        owner: linera_sdk::linera_base_types::AccountOwner,
    },
    RevealReceived {
        owner: linera_sdk::linera_base_types::AccountOwner,
    },
    MarketFinalized {
        market_id: u64,
        result: Choice,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum OperationResponse {
    Ok,
    Error(String),
}
