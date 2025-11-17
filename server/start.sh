#!/bin/bash

# AGORA Backend Startup Script
# Starts the chain management service

set -e

echo "🚀 Starting AGORA Backend Service..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo ""
fi

# Check if LINERA environment is set
if [ -z "$LINERA_WALLET" ]; then
  echo "⚠️  Warning: LINERA_WALLET not set"
  echo "   Make sure to run: source /tmp/agora-config.sh"
  echo ""
fi

# Start the service
echo "▶️  Starting backend on http://localhost:3001"
echo "   Ctrl+C to stop"
echo ""

npm start
