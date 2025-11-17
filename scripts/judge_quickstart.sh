#!/bin/bash
# AGORA Wave-2 Judge Quickstart
# Handles: Linera network, compilation, deployment, env setup
# Usage: ./scripts/judge_quickstart.sh

set -e  # Exit on any error

echo "🏛️  AGORA Wave-2 Judge Quickstart Starting..."
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."
command -v cargo >/dev/null 2>&1 || { 
    echo -e "${RED}❌ Rust not installed${NC}"
    echo "   Install: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
}

command -v npm >/dev/null 2>&1 || { 
    echo -e "${RED}❌ Node.js not installed${NC}"
    echo "   Install: https://nodejs.org/"
    exit 1
}

command -v linera >/dev/null 2>&1 || { 
    echo -e "${RED}❌ Linera CLI not installed${NC}"
    echo "   Install: cargo install --locked linera-service@0.15.6"
    exit 1
}

echo -e "${GREEN}✅ All prerequisites installed${NC}"
echo ""

# Clean up any existing local network
echo "🧹 Cleaning up previous network (if any)..."
pkill -f "linera-proxy" 2>/dev/null || true
pkill -f "linera-server" 2>/dev/null || true
sleep 1

# Step 1: Start local Linera network
echo "📡 Starting Linera local network..."
echo "   ⏱️  Network startup: ~30-40 seconds"
echo ""

# Start network in truly detached background (nohup + disown)
nohup linera net up --testing-prng-seed 37 > /tmp/linera-net.log 2>&1 &
NET_PID=$!
disown $NET_PID

# Wait for network to be ready (max 60 seconds)
echo "⏳ Waiting for network initialization..."
READY=false
for i in {1..60}; do
    if grep -q "READY" /tmp/linera-net.log 2>/dev/null; then
        echo -e "${GREEN}✅ Network is ready (after ${i}s)${NC}"
        READY=true
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "${RED}❌ Network failed to start within 60 seconds${NC}"
        echo "Last 20 lines of log:"
        tail -20 /tmp/linera-net.log
        exit 1
    fi
    # Progress indicator every 5 seconds
    if [ $((i % 5)) -eq 0 ]; then
        echo "   ... still waiting (${i}s)"
    fi
    sleep 1
done

if [ "$READY" = false ]; then
    echo -e "${RED}❌ Network startup failed${NC}"
    exit 1
fi

# Extract and export environment variables from log
echo ""
echo "💼 Extracting wallet configuration from network..."
export LINERA_WALLET=$(grep "LINERA_WALLET=" /tmp/linera-net.log | tail -1 | cut -d'"' -f2)
export LINERA_KEYSTORE=$(grep "LINERA_KEYSTORE=" /tmp/linera-net.log | tail -1 | cut -d'"' -f2)
export LINERA_STORAGE=$(grep "LINERA_STORAGE=" /tmp/linera-net.log | tail -1 | cut -d'"' -f2)

if [ -z "$LINERA_WALLET" ] || [ -z "$LINERA_KEYSTORE" ] || [ -z "$LINERA_STORAGE" ]; then
    echo -e "${RED}❌ Failed to extract wallet configuration${NC}"
    echo "Check /tmp/linera-net.log for details"
    exit 1
fi

echo "✅ Wallet configured:"
echo "   LINERA_WALLET=$LINERA_WALLET"
echo "   LINERA_STORAGE=$LINERA_STORAGE"
echo ""

# Step 2: Get default chain ID
echo "🔗 Getting default chain ID..."
sleep 2  # Give wallet time to initialize

DEFAULT_CHAIN=$(linera wallet show 2>/dev/null | grep -oP '(?<=│ )[a-f0-9]{64}' | head -1 || echo "")

if [ -z "$DEFAULT_CHAIN" ]; then
    echo -e "${YELLOW}⚠️  No chain found, requesting from faucet...${NC}"
    # Start faucet if needed
    linera faucet --port 8079 --amount 1000 >/dev/null 2>&1 &
    sleep 2
    linera wallet init --faucet http://localhost:8079 2>/dev/null || true
    linera wallet request-chain --faucet http://localhost:8079 2>/dev/null || true
    DEFAULT_CHAIN=$(linera wallet show 2>/dev/null | grep -oP '(?<=│ )[a-f0-9]{64}' | head -1)
