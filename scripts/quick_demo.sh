#!/bin/bash
# AGORA Quick Demo - Assumes binaries are already built
# Usage: ./scripts/quick_demo.sh
# For first-time setup, use: ./scripts/judge_quickstart.sh

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🏛️  AGORA Quick Demo (Skip Build)"
echo ""

# Check if binaries exist
if [ ! -f "target/wasm32-unknown-unknown/release/agora_contract.wasm" ]; then
    echo -e "${RED}❌ Binaries not found. Run ./scripts/judge_quickstart.sh first${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Using existing binaries${NC}"
echo ""

# Clean up old network
echo "🧹 Cleaning up..."
pkill -f "linera-proxy" 2>/dev/null || true
pkill -f "linera-server" 2>/dev/null || true
sleep 1

# Start network
echo "📡 Starting network (30 seconds)..."
linera net up --testing-prng-seed 37 > /tmp/linera-quick.log 2>&1 &

# Wait for ready
for i in {1..30}; do
    if grep -q "READY" /tmp/linera-quick.log 2>/dev/null; then
        echo -e "${GREEN}✅ Network ready${NC}"
        break
    fi
    sleep 1
done

# Get chain
DEFAULT_CHAIN=$(linera wallet show 2>/dev/null | grep -oP '(?<=│ )[a-f0-9]{64}' | head -1)
echo "✅ Chain: $DEFAULT_CHAIN"
echo ""

# Publish
echo "🚀 Publishing (30 seconds)..."
PUBLISH_OUTPUT=$(linera project publish-and-create onchain/agora --json-argument '"Registry"' 2>&1)
APP_ID=$(echo "$PUBLISH_OUTPUT" | grep -oP '\b[a-f0-9]{64}\b' | tail -1)

if [ -z "$APP_ID" ]; then
    echo -e "${RED}❌ Failed to extract App ID${NC}"
    exit 1
fi

echo -e "${GREEN}✅ App ID: $APP_ID${NC}"

# Create market chain
MARKET_CHAIN=$(linera open-chain 2>&1 | grep -oP '\b[a-f0-9]{64}\b' | head -1 || echo "$DEFAULT_CHAIN")

# Write .env.local
cat > .env.local <<EOF
VITE_NODE_URL=http://localhost:8080
VITE_AGORA_APP_ID=$APP_ID
VITE_REGISTRY_CHAIN_ID=$DEFAULT_CHAIN
VITE_MARKET_CHAIN_ID=$MARKET_CHAIN
VITE_NETWORK=local
EOF

echo ""
echo "🎉 Ready in ~60 seconds!"
echo ""
echo "▶️  Next:"
echo "   Terminal 1: linera service --port 8080"
echo "   Terminal 2: npm run dev"
echo "   Browser: http://localhost:5173/agora"
echo ""
