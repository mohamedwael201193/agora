import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NetworkMode } from "../lib/networkConfig";
import type { LineraWallet } from "../lib/wallet";
import { IndexedDBWalletStorage } from "../lib/wallet";

const walletStorage = new IndexedDBWalletStorage();

export interface Notification {
  id: string;
  type:
    | "bet_placed"
    | "market_resolved"
    | "position_updated"
    | "chain_message"
    | "system";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  data?: any;
}

export interface LatencyMetrics {
  mutation: number;
  notification: number;
  endToEnd: number;
}

export interface Market {
  id: string;
  marketId?: number;
  question: string;
  description?: string;
  category: string;
  yesOdds: number;
  noOdds: number;
  volume: string;
  participants: number;
  endsIn: string;
  trending: boolean;
  chainId?: string;
}

export interface Position {
  id: string;
  marketId: string;
  side: "YES" | "NO";
  amount: number;
  odds: number;
  fees: {
    maker: number;
    taker: number;
    protocol: number;
    total: number;
  };
  payoutEst: number;
  timestamp: number;
  status: "open" | "closed" | "settled";
}

export type Badge = "none" | "bronze" | "silver" | "gold" | "platinum";

export interface GameRound {
  roundNumber: number;
  probability: number; // 0-100
  outcome: boolean; // true = YES, false = NO
  brierScore: number;
  timestamp: number;
}

export interface GameResult {
  id: string;
  finalScore: number; // Average Brier score
  percentileScore: number; // Percentile (0-100)
  badge: Badge;
  totalRounds: number;
  rounds: GameRound[];
  timestamp: number;
  overconfident: boolean;
  underconfident: boolean;
}

export interface CurrentGame {
  roundNumber: number;
  rounds: GameRound[];
  startedAt: number;
}

export interface TransportConfig {
  mode: "mock" | "local-replica" | "custom";
  faucetUrl: string;
  validatorUrl: string;
}

interface AgoraStore {
  // Chain state
  chainId: string | null;
  isConnected: boolean;
  address: string | null;

  // Wallet state (Conway testnet integration)
  wallet: LineraWallet | null;
  network: NetworkMode;
  walletLoading: boolean;

  // Real-time metrics
  latency: LatencyMetrics;

  // Notifications
  notifications: Notification[];
  unreadCount: number;

  // Markets & positions
  markets: Market[];
  userPositions: Position[];

  // Demo: Counter
  counterValue: number;

  // Demo: Wallet
  balances: Record<string, number>;

  // Game: Confidence Flip
  bestScore: number;
  totalGames: number;
  gameHistory: GameResult[];
  currentGame: CurrentGame | null;

  // Developer settings
  transport: TransportConfig;
  showNotificationFeed: boolean;
  showPerformanceMetrics: boolean;

  // Linera Chain Integration
  lineraMode: "live" | "sim";
  chainConnected: boolean;
  lastChainWrite: number | null;
  chainEventCount: number;
  chainError: string | null;

  // Actions - Chain
  connectChain: (id: string, address: string) => void;
  disconnectChain: () => void;

  // Actions - Wallet
  setWallet: (wallet: LineraWallet) => Promise<void>;
  clearWallet: () => Promise<void>;
  loadWallet: () => Promise<void>;
  setNetwork: (network: NetworkMode) => void;

  // Actions - Notifications
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // Actions - Latency
  updateLatency: (metrics: Partial<LatencyMetrics>) => void;

  // Actions - Markets
  setMarkets: (markets: Market[]) => void;
  updateMarket: (id: string, updates: Partial<Market>) => void;

  // Actions - Positions
  addPosition: (position: Omit<Position, "id" | "timestamp">) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  getPositionsByMarket: (marketId: string) => Position[];

  // Actions - Counter
  incrementCounter: () => void;
  decrementCounter: () => void;
  resetCounter: () => void;

  // Actions - Wallet
  sendTokens: (
    token: string,
    amount: number,
    toAddress: string
  ) => Promise<void>;
  updateBalance: (token: string, amount: number) => void;

  // Actions - Game
  startGame: () => void;
  submitRound: (
    probability: number,
    outcome: boolean,
    brierScore: number
  ) => void;
  finishGame: (
    finalScore: number,
    percentileScore: number,
    badge: Badge
  ) => void;
  abandonGame: () => void;

