#![cfg_attr(target_arch = "wasm32", no_main)]

use std::sync::Arc;

use agora::{
    state::{AgoraState, Choice, MarketMeta, Phase},
    Operation,
};
use async_graphql::{EmptySubscription, Object, Request, Response, Schema};
use linera_sdk::{
    linera_base_types::{ChainId, WithServiceAbi},
    views::{RootView, View},
    Service, ServiceRuntime,
};

pub struct AgoraService {
    state: AgoraState,
    runtime: Arc<ServiceRuntime<Self>>,
}

linera_sdk::service!(AgoraService);

impl WithServiceAbi for AgoraService {
    type Abi = agora::AgoraAbi;
}

impl Service for AgoraService {
    type Parameters = agora::Parameters;

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = AgoraState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        Self {
            state,
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, request: Request) -> Response {
        let schema = Schema::build(
            QueryRoot {
                runtime: self.runtime.clone(),
            },
            MutationRoot {
                runtime: self.runtime.clone(),
            },
            EmptySubscription,
        )
        .finish();

        schema.execute(request).await
    }
}

struct QueryRoot {
    runtime: Arc<ServiceRuntime<AgoraService>>,
}

#[Object]
impl QueryRoot {
    async fn role(&self) -> String {
        let params = self.runtime.application_parameters();
        let here = self.runtime.chain_id();
        if here == params.registry_chain_id {
            "registry".into()
        } else {
            "market".into()
        }
    }

    async fn list_markets(&self) -> Vec<MarketMeta> {
        let state = AgoraState::load(self.runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        
        let mut results = vec![];
        state
            .markets
            .for_each_index_value(|_k, v| {
                results.push(v.into_owned());
                Ok(())
            })
            .await
            .expect("Failed to iterate markets");
        results
    }

    async fn market_question(&self) -> Option<String> {
        let state = AgoraState::load(self.runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        
        state.market_id.get().map(|_| {
            state.question.get().clone()
        })
    }

    async fn commit_count(&self) -> u32 {
        let state = AgoraState::load(self.runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        
        let mut count = 0u32;
        state
            .commits
            .for_each_index_value(|_k, _v| {
                count += 1;
                Ok(())
            })
            .await
            .expect("Failed to count commits");
        count
    }

    async fn reveal_count(&self) -> u32 {
        let state = AgoraState::load(self.runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        
        let mut count = 0u32;
        state
            .reveals
            .for_each_index_value(|_k, _v| {
                count += 1;
                Ok(())
            })
            .await
            .expect("Failed to count reveals");
        count
    }

    async fn market_phase(&self) -> Phase {
        let state = AgoraState::load(self.runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        
        *state.phase.get()
    }
}

struct MutationRoot {
    runtime: Arc<ServiceRuntime<AgoraService>>,
}

#[Object]
impl MutationRoot {
    async fn create_market(
        &self,
        target_chain: String,
        question: String,
        description: String,
        closes_at: u64,
    ) -> Result<String, String> {
        let chain_id: ChainId = target_chain
            .parse()
            .map_err(|e| format!("Invalid target_chain: {:?}", e))?;

        self.runtime
            .schedule_operation(&Operation::CreateMarket {
                target_chain: chain_id,
                question,
                description,
                closes_at,
            });

        Ok("scheduled".into())
    }

    async fn open(&self) -> String {
        self.runtime
            .schedule_operation(&Operation::Open);
        "scheduled".into()
    }

    async fn commit(&self, commitment_hex: String) -> String {
        self.runtime
            .schedule_operation(&Operation::Commit { commitment_hex });
        "scheduled".into()
    }

    async fn start_reveal(&self) -> String {
        self.runtime
            .schedule_operation(&Operation::StartReveal);
        "scheduled".into()
    }

    async fn reveal(&self, choice: Choice, salt_hex: String) -> String {
        self.runtime
            .schedule_operation(&Operation::Reveal { choice, salt_hex });
        "scheduled".into()
    }

    async fn finalize(&self, result: Choice) -> String {
        self.runtime
            .schedule_operation(&Operation::Finalize { result });
        "scheduled".into()
    }
}
