/**
 * Network-Aware Linera GraphQL Client
 * Auto-switches between local and Conway testnet endpoints
 */

import { getApplicationGraphQLEndpoint, getNetworkConfig, type NetworkMode } from './networkConfig';

export interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

export class LineraClientError extends Error {
  constructor(
    message: string,
    public readonly errors?: GraphQLResponse['errors'],
    public readonly response?: Response
  ) {
    super(message);
    this.name = 'LineraClientError';
  }
}

/**
 * Network-aware Linera GraphQL client
 */
export class LineraClient {
  private network: NetworkMode;
  private defaultTimeout = 10000; // 10 seconds

  constructor(network: NetworkMode = 'local') {
    this.network = network;
  }

  /**
   * Switch network mode
   */
  setNetwork(network: NetworkMode): void {
    this.network = network;
    console.log('[LineraClient] Switched to network:', network);
  }

  /**
   * Get current network mode
   */
  getNetwork(): NetworkMode {
    return this.network;
  }

  /**
   * Execute GraphQL query on application
   */
  async query<T = any>(
    chainId: string,
    applicationId: string,
    request: GraphQLRequest
  ): Promise<T> {
    const endpoint = getApplicationGraphQLEndpoint(chainId, applicationId, this.network);
    return this.executeQuery<T>(endpoint, request);
  }

  /**
   * Execute GraphQL query on chain
   */
  async chainQuery<T = any>(
    chainId: string,
    request: GraphQLRequest
  ): Promise<T> {
    const config = getNetworkConfig(this.network);
    const endpoint = `${config.validatorUrl}/chains/${chainId}`;
    return this.executeQuery<T>(endpoint, request);
  }

  /**
   * Execute GraphQL mutation
   */
  async mutate<T = any>(
    chainId: string,
    applicationId: string,
    request: GraphQLRequest
  ): Promise<T> {
    return this.query<T>(chainId, applicationId, request);
  }

  /**
   * Execute raw GraphQL request
   */
  private async executeQuery<T>(endpoint: string, request: GraphQLRequest): Promise<T> {
    try {
      console.log('[LineraClient] Query:', endpoint, request.operationName || 'unnamed');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this.defaultTimeout),
      });

      if (!response.ok) {
        throw new LineraClientError(
          `HTTP ${response.status}: ${response.statusText}`,
          undefined,
          response
        );
      }

      const result: GraphQLResponse<T> = await response.json();

      if (result.errors && result.errors.length > 0) {
        const errorMessages = result.errors.map(e => e.message).join(', ');
        throw new LineraClientError(
          `GraphQL errors: ${errorMessages}`,
          result.errors
        );
      }

      if (!result.data) {
        throw new LineraClientError('No data in GraphQL response');
      }

      return result.data;
    } catch (error) {
      if (error instanceof LineraClientError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new LineraClientError(`Query failed: ${message}`);
    }
  }

  /**
   * Batch execute multiple queries (useful for parallel requests)
   */
  async batchQuery<T = any>(
    chainId: string,
    applicationId: string,
    requests: GraphQLRequest[]
  ): Promise<T[]> {
    const promises = requests.map(req => this.query<T>(chainId, applicationId, req));
    return Promise.all(promises);
  }

  /**
   * Subscribe to GraphQL subscription (WebSocket)
   * Note: Conway testnet may not support subscriptions
   */
  subscribe(
    chainId: string,
    applicationId: string,
    request: GraphQLRequest,
    onData: (data: any) => void,
    onError?: (error: Error) => void
  ): () => void {
    const config = getNetworkConfig(this.network);
    const wsEndpoint = getApplicationGraphQLEndpoint(chainId, applicationId, this.network)
      .replace('http://', 'ws://')
      .replace('https://', 'wss://');

    try {
      const ws = new WebSocket(wsEndpoint);

      ws.onopen = () => {
        console.log('[LineraClient] WebSocket connected');
        ws.send(JSON.stringify(request));
      };

      ws.onmessage = (event) => {
        try {
          const response: GraphQLResponse = JSON.parse(event.data);
          if (response.data) {
            onData(response.data);
          }
          if (response.errors && onError) {
            onError(new LineraClientError('Subscription error', response.errors));
          }
        } catch (error) {
          if (onError) {
            onError(error instanceof Error ? error : new Error('Parse error'));
          }
        }
      };

      ws.onerror = (event) => {
        console.error('[LineraClient] WebSocket error:', event);
        if (onError) {
          onError(new Error('WebSocket connection error'));
        }
      };

      ws.onclose = () => {
        console.log('[LineraClient] WebSocket closed');
      };

      // Return cleanup function
      return () => {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
      };
    } catch (error) {
      console.error('[LineraClient] Failed to create WebSocket:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error('WebSocket creation failed'));
      }
      return () => {}; // No-op cleanup
    }
  }

  /**
   * Health check for current network
   */
  async healthCheck(): Promise<boolean> {
    try {
      const config = getNetworkConfig(this.network);
      const response = await fetch(`${config.validatorUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch (error) {
      console.warn('[LineraClient] Health check failed:', error);
      return false;
    }
  }

  /**
   * Get network info
   */
  getNetworkInfo() {
    return getNetworkConfig(this.network);
  }
}

/**
 * Global client instance (can be switched between networks)
 */
let globalClient: LineraClient | null = null;

/**
 * Get or create global Linera client
 */
export function getLineraClient(network?: NetworkMode): LineraClient {
  if (!globalClient) {
    const envNetwork = import.meta.env.VITE_NETWORK as NetworkMode | undefined;
    globalClient = new LineraClient(network || envNetwork || 'local');
  } else if (network && globalClient.getNetwork() !== network) {
    globalClient.setNetwork(network);
  }
  return globalClient;
}

/**
 * Create new isolated client instance
 */
export function createLineraClient(network: NetworkMode = 'local'): LineraClient {
  return new LineraClient(network);
}

// Legacy exports for backwards compatibility
export const CONWAY_CONFIG = {
  chainId: import.meta.env.VITE_LINERA_CHAIN_ID || "PLACEHOLDER_CHAIN_ID",
  applicationId: import.meta.env.VITE_LINERA_APP_ID || "PLACEHOLDER_APP_ID",
  faucetUrl: import.meta.env.VITE_LINERA_FAUCET_URL || "https://faucet.testnet-conway.linera.net",
  validatorUrl: import.meta.env.VITE_LINERA_VALIDATOR_URL || "https://validator.testnet-conway.linera.net",
};

// Legacy mock client for LineraDemo.tsx
class LineraCounterClient {
  async connect() {
    return true;
  }

  async queryState() {
    return {
      counter: Math.floor(Math.random() * 100),
      owner: 'mock_owner',
    };
  }

  async executeOperation(_op: any) {
    return `0x${Date.now().toString(16)}`;
  }

  getStatus() {
    return {
      isConnected: true,
      config: CONWAY_CONFIG,
      lastError: null,
      crossOriginIsolated: false,
    };
  }
}

export const lineraClient = new LineraCounterClient();

export const formatChainId = (chainId: string): string => {
  return chainId.length > 16 
    ? `${chainId.slice(0, 8)}...${chainId.slice(-6)}`
    : chainId;
};

export const formatAppId = (appId: string): string => {
  return appId.length > 16
    ? `${appId.slice(0, 8)}...${appId.slice(-6)}`
    : appId;
};

// Initialize default global client
const envNetwork = import.meta.env.VITE_NETWORK as NetworkMode | undefined;
globalClient = new LineraClient(envNetwork || 'local');