fi

if [ -z "$DEFAULT_CHAIN" ]; then
    echo -e "${RED}❌ Failed to get default chain${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Default chain: $DEFAULT_CHAIN${NC}"
echo ""

# Step 3: Build WASM binaries (with caching)
CONTRACT_PATH="target/wasm32-unknown-unknown/release/agora_contract.wasm"
SERVICE_PATH="target/wasm32-unknown-unknown/release/agora_service.wasm"

# Check if binaries exist and are recent (less than 1 hour old)
SKIP_BUILD=false
if [ -f "$CONTRACT_PATH" ] && [ -f "$SERVICE_PATH" ]; then
    # Check if binaries are newer than source files
    NEWEST_SOURCE=$(find onchain/agora/src -type f -name "*.rs" -printf '%T@\n' | sort -n | tail -1)
    BINARY_TIME=$(stat -c %Y "$CONTRACT_PATH" 2>/dev/null || echo "0")
    
    if [ "$BINARY_TIME" -gt "${NEWEST_SOURCE%.*}" ]; then
        echo -e "${GREEN}✅ Using existing WASM binaries (up to date)${NC}"
        CONTRACT_SIZE=$(du -h "$CONTRACT_PATH" | cut -f1)
        SERVICE_SIZE=$(du -h "$SERVICE_PATH" | cut -f1)
        echo "   Contract: $CONTRACT_SIZE"
        echo "   Service:  $SERVICE_SIZE"
        SKIP_BUILD=true
    fi
fi

if [ "$SKIP_BUILD" = false ]; then
    echo "🔨 Building AGORA contracts..."
    echo "   ⏱️  First build: ~4-5 minutes (Rust compilation)"
    echo "   ⏱️  Subsequent builds: ~30 seconds (incremental)"
    echo ""
    echo "   💡 Tip: Binaries are cached. Re-running this script will be much faster!"
    echo ""

    cd onchain/agora
    
    # Use cargo with progress output
    cargo build --release --target wasm32-unknown-unknown 2>&1 | \
        grep -E "(Compiling|Finished|error)" | \
        while read line; do
            echo "   $line"
        done
    
    BUILD_STATUS=${PIPESTATUS[0]}
    cd ../..

    if [ $BUILD_STATUS -ne 0 ]; then
        echo -e "${RED}❌ Build failed${NC}"
        exit 1
    fi

    if [ ! -f "$CONTRACT_PATH" ] || [ ! -f "$SERVICE_PATH" ]; then
        echo -e "${RED}❌ WASM binaries not found${NC}"
        exit 1
    fi

    CONTRACT_SIZE=$(du -h "$CONTRACT_PATH" | cut -f1)
    SERVICE_SIZE=$(du -h "$SERVICE_PATH" | cut -f1)
    echo ""
    echo -e "${GREEN}✅ WASM binaries built${NC}"
    echo "   Contract: $CONTRACT_SIZE"
    echo "   Service:  $SERVICE_SIZE"
fi
echo ""

# Step 4: Publish and create application
echo "🚀 Publishing AGORA application to chain $DEFAULT_CHAIN..."
echo ""

PUBLISH_OUTPUT=$(linera project publish-and-create onchain/agora \
    --json-parameters "{\"registry_chain_id\":\"$DEFAULT_CHAIN\"}" \
    --json-argument '"Registry"' 2>&1)
PUBLISH_STATUS=$?

if [ $PUBLISH_STATUS -ne 0 ]; then
    echo -e "${RED}❌ Publish failed:${NC}"
    echo "$PUBLISH_OUTPUT"
    exit 1
fi

# Extract Application ID - try multiple patterns
APP_ID=$(echo "$PUBLISH_OUTPUT" | grep -oP '(?<=application id )[a-f0-9]{64}' | head -1)
if [ -z "$APP_ID" ]; then
    APP_ID=$(echo "$PUBLISH_OUTPUT" | grep -oP '\b[a-f0-9]{64}\b' | tail -1)
fi

