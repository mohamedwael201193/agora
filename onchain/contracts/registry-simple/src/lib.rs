// Minimal registry for Wave-2 buildathon
// This is a simplified version to meet compilation requirements

use async_graphql::{Request, Response};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    linera_base_types::{ContractAbi, ServiceAbi},
};
use serde::{Deserialize, Serialize};

pub struct RegistryAbi;

impl ContractAbi for RegistryAbi {
    type Operation = Operation;
    type Response = String;
}

impl ServiceAbi for RegistryAbi {
    type Query = Request;
    type QueryResponse = Response;
}

#[derive(Debug, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    CreateMarket { title: String },
}

#[derive(Debug, Deserialize, Serialize)]
pub enum Message {
    MarketFinalized { market_id: u64 },
}
