#!/usr/bin/env bash
# Bootstrap script for local Linera development environment
# This script is idempotent - safe to run multiple times

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀 AGORA Wave-2 Bootstrap Script"
echo "================================="

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v linera &> /dev/null; then
    echo "❌ Linera CLI not found. Please install Linera SDK 0.15.3+"
    echo "   Visit: https://linera.io/developers"
    exit 1
fi

if ! command -v cargo &> /dev/null; then
    echo "❌ Cargo not found. Please install Rust toolchain"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ All prerequisites met"

# Check if local network is running
echo ""
echo "🔍 Checking local Linera network..."

if pgrep -f "linera-proxy" > /dev/null; then
    echo "✅ Linera localnet is running"
else
    echo "⚠️  Linera localnet not detected"
    echo "   Run: make localnet-up"
    exit 1
fi

echo ""
echo "🔨 Building agora app..."
cd "$ROOT_DIR"
make build

# Create registry using publish-and-create (combines publish + create)
echo ""
echo "📝 Creating registry instance..."
bash "$SCRIPT_DIR/create_registry.sh"

# Copy .env.example to .env.local if it doesn't exist
if [ ! -f "$ROOT_DIR/.env.local" ]; then
    echo ""
    echo "📄 Creating .env.local from .env.example..."
    cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env.local"
    echo "✅ Created .env.local"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "✅ Bootstrap complete!"
echo ""
echo "Registry instance created with unified agora app"
echo ""
echo "Next steps:"
echo "  1. Start the GraphQL service: make service-dev"
echo "  2. Start the UI: make ui-dev"
echo "  3. Visit http://localhost:8080"
echo "  4. Create markets using GraphQL mutations"
echo ""
echo "For more info, see README.md"
