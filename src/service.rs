#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use std::sync::Arc;

use async_graphql::{EmptySubscription, Object, Schema};
use linera_sdk::{
    graphql::GraphQLMutationRoot, linera_base_types::WithServiceAbi, views::View, Service,
    ServiceRuntime,
};

use agora_counter::Operation;
use self::state::AgoraCounterState;

pub struct AgoraCounterService {
    state: AgoraCounterState,
    runtime: Arc<ServiceRuntime<Self>>,
}

linera_sdk::service!(AgoraCounterService);

impl WithServiceAbi for AgoraCounterService {
    type Abi = agora_counter::AgoraCounterAbi;
}

impl Service for AgoraCounterService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = AgoraCounterState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        AgoraCounterService {
            state,
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, query: Self::Query) -> Self::QueryResponse {
        Schema::build(
            QueryRoot {
                value: *self.state.value.get(),
            },
            Operation::mutation_root(self.runtime.clone()),
            EmptySubscription,
        )
        .finish()
        .execute(query)
        .await
    }
}

struct QueryRoot {
    value: u64,
}

#[Object]
impl QueryRoot {
    async fn value(&self) -> &u64 {
        &self.value
    }
}