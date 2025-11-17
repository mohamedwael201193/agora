#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    linera_base_types::WithContractAbi,
    views::{View, RootView},
    Contract, ContractRuntime,
};

use agora_counter::Operation;
use self::state::{AgoraCounterState, InstantiationArgument};

pub struct AgoraCounterContract {
    state: AgoraCounterState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(AgoraCounterContract);

impl WithContractAbi for AgoraCounterContract {
    type Abi = agora_counter::AgoraCounterAbi;
}

impl Contract for AgoraCounterContract {
    type Message = ();
    type Parameters = ();
    type InstantiationArgument = InstantiationArgument;
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = AgoraCounterState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        AgoraCounterContract { state, runtime }
    }

    async fn instantiate(&mut self, argument: Self::InstantiationArgument) {
        self.runtime.application_parameters();
        self.state.value.set(argument.initial_value);
    }

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
        match operation {
            Operation::Increment { value } => {
                let current = self.state.value.get();
                self.state.value.set(current.saturating_add(value));
            }
            Operation::Decrement { value } => {
                let current = self.state.value.get();
                self.state.value.set(current.saturating_sub(value));
            }
            Operation::Reset => {
                self.state.value.set(0);
            }
        }
    }

    async fn execute_message(&mut self, _message: Self::Message) {}

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}