#!/usr/bin/env bash
# Create a registry instance on the default chain using publish-and-create

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "📝 Creating registry instance..."
echo "================================"

# Load environment
if [ -f "$ROOT_DIR/.env.local" ]; then
    source "$ROOT_DIR/.env.local"
else
    echo "❌ .env.local not found. Run: make bootstrap"
    exit 1
fi

if [ -z "$AGORA_BYTECODE_ID" ]; then
    echo "❌ AGORA_BYTECODE_ID not set in .env.local"
    echo "   Run: scripts/publish_contracts.sh"
    exit 1
fi

# Get default chain
DEFAULT_CHAIN=$(linera wallet show --json | jq -r '.default')
echo "Using chain: $DEFAULT_CHAIN"

# Create registry application with publish-and-create
# Parameters: { registry_chain_id: DEFAULT_CHAIN }
# InitArg: "Registry"
echo ""
echo "🎬 Creating registry application instance..."
CREATION_OUTPUT=$(linera publish-and-create \
    "$ROOT_DIR/target/wasm32-unknown-unknown/release/agora_contract.wasm" \
    "$ROOT_DIR/target/wasm32-unknown-unknown/release/agora_service.wasm" \
    --json-parameters "{\"registry_chain_id\":\"$DEFAULT_CHAIN\"}" \
    --json-argument '"Registry"' \
    --json)

AGORA_APP_ID=$(echo "$CREATION_OUTPUT" | jq -r '.published.application_id')
REGISTRY_CHAIN_ID=$(echo "$CREATION_OUTPUT" | jq -r '.chain_id')

echo "✅ Registry created!"
echo "   Application ID: $AGORA_APP_ID"
echo "   Chain ID: $REGISTRY_CHAIN_ID"

# Update .env.local
echo ""
echo "💾 Updating .env.local..."
sed -i "s|^AGORA_APP_ID=.*|AGORA_APP_ID=$AGORA_APP_ID|" "$ROOT_DIR/.env.local"
sed -i "s|^REGISTRY_CHAIN_ID=.*|REGISTRY_CHAIN_ID=$REGISTRY_CHAIN_ID|" "$ROOT_DIR/.env.local"
sed -i "s|^DEFAULT_CHAIN_ID=.*|DEFAULT_CHAIN_ID=$DEFAULT_CHAIN|" "$ROOT_DIR/.env.local"

echo "✅ .env.local updated"
echo ""
echo "✅ Registry instance created successfully!"
echo ""
echo "Application ID:    $AGORA_APP_ID"
echo "Registry Chain ID: $REGISTRY_CHAIN_ID"
echo "Default Chain ID:  $DEFAULT_CHAIN"
echo ""
echo "Next: Start the node service with 'make service-dev'"
