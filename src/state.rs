use linera_sdk::views::{linera_views, RegisterView, RootView, ViewStorageContext};
use serde::{Deserialize, Serialize};

#[derive(RootView, async_graphql::SimpleObject)]
#[view(context = ViewStorageContext)]
pub struct AgoraCounterState {
    pub value: RegisterView<u64>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct InstantiationArgument {
    pub initial_value: u64,
}