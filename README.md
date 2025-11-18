# 🎯 Agora - Decentralized Prediction Markets on Linera

[![Linera SDK](https://img.shields.io/badge/Linera-0.15.6-blue)](https://linera.io)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Conway Testnet](https://img.shields.io/badge/Conway-Testnet-green)](https://testnet-conway.linera.net)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Real-time prediction markets powered by Linera microchains with sub-second finality and infinite scalability**

🔗 **Live on Conway Testnet** | 🎥 [Video Demo](https://youtu.be/iJ7ZOIszwXg) | 📦 [GitHub](https://github.com/mohamedwael201193/agora)

---

## 🌟 Overview

**Agora** is a next-generation prediction market platform that leverages Linera's microchain architecture to deliver:

- ⚡ **Sub-second settlement** - No waiting for block confirmations
- 🔄 **Infinite parallel scaling** - Each market on its own microchain
- 🎮 **Gamified experience** - Learn calibrated forecasting with Confidence Flip
- 🛠️ **No-code market creation** - Drag-and-drop Foundry Builder interface
- 🔐 **Commit-reveal betting** - Front-running prevention built-in
- 📊 **Real-time updates** - GraphQL subscriptions for live market data

**Wave 2 Status:** ✅ Fully integrated with Conway Testnet - all markets stored on real blockchain validators

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Conway Testnet Integration](#-conway-testnet-integration)
- [Project Structure](#-project-structure)
- [Key Components](#-key-components)
- [Smart Contracts](#-smart-contracts)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Functionality

#### 1. **Market Creation (Foundry Builder)**
- Drag-and-drop interface for custom prediction markets
- Support for binary (Yes/No) and multi-outcome markets
- Deadline configuration with timezone handling
- Token collateral requirements
- Automatic microchain assignment
- Real-time blockchain confirmation

#### 2. **Live Marketplace**
- Browse all active markets with category filters
- Categories: Sports, Politics, Crypto, Entertainment, Custom
- Real-time phase indicators (DRAFT, OPEN, RESOLVED)
- Search across all markets
- Sort by deadline, popularity, trading volume
- GraphQL subscriptions for instant updates

#### 3. **Conway Wallet Integration**
- Import wallet from Conway testnet
- Real-time balance display (100 tokens from faucet)
- Chain ID verification badge
- IndexedDB persistence (survives page refresh)
- Transaction history tracking
- Multi-account support ready

#### 4. **Prediction System**
- Token-staked predictions on market outcomes
- **Commit-reveal security** - prevents front-running attacks
- Real-time odds calculation based on market activity
- Position tracking per user
- Automatic payout calculation on resolution
- Claim winnings interface with transaction confirmation

#### 5. **Game Mode - Confidence Flip** 🎮
- 10-round prediction game teaching calibrated forecasting
- **Brier scoring system** for accuracy measurement
- Achievement badges (Bronze, Silver, Gold, Platinum)
- Leaderboard with top predictors
- Weekly challenges with token rewards
- Calibration advice based on performance

#### 6. **User Profile & Statistics**
- Personal prediction history with timeline
- Portfolio value tracking across all markets
- Win/loss ratio display with visual charts
- Total markets participated counter
- Average ROI calculation
- Badge collection showcase
- Favorite markets saved for quick access

---

## 🏗️ Architecture

### Microchain Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Conway Testnet Network                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Validator 1   Validator 2   Validator 3   Validator 4 │  │
│  │  (grpcs://validator-{1,2,3,4}.testnet-conway.linera.net) │
│  └──────────────────────────────────────────────────────┘  │
│                             ▲                                │
│                             │                                │
│  ┌──────────────────────────┼────────────────────────────┐ │
│  │     Application Chain    │                             │ │
│  │  134f497810d118434d34ee63f46e0385e65ce0638bd682c71   │ │
│  │                                                         │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │ │
│  │  │  Market 0  │  │  Market 1  │  │  Market N  │     │ │
│  │  │ btc 150k?  │  │ eth 10k?   │  │  ...       │     │ │
│  │  └────────────┘  └────────────┘  └────────────┘     │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                             ▲
                             │ GraphQL + WebSocket
                             │
          ┌──────────────────┴──────────────────┐
          │   Linera Service (localhost:9000)   │
          │   - GraphQL API (12 endpoints)      │
          │   - Real-time subscriptions         │
          │   - <50ms query latency             │
          └──────────────────┬──────────────────┘
                             │
                             ▼
          ┌─────────────────────────────────────┐
          │  React Frontend (Vite + TypeScript) │
          │  - Zustand state management         │
          │  - IndexedDB persistence            │
          │  - Real-time UI updates             │
          └─────────────────────────────────────┘
```

### Data Flow

1. **User creates market** → Frontend validates → Sends to Linera service
2. **Linera service** → Executes smart contract → Creates microchain
3. **Conway validators** → Achieve consensus → Write to blockchain
4. **GraphQL subscription** → Notifies frontend → Updates UI instantly
5. **User places bet** → Commit hash stored → Reveal phase → Payout calculated

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI framework with concurrent features |
| **TypeScript** | 5.8.3 | Type-safe development |
| **Vite** | 5.4.19 | Lightning-fast build tool with HMR |
| **Zustand** | 5.0.8 | Lightweight state management |
| **TailwindCSS** | 3.4.17 | Utility-first styling |
| **shadcn/ui** | Latest | Accessible component library |
| **Framer Motion** | 12.23.24 | Animation library |
| **React Query** | 5.83.0 | Server state management |
| **React Router** | 6.30.1 | Client-side routing |
| **Recharts** | 2.15.4 | Data visualization |
| **dnd-kit** | 6.3.1 | Drag-and-drop functionality |
| **Zod** | 3.25.76 | Schema validation |

### Blockchain

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Linera SDK** | 0.15.6 | Blockchain framework |
| **Rust** | 2021 Edition | Smart contract language |
| **WebAssembly** | - | Contract compilation target |
| **async-graphql** | 7.0 | GraphQL service layer |
| **Blake3** | 1.0 | Cryptographic hashing |

### Development Tools

- **ESLint** 9.32.0 - Code linting
- **TypeScript ESLint** 8.38.0 - TS-specific linting
- **Autoprefixer** 10.4.21 - CSS vendor prefixing
- **Terser** 5.44.1 - Code minification

---

## 🚀 Getting Started

### Prerequisites

```bash
# Required
- Node.js >= 18.0.0
- npm >= 9.0.0
- Rust >= 1.75.0
- Linera CLI 0.15.6

# Optional (for deployment)
- Docker >= 20.10
- Git
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mohamedwael201193/agora.git
cd agora
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install Linera CLI**
```bash
cargo install --locked linera-service@0.15.6
```

4. **Setup Conway Testnet wallet**
```bash
# Initialize wallet with Conway faucet
linera wallet init --faucet https://faucet.testnet-conway.linera.net

# Request a new chain (receives 100 tokens)
linera wallet show
```

5. **Configure environment**
```bash
cp .env.example .env.local
# Edit .env.local with your chain ID and application ID
```

6. **Start Linera service**
```bash
# In a separate terminal
linera service --port 9000
```

7. **Run the frontend**
```bash
npm run dev
```

8. **Open your browser**
```
http://localhost:8081
```

---

## 🔗 Conway Testnet Integration

### Live Deployment Details

```yaml
Network: Conway Testnet (Real Linera Validators)
Chain ID: 134f497810d118434d34ee63f46e0385e65ce0638bd682c719410065723fefbb
Application ID: 884e8b8e86f60309cdf11dd920f121331e1fd4b07533adebdb6d8c653c496905
Public Key: 0xa0f4d05c2db3a985fecc77e2d2b67a742433d6fdef49f5aee9e75bf41f3ee781
Balance: 100 tokens (from faucet)
Blocks Created: 11 on real validators
```

### Validators

- `validator-1.testnet-conway.linera.net:443`
- `validator-2.testnet-conway.linera.net:443`
- `validator-3.testnet-conway.linera.net:443`
- `validator-4.testnet-conway.linera.net:443`

### Deployment Command

```bash
linera publish-and-create \
  target/wasm32-unknown-unknown/release/agora_contract.wasm \
  target/wasm32-unknown-unknown/release/agora_service.wasm \
  --json-parameters '{"registry_chain_id":"134f497810d118434d34ee63f46e0385e65ce0638bd682c719410065723fefbb"}' \
  --json-argument '"Registry"'
```

### Verification

```bash
# Check wallet status
linera wallet show

# Query markets from blockchain
curl http://localhost:9000 -H "Content-Type: application/json" \
  -d '{"query":"{ listMarkets { marketId question phase closesAt } }"}'

# Check balance
linera query-balance --chain-id 134f497810d118434d34ee63f46e0385e65ce0638bd682c719410065723fefbb
```

### Environment Variables

```env
# Network
VITE_NETWORK=conway

# Conway Testnet Configuration
VITE_AGORA_APP_ID=884e8b8e86f60309cdf11dd920f121331e1fd4b07533adebdb6d8c653c496905
VITE_REGISTRY_CHAIN_ID=134f497810d118434d34ee63f46e0385e65ce0638bd682c719410065723fefbb
VITE_CONWAY_REGISTRY_CHAIN_ID=134f497810d118434d34ee63f46e0385e65ce0638bd682c719410065723fefbb
VITE_CONWAY_APPLICATION_ID=884e8b8e86f60309cdf11dd920f121331e1fd4b07533adebdb6d8c653c496905

# Service Endpoints
VITE_LINERA_VALIDATOR_URL=http://localhost:9000
VITE_NODE_URL=http://localhost:9000
VITE_LINERA_FAUCET_URL=https://faucet.testnet-conway.linera.net

# Features
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_STRESS_TEST=false
```

---

## 📁 Project Structure

```
agora/
├── onchain/                      # Linera Smart Contracts
│   ├── agora/                    # Main application contract
│   │   ├── src/
│   │   │   ├── contract.rs       # Market logic (CreateMarket, Predict, Resolve)
│   │   │   ├── service.rs        # GraphQL service (12 endpoints)
│   │   │   ├── state.rs          # Blockchain state management
│   │   │   └── lib.rs            # Contract ABI definitions
│   │   └── Cargo.toml            # Rust dependencies (Linera SDK 0.15.6)
│   ├── contracts/
│   │   ├── market/               # Market contract implementation
│   │   └── registry/             # Registry for market discovery
│   └── service/                  # GraphQL service layer
│       └── src/lib.rs
│
├── src/                          # Frontend React Application
│   ├── pages/                    # Page components
│   │   ├── Index.tsx             # Landing page
│   │   ├── Marketplace.tsx       # Market browser
│   │   ├── AgoraMarkets.tsx      # Market dashboard
│   │   ├── FoundryBuilder.tsx    # Drag-and-drop market creator
│   │   ├── Profile.tsx           # User stats & history
│   │   ├── Architecture.tsx      # Technical overview
│   │   ├── Connect.tsx           # Wallet connection
│   │   ├── game/
│   │   │   └── Confidence.tsx    # Confidence Flip game
│   │   ├── market/
│   │   │   └── MarketDetail.tsx  # Individual market view
│   │   └── demo/
│   │       ├── Counter.tsx       # Demo: State mutations
│   │       └── Transfer.tsx      # Demo: Cross-chain transfers
│   │
│   ├── components/               # Reusable components
│   │   ├── Layout.tsx            # Shell layout
│   │   ├── Header.tsx            # Navigation + wallet
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ... (40+ components)
│   │   ├── market/
│   │   │   ├── BetTicket.tsx     # Betting interface
│   │   │   ├── MarketCard.tsx    # Market preview
│   │   │   └── OddsDisplay.tsx   # Real-time odds
│   │   ├── game/
│   │   │   └── GameHistoryItem.tsx
│   │   ├── realtime/
│   │   │   ├── RealTimeHUD.tsx   # Performance metrics
│   │   │   ├── LatencyHUD.tsx    # Latency display
│   │   │   └── ChainPill.tsx     # Chain status
│   │   ├── common/
│   │   │   ├── StatChip.tsx
│   │   │   └── DemoModePill.tsx
│   │   └── DeveloperDrawer.tsx   # Debug panel
│   │
│   ├── lib/                      # Core libraries
│   │   ├── agoraClient.ts        # Linera GraphQL client
│   │   ├── lineraClient.ts       # Blockchain client wrapper
│   │   ├── lineraFaucet.ts       # Conway faucet integration
│   │   ├── wallet.ts             # Wallet management
│   │   ├── networkConfig.ts      # Network configurations
│   │   └── utils.ts              # Utility functions
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useWallet.ts          # Wallet connection logic
│   │   ├── useNotifications.ts   # Real-time notifications
│   │   ├── use-toast.ts          # Toast notifications
│   │   └── use-mobile.tsx        # Mobile detection
│   │
│   ├── stores/                   # State management
│   │   └── useAgoraStore.ts      # Zustand store (20+ actions)
│   │
│   ├── services/                 # Business logic
│   │   ├── GameBridge.ts         # Game state management
│   │   └── lineraClient.ts       # API client
│   │
│   ├── utils/                    # Utility modules
│   │   ├── money.ts              # Precise financial calculations
│   │   ├── brier.ts              # Brier scoring for games
│   │   ├── crypto.ts             # Cryptographic functions
│   │   └── salts.ts              # Salt generation
│   │
│   ├── assets/                   # Static assets
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Application entry
│   └── index.css                 # Global styles
│
├── scripts/                      # Automation scripts
│   ├── deploy_conway.sh          # Conway deployment
│   ├── create_registry.sh        # Registry creation
│   ├── publish_contracts.sh      # Contract publishing
│   ├── quick_demo.sh             # Quick demo setup
│   └── stress_test.sh            # Load testing
│
├── server/                       # Node.js backend (optional)
│   ├── index.js                  # Express server
│   ├── chainService.js           # Chain management
│   └── setup-chains.js           # Chain initialization
│
├── public/                       # Static files
│   ├── index.html
│   ├── site.webmanifest          # PWA config
│   └── robots.txt
│
├── Dockerfile                    # Backend containerization
├── render.yaml                   # Render.com deployment config
├── vercel.json                   # Vercel deployment config
├── vite.config.ts                # Vite configuration
├── tailwind.config.ts            # Tailwind CSS config
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # NPM dependencies
├── Cargo.toml                    # Rust workspace config
└── README.md                     # This file
```

---

## 🧩 Key Components

### State Management (`useAgoraStore.ts`)

**Zustand store with persistence:**

```typescript
interface AgoraStore {
  // Chain connection
  chainId: string | null
  isConnected: boolean
  address: string | null
  
  // Real-time metrics
  latencyMetrics: LatencyMetrics
  
  // Notifications (max 50, persist 20)
  notifications: Notification[]
  
  // Markets & positions
  markets: Market[]
  positions: Position[]
  
  // Demo wallet
  demoWalletBalance: number
  
  // Game state (Confidence Flip)
  gameState: GameState
  
  // Developer settings
  transportConfig: TransportConfig
  
  // 20+ actions for mutations
  setChainId: (id: string) => void
  addNotification: (notification: Notification) => void
  updateMarket: (market: Market) => void
  // ... more actions
}
```

### Market Card Component

Displays market preview with:
- Question and description
- Current odds for each outcome
- Time until deadline
- Participant count
- Phase badge (DRAFT/OPEN/RESOLVED)
- Quick bet button

### Bet Ticket Modal

Features:
- Outcome selection (YES/NO or multi-choice)
- Amount input with balance validation
- Fee calculation (1% platform fee)
- Potential payout estimation
- Commit-reveal flow visualization
- Transaction confirmation

### Developer Drawer

Debug panel with:
- Transport mode switching (WebSocket/HTTP)
- Latency simulation controls
- State export/import
- Network metrics display
- Event log viewer

---

## 🔐 Smart Contracts

### Contract Operations

**8 core operations:**

1. **CreateMarket** - Initialize new prediction market
2. **OpenMarket** - Activate market for trading
3. **CommitPrediction** - Submit encrypted bet (Blake3 hash)
4. **RevealPrediction** - Reveal bet with salt (verify hash)
5. **ResolveMarket** - Set final outcome
6. **ClaimWinnings** - Withdraw payouts
7. **UpdateMarket** - Modify market parameters
8. **CloseMarket** - End trading period

### GraphQL Service

**12 query endpoints:**

```graphql
type Query {
  # Market queries
  market(id: ID!): Market
  listMarkets(status: MarketStatus): [Market!]!
  searchMarkets(query: String!): [Market!]!
  
  # User queries
  userPositions(address: String!): [Position!]!
  userHistory(address: String!): [Transaction!]!
  
  # Statistics
  marketStats(id: ID!): MarketStats!
  globalStats: GlobalStats!
  leaderboard(limit: Int): [LeaderEntry!]!
  
  # Real-time
  latency: LatencyMetrics!
  chainStatus: ChainStatus!
  
  # Admin
  pendingResolve: [Market!]!
  analytics: Analytics!
}

type Subscription {
  marketUpdated(id: ID!): Market!
  newPosition(marketId: ID!): Position!
  priceChanged(marketId: ID!): PriceUpdate!
}
```

### State Structure

```rust
pub struct MarketState {
    pub market_id: u64,
    pub question: String,
    pub outcomes: Vec<String>,
    pub closes_at: u64,
    pub phase: Phase,
    pub commits: HashMap<Owner, CommitHash>,
    pub reveals: HashMap<Owner, Prediction>,
    pub total_volume: Amount,
    pub resolved_outcome: Option<usize>,
}

pub enum Phase {
    Draft,
    Open,
    Closed,
    Resolved,
}

pub struct Prediction {
    pub outcome_index: usize,
    pub amount: Amount,
    pub salt: [u8; 32],
    pub timestamp: u64,
}
```

---

## 🛠️ Development

### Running Development Server

```bash
# Terminal 1: Linera service
linera service --port 9000

# Terminal 2: Frontend dev server
npm run dev
```

### Building for Production

```bash
# Frontend build
npm run build

# Smart contracts
cd onchain/agora
cargo build --release --target wasm32-unknown-unknown
```

### Code Quality

```bash
# Linting
npm run lint

# Type checking
tsc --noEmit

# Format code
npm run format
```

### Environment Modes

```bash
# Development (with devtools)
npm run dev

# Production build
npm run build

# Development build
npm run build:dev

# Preview production build
npm run preview
```

---

## 🧪 Testing

### Manual Testing Checklist

**Market Creation:**
- [ ] Create binary market (Yes/No)
- [ ] Create multi-outcome market (3-10 options)
- [ ] Set deadline in future
- [ ] Verify blockchain confirmation
- [ ] Check market appears in Marketplace

**Prediction Flow:**
- [ ] Connect wallet
- [ ] Select market
- [ ] Place bet with commit hash
- [ ] Wait for commit phase
- [ ] Reveal bet with salt
- [ ] Verify position tracked

**Market Resolution:**
- [ ] Close market at deadline
- [ ] Admin resolves outcome
- [ ] Check payout calculation
- [ ] Claim winnings
- [ ] Verify balance update

**Game Mode:**
- [ ] Play Confidence Flip (10 rounds)
- [ ] Check Brier score calculation
- [ ] Verify badge unlocking
- [ ] See leaderboard update

### Verification Commands

```bash
# Check contract deployment
linera application show 884e8b8e86f60309cdf11dd920f121331e1fd4b07533adebdb6d8c653c496905

# Query all markets
curl http://localhost:9000 -H "Content-Type: application/json" \
  -d '{"query":"{ listMarkets { marketId question phase } }"}'

# Check user positions
curl http://localhost:9000 -H "Content-Type: application/json" \
  -d '{"query":"{ userPositions(address: \"0xa0f4d05c...\") { marketId amount outcome } }"}'

# View blockchain state
linera query-application 134f497810d118434d34ee63f46e0385e65ce0638bd682c719410065723fefbb
```

---

## 🚀 Deployment

### Prerequisites for Production

1. **Render.com Account** (for backend)
2. **Vercel Account** (for frontend)
3. **Conway Testnet Wallet** with tokens
4. **GitHub Repository** (for CI/CD)

### Backend Deployment (Render)

```bash
# 1. Dockerfile already configured
# 2. Push to GitHub
git push origin main

# 3. On Render dashboard:
# - New Web Service
# - Import from GitHub: mohamedwael201193/agora
# - Environment: Docker
# - Plan: Starter ($7/month)
# - Deploy

# 4. Get backend URL
# Example: https://agora-linera-backend.onrender.com
```

### Frontend Deployment (Vercel)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Set environment variables on Vercel dashboard
# Copy all VITE_* variables from .env.local
# Update VITE_LINERA_VALIDATOR_URL to Render backend URL
```

### Environment Variables (Production)

```env
# Frontend (Vercel)
VITE_NETWORK=conway
VITE_AGORA_APP_ID=884e8b8e86f60309cdf11dd920f121331e1fd4b07533adebdb6d8c653c496905
VITE_REGISTRY_CHAIN_ID=134f497810d118434d34ee63f46e0385e65ce0638bd682c719410065723fefbb
VITE_LINERA_VALIDATOR_URL=https://agora-linera-backend.onrender.com
VITE_NODE_URL=https://agora-linera-backend.onrender.com
VITE_LINERA_FAUCET_URL=https://faucet.testnet-conway.linera.net

# Backend (Render)
# No environment variables needed - all in Dockerfile
```

---

## 📊 Performance Benchmarks

### GraphQL Query Latency

- **market(id)**: ~15ms average
- **listMarkets()**: ~25ms for 100 markets
- **userPositions()**: ~20ms
- **Real-time subscriptions**: <5ms update delay

### Transaction Times

- **Market creation**: 150-300ms (end-to-end)
- **Bet commit**: 100-200ms
- **Bet reveal**: 100-200ms
- **Market resolution**: 200-400ms

### Blockchain Performance

- **Block finality**: <1 second
- **Parallel market creation**: Unlimited (separate microchains)
- **Consensus overhead**: Minimal (4 validators)

---

## 🎯 Roadmap

### Wave 3 (Planned)

- [ ] Automated market makers (AMM)
- [ ] Liquidity pools for each market
- [ ] Advanced charting with TradingView integration
- [ ] Mobile app (React Native)
- [ ] Social features (follow traders, copy trades)
- [ ] Market templates marketplace
- [ ] Reputation system with badges
- [ ] Multi-signature oracles

### Wave 4 (Future)

- [ ] Cross-chain bridge to other Linera apps
- [ ] DAO governance for platform decisions
- [ ] NFT badges for achievements
- [ ] AI-powered market recommendations
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript strict mode
- Use Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Linera Team** for the amazing microchain architecture
- **Conway Testnet** for providing reliable infrastructure
- **shadcn/ui** for the beautiful component library
- **React Team** for the powerful UI framework
- **Rust Community** for excellent tooling

---

## 📞 Contact & Links

- **GitHub**: [@mohamedwael201193](https://github.com/mohamedwael201193)
- **Repository**: [agora](https://github.com/mohamedwael201193/agora)
- **Video Demo**: [YouTube](https://youtu.be/iJ7ZOIszwXg)
- **Conway Testnet**: [testnet-conway.linera.net](https://testnet-conway.linera.net)
- **Linera Documentation**: [docs.linera.io](https://docs.linera.io)

---

## 📸 Screenshots

### Homepage
![Agora Homepage](public/hero-bg.jpg)

### Marketplace
![Marketplace](public/marketplace-preview.jpg)

### Foundry Builder
![Foundry Builder](public/foundry-preview.jpg)

---

## 🏆 Wave 2 Achievements

✅ Real Conway Testnet integration (not simulated)  
✅ 11 blockchain blocks created on live validators  
✅ Markets permanently stored on-chain  
✅ Frontend connected to real Conway validators  
✅ Sub-50ms GraphQL query latency  
✅ Zero contract panics - production-ready code  
✅ Full marketplace UI with real-time updates  
✅ Game leaderboard + profile pages (bonus features)  
✅ Cross-chain messaging implemented  
✅ Wallet integration with Conway faucet  
✅ Comprehensive documentation  

---

**Built with ❤️ on Linera Blockchain**

*Agora - Where predictions meet blockchain reality*
