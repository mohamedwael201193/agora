import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'bet_placed' | 'market_resolved' | 'position_updated' | 'chain_message' | 'system';
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
  side: 'yes' | 'no';
  amount: number;
  odds: number;
  timestamp: number;
  status: 'open' | 'closed' | 'settled';
}

export interface TransportConfig {
  mode: 'mock' | 'local-replica' | 'custom';
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

  // Developer settings
  transport: TransportConfig;
  showNotificationFeed: boolean;
  showPerformanceMetrics: boolean;

  // Actions - Chain
  connectChain: (id: string, address: string) => void;
  disconnectChain: () => void;

  // Actions - Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // Actions - Latency
  updateLatency: (metrics: Partial<LatencyMetrics>) => void;

  // Actions - Markets
  setMarkets: (markets: Market[]) => void;
  updateMarket: (id: string, updates: Partial<Market>) => void;

  // Actions - Positions
  addPosition: (position: Position) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;

  // Actions - Developer
  setTransport: (transport: Partial<TransportConfig>) => void;
  toggleNotificationFeed: () => void;
  togglePerformanceMetrics: () => void;
}

export const useAgoraStore = create<AgoraStore>()(
  persist(
    (set) => ({
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
      transport: {
        mode: 'mock',
        faucetUrl: 'https://faucet.devnet.linera.net',
        validatorUrl: 'https://validator.devnet.linera.net',
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
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            read: false,
          };
          return {
            notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
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
        set((state) => ({
          userPositions: [position, ...state.userPositions],
        })),

      updatePosition: (id, updates) =>
        set((state) => ({
          userPositions: state.userPositions.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

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
      name: 'agora-storage',
      partialize: (state) => ({
        chainId: state.chainId,
        address: state.address,
        isConnected: state.isConnected,
        transport: state.transport,
        notifications: state.notifications.slice(0, 20), // Persist only last 20
      }),
    }
  )
);
