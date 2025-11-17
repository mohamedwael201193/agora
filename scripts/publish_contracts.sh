#!/usr/bin/env bash
# Publish unified agora application to Linera network

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "📦 Publishing AGORA unified app..."
echo "=================================="

# Check if contracts are built
if [ ! -f "$ROOT_DIR/target/wasm32-unknown-unknown/release/agora_contract.wasm" ]; then
    echo "❌ Agora contract not found. Run: make build"
    exit 1
fi

if [ ! -f "$ROOT_DIR/target/wasm32-unknown-unknown/release/agora_service.wasm" ]; then
    echo "❌ Agora service not found. Run: make build"
    exit 1
fi

# Publish agora bytecode
echo ""
echo "📤 Publishing agora application bytecode..."
AGORA_BYTECODE_ID=$(linera publish-bytecode \
    "$ROOT_DIR/target/wasm32-unknown-unknown/release/agora_contract.wasm" \
    "$ROOT_DIR/target/wasm32-unknown-unknown/release/agora_service.wasm" \
    --json | jq -r '.published_bytecode_id')

echo "✅ Agora bytecode ID: $AGORA_BYTECODE_ID"

# Save to .env.local
echo ""
echo "💾 Updating .env.local..."
if [ -f "$ROOT_DIR/.env.local" ]; then
    # Update existing file
    sed -i "s|^AGORA_BYTECODE_ID=.*|AGORA_BYTECODE_ID=$AGORA_BYTECODE_ID|" "$ROOT_DIR/.env.local"
else
    echo "⚠️  .env.local not found. Creating from .env.example..."
    cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env.local"
    sed -i "s|^AGORA_BYTECODE_ID=.*|AGORA_BYTECODE_ID=$AGORA_BYTECODE_ID|" "$ROOT_DIR/.env.local"
fi

echo "✅ .env.local updated"
echo ""
echo "✅ Application bytecode published successfully!"
echo "   Bytecode ID: $AGORA_BYTECODE_ID"
echo ""
echo "Next step: Run scripts/create_registry.sh to create the registry instance"
echo ""
echo "Bytecode IDs:"
echo "  Registry: $REGISTRY_BYTECODE_ID"
echo "  Market:   $MARKET_BYTECODE_ID"
