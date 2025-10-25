import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  question: string;
  category: string;
  yesOdds: number;
  noOdds: number;
  volume: string;
  participants: number;
  endsIn: string;
  trending: boolean;
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

  // Actions - Chain
  connectChain: (id: string, address: string) => void;
  disconnectChain: () => void;

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
