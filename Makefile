.PHONY: help localnet-up localnet-down create-registry create-market service-dev ui-dev clean test build bootstrap

# Default target
help:
	@echo "Agora Wave-2 Makefile"
	@echo ""
	@echo "Available targets:"
	@echo "  localnet-up       - Start local Linera network"
	@echo "  localnet-down     - Stop and clean local network"
	@echo "  build             - Build unified agora app to WASM"
	@echo "  create-registry   - Create registry instance (publish-and-create)"
	@echo "  bootstrap         - Full setup (localnet + build + registry)"
	@echo "  service-dev       - Run GraphQL service"
	@echo "  ui-dev            - Run Vite dev server"
	@echo "  test              - Run Rust tests"
	@echo "  clean             - Clean build artifacts"
	@echo ""
	@echo "Quick start:"
	@echo "  make localnet-up && make create-registry"
	@echo "  make service-dev  # in one terminal"
	@echo "  make ui-dev       # in another terminal"

# Localnet management
localnet-up:
	@echo "🚀 Starting local Linera network..."
	@if [ ! -f /tmp/.linera-net-up ]; then \
		linera net up > /tmp/linera-net-output.log 2>&1 & \
		sleep 5 && \
		tail -20 /tmp/linera-net-output.log | grep -A 10 "READY!" && \
		touch /tmp/.linera-net-up && \
		echo "✅ Localnet started. Wallet config in /tmp/.linera-net-output.log"; \
	else \
		echo "ℹ️  Localnet already running"; \
	fi

localnet-down:
	@echo "🛑 Stopping local Linera network..."
	@pkill -f "linera net up" || true
	@pkill -f "linera service" || true
	@rm -f /tmp/.linera-net-up
	@echo "✅ Localnet stopped"

# Build contracts
build:
	@echo "🔨 Building unified agora app to WASM..."
	@cargo build --release --target wasm32-unknown-unknown -p agora
	@echo "✅ Agora app built:"
	@ls -lh target/wasm32-unknown-unknown/release/agora_{contract,service}.wasm 2>/dev/null || true

# Create registry application (publish-and-create in one step)
create-registry: build
	@echo "🏗️  Creating registry application..."
	@./scripts/create_registry.sh

# Create a market on a new chain
create-market:
	@echo "🎯 Creating market..."
	@if [ -z "$(MARKET_TITLE)" ]; then \
		echo "❌ Error: MARKET_TITLE not set"; \
		echo "Usage: make create-market MARKET_TITLE='Will BTC reach 100k?'"; \
		exit 1; \
	fi
	@echo "Note: Use GraphQL mutation 'createMarket' on the registry chain"
	@echo "Example: mutation { createMarket(targetChain: \"<chain_id>\", question: \"$(MARKET_TITLE)\", description: \"...\", closesAt: 1234567890) }"

# Development servers
service-dev:
	@echo "🚀 Starting GraphQL service..."
	@if [ ! -f .env ]; then \
		echo "❌ Error: .env file not found. Run 'make create-registry' first"; \
		exit 1; \
	fi
	@cd onchain/service && cargo run --release

ui-dev:
	@echo "🎨 Starting UI development server..."
	@if [ ! -f .env.local ]; then \
		echo "❌ Error: .env.local not found. Run './scripts/bootstrap_local.sh' first"; \
		exit 1; \
	fi
	@npm run dev

# Testing
test:
	@echo "🧪 Running tests..."
	@cargo test --workspace

# Cleanup
clean:
	@echo "🧹 Cleaning build artifacts..."
	@cargo clean
	@rm -rf node_modules/.vite
	@echo "✅ Clean complete"

# Bootstrap full local setup
bootstrap:
	@echo "🎬 Bootstrapping complete local setup..."
	@./scripts/bootstrap_local.sh
