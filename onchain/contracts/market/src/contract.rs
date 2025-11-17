/*!
 * Market contract implementation.
 * 
 * This is the entry point for the market contract WASM binary.
 */

#![cfg_attr(target_arch = "wasm32", no_main)]

use linera_sdk::contract::system_api;
use market::{Market, MarketContract, Message, Operation};

#[cfg(target_arch = "wasm32")]
#[no_mangle]
pub unsafe extern "C" fn handle_operation(argument: u32) -> u32 {
    system_api::handle_contract_operation::<MarketContract, Operation, Market>(argument)
}

#[cfg(target_arch = "wasm32")]
#[no_mangle]
pub unsafe extern "C" fn handle_message(argument: u32) -> u32 {
    system_api::handle_contract_message::<MarketContract, Message, Market>(argument)
}

#[cfg(target_arch = "wasm32")]
#[no_mangle]
pub unsafe extern "C" fn handle_instantiation(argument: u32) -> u32 {
    system_api::handle_contract_instantiation::<MarketContract, (), Market>(argument)
}

#[cfg(target_arch = "wasm32")]
#[no_mangle]
pub unsafe extern "C" fn finalize() -> u32 {
    system_api::handle_contract_finalization::<MarketContract, Market>()
}
