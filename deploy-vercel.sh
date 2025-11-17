#!/bin/bash

# Vercel Deployment Guide for Agora on Conway Testnet
# This script helps you deploy to Vercel

echo "🚀 AGORA - Vercel Deployment Setup"
echo "=================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm i -g vercel
fi

echo "📋 Pre-deployment Checklist:"
echo ""
echo "✅ Code pushed to GitHub: mohamedwael201193/agora"
echo "✅ .env.local in .gitignore"
echo "✅ Conway testnet configured"
echo ""

echo "⚠️  IMPORTANT: Conway testnet won't work on Vercel!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Why? Because Conway requires:"
echo "  • Local Linera service running on port 9000"
echo "  • Access to your local wallet"
echo "  • localhost:9000 connections"
echo ""
echo "Vercel is serverless and can't:"
echo "  • Run background services (Linera service)"
echo "  • Access your local machine"
echo "  • Connect to localhost:9000"
echo ""
echo "📊 What WILL work on Vercel:"
echo "  ✅ Frontend UI (all pages)"
echo "  ✅ Static content"
echo "  ✅ Client-side routing"
echo "  ✅ Responsive design"
echo ""
echo "❌ What WON'T work on Vercel:"
echo "  ❌ Wallet connection (needs local Linera)"
echo "  ❌ Market creation (needs blockchain access)"
echo "  ❌ Reading markets (needs http://localhost:9000)"
echo "  ❌ Any Conway testnet operations"
echo ""

echo "💡 Solutions for Production:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Option 1: Deploy Backend Separately"
echo "  • Deploy Linera service to VPS/Cloud (DigitalOcean, AWS)"
echo "  • Get public URL (e.g., https://linera.yourdomain.com)"
echo "  • Update VITE_LINERA_VALIDATOR_URL to public URL"
echo "  • Then deploy frontend to Vercel"
echo ""
echo "Option 2: Use Linera Public Testnet Validators"
echo "  • Wait for Linera to provide public endpoints"
echo "  • Update VITE_LINERA_VALIDATOR_URL to public validator"
echo "  • Deploy to Vercel"
echo ""
echo "Option 3: Full VPS Deployment"
echo "  • Deploy both frontend + Linera service to VPS"
echo "  • Use nginx to serve frontend"
echo "  • Linera service runs as background process"
echo ""

read -p "Do you still want to deploy frontend to Vercel? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "🔧 Step 1: Create vercel.json (already exists)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ File already configured for SPA routing"
echo ""

echo "🔧 Step 2: Environment Variables for Vercel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "You need to add these in Vercel dashboard:"
echo ""
echo "VITE_NETWORK=conway"
echo "VITE_AGORA_APP_ID=884e8b8e86f60309cdf11dd920f121331e1fd4b07533adebdb6d8c653c496905"
echo "VITE_REGISTRY_CHAIN_ID=134f497810d118434d34ee63f46e0385e65ce0638bd682c719410065723fefbb"
echo "VITE_CONWAY_REGISTRY_CHAIN_ID=134f497810d118434d34ee63f46e0385e65ce0638bd682c719410065723fefbb"
echo "VITE_CONWAY_APPLICATION_ID=884e8b8e86f60309cdf11dd920f121331e1fd4b07533adebdb6d8c653c496905"
echo ""
echo "⚠️  These will NOT work without backend:"
echo "VITE_LINERA_VALIDATOR_URL=http://localhost:9000"
echo "VITE_NODE_URL=http://localhost:9000"
echo ""
echo "For now, set them to placeholders:"
echo "VITE_LINERA_VALIDATOR_URL=https://your-backend.com"
echo "VITE_NODE_URL=https://your-backend.com"
echo ""

echo "🔧 Step 3: Deploy to Vercel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Method 1: Vercel Dashboard (Recommended)"
echo "  1. Go to https://vercel.com"
echo "  2. Sign in with GitHub"
echo "  3. Click 'Add New Project'"
echo "  4. Import 'mohamedwael201193/agora'"
echo "  5. Framework: Vite"
echo "  6. Build Command: npm run build"
echo "  7. Output Directory: dist"
echo "  8. Add Environment Variables (from above)"
echo "  9. Click 'Deploy'"
echo ""
echo "Method 2: Vercel CLI"
echo "  Run: vercel --prod"
echo "  Follow prompts"
echo ""

read -p "Deploy now with Vercel CLI? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting Vercel deployment..."
    echo ""
    vercel --prod
else
    echo ""
    echo "📝 Manual deployment steps:"
    echo "  1. Go to https://vercel.com/new"
    echo "  2. Import mohamedwael201193/agora"
    echo "  3. Add environment variables"
    echo "  4. Deploy!"
    echo ""
fi

echo ""
echo "✅ Deployment Guide Complete!"
echo ""
echo "📝 Remember:"
echo "  • Frontend will deploy successfully"
echo "  • Conway features need backend deployment"
echo "  • Contact Linera for public validator endpoints"
echo "  • Or deploy Linera service separately"
echo ""
echo "🌐 After deployment:"
echo "  • Your app will be at: https://agora-xxx.vercel.app"
echo "  • UI works perfectly"
echo "  • Blockchain features need backend setup"
echo ""
