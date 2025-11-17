use async_graphql::{Request, Response};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    linera_base_types::{ContractAbi, ServiceAbi},
};
use serde::{Deserialize, Serialize};

pub struct AgoraCounterAbi;

impl ContractAbi for AgoraCounterAbi {
    type Operation = Operation;
    type Response = ();
}

impl ServiceAbi for AgoraCounterAbi {
    type Query = Request;
    type QueryResponse = Response;
}

#[derive(Debug, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    Increment { value: u64 },
    Decrement { value: u64 },
    Reset,
}