if [ -z "$APP_ID" ]; then
    echo -e "${RED}❌ Failed to extract Application ID${NC}"
    echo "Output was:"
    echo "$PUBLISH_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✅ Application published${NC}"
echo "   Application ID: $APP_ID"
echo "   Registry Chain: $DEFAULT_CHAIN"
echo ""

# Step 5: Create a test market chain
echo "📊 Creating test market chain..."
MARKET_CHAIN_OUTPUT=$(linera open-chain 2>&1)
MARKET_CHAIN=$(echo "$MARKET_CHAIN_OUTPUT" | grep -oP '\b[a-f0-9]{64}\b' | head -1)

if [ -z "$MARKET_CHAIN" ]; then
    echo -e "${YELLOW}⚠️  Using default chain as market chain${NC}"
    MARKET_CHAIN=$DEFAULT_CHAIN
else
    echo -e "${GREEN}✅ Market chain created: $MARKET_CHAIN${NC}"
fi
echo ""

# Step 6: Create chain pool for market isolation
echo "⛓️  Creating chain pool for market isolation..."
cd server && npm install --silent 2>&1 > /dev/null && node setup-chains.js 10 && cd ..
echo -e "${GREEN}✅ Chain pool ready (10 chains available)${NC}"
echo ""

# Step 7: Create .env.local for frontend
echo "📝 Writing frontend configuration..."
cat > .env.local <<EOF
# Generated by judge_quickstart.sh on $(date)
# Do not commit this file to git

# Backend: Linera Node Service
VITE_NODE_URL=http://localhost:8080

# Backend: AGORA API Service (for chain management)
VITE_AGORA_BACKEND_URL=http://localhost:3001

# Blockchain Identifiers
VITE_AGORA_APP_ID=$APP_ID
VITE_REGISTRY_CHAIN_ID=$DEFAULT_CHAIN
VITE_MARKET_CHAIN_ID=$MARKET_CHAIN

# Network Mode (affects UI demo toolbar)
VITE_NETWORK=local
EOF

echo -e "${GREEN}✅ Frontend .env.local created${NC}"
echo ""

# Step 7: Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install --silent
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo "✅ Frontend dependencies already installed"
fi
echo ""

# Step 8: Save configuration for easy access
cat > /tmp/agora-config.sh <<EOF
#!/bin/bash
# Source this file to set environment variables
export LINERA_WALLET="$LINERA_WALLET"
export LINERA_STORAGE="$LINERA_STORAGE"
export LINERA_KEYSTORE="$LINERA_KEYSTORE"
export AGORA_APP_ID="$APP_ID"
export AGORA_REGISTRY_CHAIN="$DEFAULT_CHAIN"
export AGORA_MARKET_CHAIN="$MARKET_CHAIN"
EOF
chmod +x /tmp/agora-config.sh

# Print success summary
echo ""
echo "🎉 ================================================"
echo "   AGORA Setup Complete!"
echo "================================================"
echo ""
echo "📋 Configuration:"
echo "   Application ID:  $APP_ID"
echo "   Registry Chain:  $DEFAULT_CHAIN"
echo "   Market Chain:    $MARKET_CHAIN"
echo ""
echo "🔗 GraphQL Endpoints:"
echo "   Registry: http://localhost:8080/chains/$DEFAULT_CHAIN/applications/$APP_ID"
echo "   Market:   http://localhost:8080/chains/$MARKET_CHAIN/applications/$APP_ID"
echo ""
echo "▶️  Next Steps:"
echo ""
echo "   ${YELLOW}Terminal 1:${NC} linera service --port 8080"
echo "   ${YELLOW}Terminal 2:${NC} cd server && npm install && npm start"
echo "   ${YELLOW}Terminal 3:${NC} npm run dev"
echo "   ${YELLOW}Browser:${NC}    http://localhost:5173/agora"
echo ""
echo "🎯 Quick Test:"
echo "   1. Open Foundry Builder"
echo "   2. Create a new market (each gets its own chain!)"
echo "   3. Go to Marketplace and open the market"
echo "   4. Place a bet - fully isolated per market"
echo ""
echo "💡 Tip: To restore environment in new terminal:"
echo "   source /tmp/agora-config.sh"
echo ""
echo "🎬 Ready for judges! Multi-chain markets working!"
echo ""
