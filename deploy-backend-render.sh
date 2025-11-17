#!/bin/bash

# 🚀 AGORA - Backend Deployment on Render.com
# This deploys Linera service to Render so Vercel frontend can connect

echo "🎯 AGORA Backend Deployment Guide - Render.com"
echo "=============================================="
echo ""

echo "📋 What This Does:"
echo "  • Deploy Linera service to Render (public URL)"
echo "  • Frontend on Vercel can connect to it"
echo "  • Full Conway testnet functionality online"
echo ""

# Create Dockerfile for Linera service
cat > Dockerfile << 'EOF'
FROM rust:1.86.0-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    protobuf-compiler \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Linera
RUN cargo install --locked linera-service@0.15.6

# Create wallet directory
RUN mkdir -p /root/.config/linera

# Copy wallet configuration (you'll need to provide this)
COPY wallet.json /root/.config/linera/wallet.json

# Expose port
EXPOSE 8080

# Start Linera service
CMD ["linera", "service", "--port", "8080"]
EOF

echo "✅ Created Dockerfile"
echo ""

# Create render.yaml for easy deployment
cat > render.yaml << 'EOF'
services:
  - type: web
    name: agora-linera-backend
    env: docker
    plan: starter
    region: oregon
    branch: main
    dockerfilePath: ./Dockerfile
    envVars:
      - key: PORT
        value: 8080
      - key: RUST_LOG
        value: info
    healthCheckPath: /
EOF

echo "✅ Created render.yaml"
echo ""

echo "📝 STEP-BY-STEP DEPLOYMENT:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "STEP 1: Prepare Your Wallet"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Copy your wallet to project root:"
echo ""
echo "  cp ~/.config/linera/wallet.json /root/workspace/agora/wallet.json"
echo ""
echo "⚠️  IMPORTANT: Add wallet.json to .gitignore first!"
echo ""
echo "  echo 'wallet.json' >> .gitignore"
echo ""

echo "STEP 2: Create Render Account"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to: https://render.com"
echo "2. Sign up with GitHub"
echo "3. Connect your GitHub account"
echo ""

echo "STEP 3: Deploy Backend to Render"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Click 'New +' → 'Web Service'"
echo "2. Connect repository: mohamedwael201193/agora"
echo "3. Settings:"
echo "   - Name: agora-linera-backend"
echo "   - Environment: Docker"
echo "   - Region: Choose closest to you"
echo "   - Branch: main"
echo "   - Dockerfile Path: ./Dockerfile"
echo ""
echo "4. Environment Variables (none needed for basic setup)"
echo ""
echo "5. Instance Type:"
echo "   - Starter: \$7/month (512MB RAM) - Good for testing"
echo "   - Standard: \$25/month (2GB RAM) - Better for production"
echo ""
echo "6. Click 'Create Web Service'"
echo ""
echo "7. Wait 5-10 minutes for build..."
echo ""

echo "STEP 4: Get Your Backend URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "After deployment, Render gives you:"
echo "  https://agora-linera-backend.onrender.com"
echo ""
echo "Test it:"
echo "  curl https://agora-linera-backend.onrender.com"
echo ""

echo "✅ Backend Deployment Complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📌 Save This URL for Vercel Frontend:"
echo ""
echo "Backend URL: https://agora-linera-backend.onrender.com"
echo ""
echo "Use this in Vercel environment variables!"
echo ""
