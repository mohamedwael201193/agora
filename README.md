<div align="center">

# 🏛️ AGORA

### The Future of Decentralized Prediction Markets

**Conway Testnet • No Real Value • Learn & Experiment Safely**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

[🎮 Live Demo](https://agora-rho.vercel.app/) • [📖 Documentation](#documentation) • [🗺️ Roadmap](#roadmap) • [🤝 Contributing](#contributing) • [🐦 Follow DEVMO](https://x.com/Mowael777)

</div>

---

## 🌟 Overview

**Agora** is a next-generation decentralized prediction market platform built on Cardano. We're revolutionizing how people create, discover, and participate in prediction markets through cutting-edge blockchain technology, elegant UX design, and gamified learning experiences.

### ✨ Key Features

- 🎯 **Confidence Flip Game** - Master prediction accuracy with our Brier-scored training game
- 🏗️ **Foundry Builder** - Drag-and-drop market creation with visual component assembly
- 📊 **Real-Time Marketplace** - Browse and trade on live prediction markets
- 🎓 **Gamified Learning** - Earn badges and track your forecasting improvement
- ⚡ **Lightning Fast** - Real-time updates with optimistic UI patterns
- 🎨 **Beautiful UI** - Glass morphism design with smooth animations
- 🔗 **Cardano Native** - Full blockchain integration for trustless markets

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (recommended: install via [nvm](https://github.com/nvm-sh/nvm))
- **npm** or **bun** package manager
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/mohamedwael201193/agora.git

# Navigate to project directory
cd agora

# Install dependencies
npm install
# or with bun
bun install

# Start development server
npm run dev
# or with bun
bun run dev
```

The app will be available at `http://localhost:5173` 🎉

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## 🏗️ Tech Stack

### Core Framework

- **[React 18.3](https://react.dev/)** - UI library with concurrent features
- **[TypeScript 5.6](https://www.typescriptlang.org/)** - Type-safe development
- **[Vite 5.4](https://vitejs.dev/)** - Lightning-fast build tool with HMR

### State Management & Data

- **[Zustand 5.0](https://github.com/pmndrs/zustand)** - Lightweight state management with persistence
- **[TanStack Query 5.8](https://tanstack.com/query)** - Powerful async state management
- **[TanStack Router 1.94](https://tanstack.com/router)** - Type-safe routing

### UI & Styling

- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible component library
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI primitives
- **[Framer Motion 12.2](https://www.framer.com/motion/)** - Smooth animations and transitions
- **[Lucide React](https://lucide.dev/)** - Modern icon library

### Drag & Drop

- **[@dnd-kit 6.3](https://dndkit.com/)** - Modern drag-and-drop toolkit

### Development Tools

- **[ESLint 9.17](https://eslint.org/)** - Code linting with TypeScript support
- **[PostCSS](https://postcss.org/)** - CSS transformations
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - Vendor prefix automation

---

## 📁 Project Structure

```
agora/
├── public/
│   ├── favicon.svg          # App favicon & logo
│   ├── robots.txt           # SEO crawler config
│   └── site.webmanifest     # PWA manifest
├── src/
│   ├── components/          # React components
│   │   ├── common/          # Shared components (DemoModePill, StatChip, etc.)
│   │   ├── game/            # Game-specific components
│   │   ├── notifications/   # Notification system
│   │   ├── realtime/        # Real-time HUD components
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.tsx   # Mobile detection
│   │   ├── use-toast.ts     # Toast notifications
│   │   └── useNotifications.ts # Notification management
│   ├── lib/
│   │   └── utils.ts         # Utility functions (cn, etc.)
│   ├── pages/               # Route pages
│   │   ├── Index.tsx        # Home page
│   │   ├── Marketplace.tsx  # Market browser
│   │   ├── game/            # Game pages
│   │   │   └── Confidence.tsx # Confidence Flip game
│   │   ├── FoundryBuilder.tsx # Market creation tool
│   │   ├── Roadmap.tsx      # Development roadmap
│   │   ├── Profile.tsx      # User profile
│   │   └── Connect.tsx      # Chain connection
│   ├── stores/              # Zustand stores
│   │   └── useAgoraStore.ts # Global app state
│   ├── App.tsx              # App root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML entry
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies & scripts
```

---

## 🎮 Features Deep Dive

### 🎯 Confidence Flip Game

A 10-round prediction game designed to train forecasters using the Brier scoring system:

- **Calibration Training** - Learn to match your confidence to actual probabilities
- **Brier Score Feedback** - Real-time accuracy measurement
- **Achievement System** - Earn badges (Bronze, Silver, Gold, Diamond, Legendary)
- **Percentile Ranking** - See how you compare to other players
- **History Tracking** - Review all past games and improvement

### 🏗️ Foundry Builder

Visual market creation tool with drag-and-drop interface:

- **Component Palette** - Question blocks, outcome options, oracles, liquidity pools
- **Canvas Preview** - Real-time visual assembly
- **Template Library** - Pre-built market templates
- **Deployment Simulation** - Test market configuration before launch
- **Color-Coded Components** - Intuitive categorization (orange, blue, purple, cyan)

### 📊 Marketplace

Browse and interact with prediction markets:

- **Category Filtering** - Politics, Sports, Crypto, Science, Entertainment
- **Market Cards** - Beautiful cards with live data
- **Real-Time Updates** - Live probability changes
- **Liquidity Pools** - AMM-based market making

### 🎨 Design System

- **Glass Morphism** - Frosted glass effects with backdrop blur
- **Gradient Accents** - Orange-to-blue brand gradients
- **Dark Theme** - Eye-friendly dark mode throughout
- **Smooth Animations** - Framer Motion powered transitions
- **Responsive Design** - Mobile-first approach

---

## 🗺️ Roadmap

### Wave 1: Foundation (Oct 20 - Nov 3, 2024) ✅

- Market creation and browsing
- Basic wallet integration
- Core UI components
- Demo mode with mock data
- Confidence Flip game v1

### Wave 2: Intelligence (Nov 4 - Nov 17, 2024) ✅

- Advanced prediction algorithms
- Market analytics dashboard
- Historical data visualization
- User profile system
- Achievement badges

### Wave 3: Scale (Nov 18 - Dec 1, 2024) 🚧

- Multi-chain support
- Advanced market types
- Liquidity incentives
- API documentation

### Wave 4: Community (Dec 2 - Dec 15, 2024) 📅

- Social features
- Leaderboards
- Referral system
- Community governance

### Wave 5: Refinement (Dec 16 - Dec 29, 2024) 📅

- Performance optimization
- Mobile app beta
- Security audits
- Bug fixes and polish

### Wave 6: Launch (Dec 30, 2024 - Jan 21, 2025) 🎯

- Mainnet deployment
- Marketing campaign
- Partnership announcements
- Public launch event

---

## 🛠️ Development

### Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Build for development (with source maps)
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_APP_NAME=Agora
VITE_NETWORK=conway-testnet
VITE_API_URL=https://api.agora.dev
```

### Code Style

- **TypeScript Strict Mode** - Full type safety
- **ESLint** - Consistent code formatting
- **Component Structure** - Function components with hooks
- **File Organization** - Colocation of related components
- **Naming Conventions** - PascalCase for components, camelCase for functions

---

## 🎨 Design Tokens

### Colors

```css
--orange-primary: #FF6B35     /* Primary brand */
--blue-electric: #4ECDC4      /* Accent */
--purple-deep: #9D4EDD        /* Secondary */
--cyan-bright: #06FFA5        /* Success */
```

### Typography

- **Font Family**: Inter (system font stack)
- **Heading Scale**: 4xl → 6xl for major headings
- **Body**: Base size with responsive scaling

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Write clear, self-documenting code
- Add TypeScript types for all new code
- Test components thoroughly
- Follow existing code style
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Live Demo**: [https://agora-rho.vercel.app/](https://agora-rho.vercel.app/)
- **Developer**: [Mohamed Wael (DEVMO)](https://x.com/Mowael777)
- **GitHub**: [mohamedwael201193](https://github.com/mohamedwael201193)
- **Documentation**: Coming soon
- **Discord**: Coming soon

---

## 🙏 Acknowledgments

Built with ❤️ by [Mohamed Wael (DEVMO)](https://x.com/Mowael777) using:

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Cardano](https://cardano.org/) - Blockchain foundation
- [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) - Modern web development

---

<div align="center">

**⚠️ Conway Testnet - No Real Value - Learn & Experiment Safely ⚠️**

Made with 🧡 for the Cardano community by [DEVMO](https://x.com/Mowael777)

[⬆ Back to Top](#-agora)

</div>
