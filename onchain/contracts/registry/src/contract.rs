/*!
 * Registry contract implementation.
 * 
 * This is the entry point for the registry contract WASM binary.
 */

#![cfg_attr(target_arch = "wasm32", no_main)]

use linera_sdk::{
    linera_base_types::WithContractAbi,
    views::{View, RootView},
    Contract, ContractRuntime,
};

use registry::{Message, Operation, MarketMeta};
use registry::state::RegistryState;

pub struct RegistryContract {
    state: RegistryState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(RegistryContract);

impl WithContractAbi for RegistryContract {
    type Abi = registry::RegistryAbi;
}

impl Contract for RegistryContract {
    type Message = Message;
    type Parameters = ();
    type InstantiationArgument = ();
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = RegistryState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load registry state");
        RegistryContract { state, runtime }
    }

    async fn instantiate(&mut self, _argument: Self::InstantiationArgument) {
        self.runtime.application_parameters();
        // Initialize next_market_id to 1
        self.state.next_market_id.set(1);
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            Operation::CreateMarket { title, description } => {
                // Get next market ID
                let market_id = *self.state.next_market_id.get();
                self.state.next_market_id.set(market_id + 1);

                // Get creator
                let creator = match self.runtime.authenticated_signer() {
                    Some(owner) => format!("{:?}", owner),
                    None => "anonymous".to_string(),
                };

                // For now, market_app_id is a placeholder
                // In full implementation, this would spawn a new market chain
                let market_app_id = format!("market_{}", market_id);

                // Store market metadata as JSON
                let meta = MarketMeta {
                    market_id,
                    title,
                    description,
                    creator,
                    market_app_id,
                    status: "Draft".to_string(),
                    result: None,
                };

                let meta_json = serde_json::to_string(&meta)
                    .expect("Failed to serialize market metadata");

                self.state.markets.insert(&market_id, meta_json)
                    .expect("Failed to store market");

                market_id
            }
        }
    }

    async fn execute_message(&mut self, message: Self::Message) {
        match message {
            Message::MarketFinalized { market_id, result } => {
                // Update market status and result
                if let Some(meta_json) = self.state.markets.get(&market_id)
                    .await
                    .expect("Failed to get market")
                {
                    let mut meta: MarketMeta = serde_json::from_str(&meta_json)
                        .expect("Failed to deserialize market metadata");
                    
                    meta.status = "Finalized".to_string();
                    meta.result = Some(result);
                    
                    let updated_json = serde_json::to_string(&meta)
                        .expect("Failed to serialize updated metadata");
                    
                    self.state.markets.insert(&market_id, updated_json)
                        .expect("Failed to update market");
                }
            }
        }
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save registry state");
    }
}