  // Actions - Linera Chain
  setLineraMode: (mode: "live" | "sim") => void;
  setChainConnected: (connected: boolean) => void;
  recordChainWrite: () => void;
  setChainError: (error: string | null) => void;

  // Actions - Developer
  setTransport: (transport: Partial<TransportConfig>) => void;
  toggleNotificationFeed: () => void;
  togglePerformanceMetrics: () => void;
}

export const useAgoraStore = create<AgoraStore>()(
  persist(
    (set): AgoraStore => ({
      // Initial state
      chainId: null,
      isConnected: false,
      address: null,
      
      // Wallet state
      wallet: null,
      network: (import.meta.env.VITE_NETWORK as NetworkMode) || 'local',
      walletLoading: false,
      
      latency: {
        mutation: 247,
        notification: 89,
        endToEnd: 336,
      },
      notifications: [],
      unreadCount: 0,
      markets: [],
      userPositions: [],
      counterValue: 0,
      balances: {
        AGORA: 1000,
        USDC: 500,
        LINERA: 250,
      },
      bestScore: 0,
      totalGames: 0,
      gameHistory: [],
      currentGame: null,
      transport: {
        mode: "mock" as const,
        faucetUrl: "https://faucet.devnet.linera.net",
        validatorUrl: "https://validator.devnet.linera.net",
      },
      showNotificationFeed: false,
      showPerformanceMetrics: true,

      // Linera Chain Integration
      lineraMode: "sim" as const,
      chainConnected: false,
      lastChainWrite: null,
      chainEventCount: 0,
      chainError: null,

      // Chain actions
      connectChain: (id, address) =>
        set({
          chainId: id,
          address,
          isConnected: true,
        }),

      disconnectChain: () =>
        set({
          chainId: null,
          address: null,
          isConnected: false,
        }),

      // Wallet actions
      setWallet: async (wallet) => {
        set({ walletLoading: true });
        try {
          await walletStorage.save(wallet);
          set({ 
            wallet, 
            walletLoading: false,
            // Also update chain connection state
            chainId: wallet.chainId,
            isConnected: true,
          });
          console.log('[Store] Wallet saved:', wallet.chainId);
        } catch (error) {
          console.error('[Store] Failed to save wallet:', error);
          set({ walletLoading: false });
        }
      },

      clearWallet: async () => {
        set({ walletLoading: true });
        try {
          await walletStorage.clear();
          set({ 
            wallet: null, 
            walletLoading: false,
            chainId: null,
            isConnected: false,
          });
          console.log('[Store] Wallet cleared');
        } catch (error) {
          console.error('[Store] Failed to clear wallet:', error);
          set({ walletLoading: false });
        }
      },

      loadWallet: async () => {
        set({ walletLoading: true });
        try {
          const wallet = await walletStorage.load();
          if (wallet) {
            set({ 
              wallet, 
              walletLoading: false,
              chainId: wallet.chainId,
              isConnected: true,
              network: wallet.network,
            });
            console.log('[Store] Wallet loaded:', wallet.chainId);
          } else {
            set({ walletLoading: false });
            console.log('[Store] No wallet found');
          }
        } catch (error) {
          console.error('[Store] Failed to load wallet:', error);
          set({ walletLoading: false });
        }
      },

      setNetwork: (network) => {
        set({ network });
        console.log('[Store] Network switched to:', network);
      },

      // Notification actions
      addNotification: (notification) =>
        set((state) => {
          const newNotification: Notification = {
            ...notification,
            id: `notif_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            timestamp: Date.now(),
            read: false,
          };
          return {
            notifications: [newNotification, ...state.notifications].slice(
              0,
              50
            ), // Keep last 50
            unreadCount: state.unreadCount + 1,
          };
        }),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),

      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      clearNotifications: () =>
        set({
          notifications: [],
          unreadCount: 0,
        }),

      // Latency actions
      updateLatency: (metrics) =>
        set((state) => ({
          latency: { ...state.latency, ...metrics },
        })),

      // Market actions
      setMarkets: (markets) => set({ markets }),

      updateMarket: (id, updates) =>
        set((state) => ({
          markets: state.markets.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),

      // Position actions
      addPosition: (position) =>
        set((state) => {
          const newPosition: Position = {
            ...position,
            id: `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
          };
          return {
            userPositions: [newPosition, ...state.userPositions],
          };
        }),

      updatePosition: (id, updates) =>
        set((state) => ({
          userPositions: state.userPositions.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      getPositionsByMarket: (marketId) => {
        const state = useAgoraStore.getState();
        return state.userPositions.filter((p) => p.marketId === marketId);
      },

      // Counter actions
      incrementCounter: () =>
        set((state) => ({
          counterValue: state.counterValue + 1,
        })),

      decrementCounter: () =>
        set((state) => ({
          counterValue: state.counterValue - 1,
        })),

      resetCounter: () =>
        set({
          counterValue: 0,
        }),

      // Wallet actions
      sendTokens: async (token, amount, toAddress) => {
        // This is a mock implementation - in production would interact with Linera chain
        set((state) => ({
          balances: {
            ...state.balances,
            [token]: state.balances[token] - amount,
          },
        }));
      },

      updateBalance: (token, amount) =>
        set((state) => ({
          balances: {
            ...state.balances,
            [token]: amount,
          },
        })),

      // Game actions
      startGame: () =>
        set({
          currentGame: {
            roundNumber: 1,
            rounds: [],
            startedAt: Date.now(),
          },
        }),

      submitRound: (probability, outcome, brierScore) =>
        set((state) => {
          if (!state.currentGame) return state;

          const newRound: GameRound = {
            roundNumber: state.currentGame.roundNumber,
            probability,
            outcome,
            brierScore,
            timestamp: Date.now(),
          };

          return {
            currentGame: {
              ...state.currentGame,
              roundNumber: state.currentGame.roundNumber + 1,
              rounds: [...state.currentGame.rounds, newRound],
            },
          };
        }),

      finishGame: (finalScore, percentileScore, badge) =>
        set((state) => {
          if (!state.currentGame) return state;

          // Calculate over/underconfidence
          const avgProbability =
            state.currentGame.rounds.reduce(
              (sum, r) => sum + r.probability,
              0
            ) / state.currentGame.rounds.length;
          const yesOutcomes = state.currentGame.rounds.filter(
            (r) => r.outcome
          ).length;
          const actualYesRate =
            (yesOutcomes / state.currentGame.rounds.length) * 100;

          const overconfident = avgProbability > actualYesRate + 10;
          const underconfident = avgProbability < actualYesRate - 10;

          const gameResult: GameResult = {
            id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            finalScore,
            percentileScore,
            badge,
            totalRounds: state.currentGame.rounds.length,
            rounds: state.currentGame.rounds,
            timestamp: Date.now(),
            overconfident,
            underconfident,
          };

          return {
            currentGame: null,
            totalGames: state.totalGames + 1,
            bestScore: Math.max(state.bestScore, percentileScore),
            gameHistory: [gameResult, ...state.gameHistory].slice(0, 50), // Keep last 50
          };
        }),

      abandonGame: () =>
        set({
          currentGame: null,
        }),

      // Developer actions
      setTransport: (transport) =>
        set((state) => ({
          transport: { ...state.transport, ...transport },
        })),

      toggleNotificationFeed: () =>
        set((state) => ({
          showNotificationFeed: !state.showNotificationFeed,
        })),

      togglePerformanceMetrics: () =>
        set((state) => ({
          showPerformanceMetrics: !state.showPerformanceMetrics,
        })),

      // Linera Chain actions
      setLineraMode: (mode) =>
        set({
          lineraMode: mode,
        }),

      setChainConnected: (connected) =>
        set({
          chainConnected: connected,
        }),

      recordChainWrite: () =>
        set((state) => ({
          lastChainWrite: Date.now(),
          chainEventCount: state.chainEventCount + 1,
          chainError: null,
        })),

      setChainError: (error) =>
        set({
          chainError: error,
        }),
    }),
    {
      name: "agora-storage",
      partialize: (state) => ({
        chainId: state.chainId,
        address: state.address,
        isConnected: state.isConnected,
        transport: state.transport,
        notifications: state.notifications.slice(0, 20), // Persist only last 20
        counterValue: state.counterValue,
        balances: state.balances,
        userPositions: state.userPositions,
        bestScore: state.bestScore,
        totalGames: state.totalGames,
        gameHistory: state.gameHistory.slice(0, 20), // Persist last 20 games
        currentGame: state.currentGame,
      }),
    }
  )
);
