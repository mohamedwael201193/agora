/**
 * Game Bridge for Agora Counter Integration
 * Links ChronoEchoes game to deployed Linera counter application
 */

import { GameRoundEvent, lineraClient } from '../services/lineraClient';

export interface GameStats {
  totalRounds: number;
  currentValue: number;
  lastIncrement?: string;
  chainConnected: boolean;
  mode: "live" | "sim";
}

export interface IncrementResult {
  success: boolean;
  transactionHash?: string;
  newValue?: number;
  error?: string;
}

class GameBridge {
  private isInitialized: boolean = false;

  /**
   * Initialize the game bridge connection
   */
  async initialize(): Promise<boolean> {
    try {
      await lineraClient.initialize();
      this.isInitialized = true;
      console.log("GameBridge initialized successfully");
      return true;
    } catch (error) {
      console.error("GameBridge initialization failed:", error);
      return false;
    }
  }

  /**
   * Handle game round completion - increments counter on chain
   */
  async onGameRoundComplete(
    roundData: Omit<GameRoundEvent, "timestamp" | "chainId" | "receiptId">
  ): Promise<IncrementResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Call increment on the counter application
      const incrementResult = await lineraClient.increment();
      
      if (!incrementResult.success) {
        return {
          success: false,
          error: incrementResult.error,
        };
      }

      // Read the new value
      const valueResult = await lineraClient.readValue();
      
      // Also record the game round event
      await lineraClient.writeGameRound(roundData);

      return {
        success: true,
        transactionHash: incrementResult.transactionHash,
        newValue: valueResult.success ? valueResult.value : undefined,
      };
    } catch (error) {
      console.error("Game round increment failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Increment failed",
      };
    }
  }

  /**
   * Get current game statistics from the counter
   */
  async getGameStats(): Promise<GameStats> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const clientState = lineraClient.getState();
    const valueResult = await lineraClient.readValue();

    return {
      totalRounds: clientState.eventCount,
      currentValue: valueResult.success ? valueResult.value! : 0,
      chainConnected: clientState.isConnected,
      mode: clientState.mode,
    };
  }

  /**
   * Test the chain connection
   */
  async testConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
      const connected = await lineraClient.testConnection();
      return { connected };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : "Connection test failed",
      };
    }
  }

  /**
   * Get the GraphQL playground URL for judges
   */
  getGraphQLPlaygroundURL(): string {
    const { config } = lineraClient.getState();
    return `${config.graphqlEndpoint}`;
  }

  /**
   * Get sample GraphQL query for counter inspection
   */
  getSampleCounterQuery(): string {
    const { config } = lineraClient.getState();
    return `# Query the counter value on chain ${config.chainId.slice(0, 16)}...
query CounterValue {
  value
}

# Sample mutation (if supported)
mutation IncrementCounter {
  increment
}`;
  }

  /**
   * Force manual increment (for testing)
   */
  async manualIncrement(): Promise<IncrementResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return await lineraClient.increment();
  }

  /**
   * Read current counter value
   */
  async readCounter(): Promise<{ success: boolean; value?: number; error?: string }> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return await lineraClient.readValue();
  }
}

// Export singleton instance
export const gameBridge = new GameBridge();

// Utility functions for UI components
export const formatChainId = (chainId: string): string => {
  return `${chainId.slice(0, 8)}...${chainId.slice(-8)}`;
};

export const formatApplicationId = (appId: string): string => {
  return `${appId.slice(0, 12)}...${appId.slice(-8)}`;
};

export const formatTransactionHash = (hash: string): string => {
  if (hash.startsWith('sim_')) {
    return `${hash} (simulated)`;
  }
  return hash.length > 20 ? `${hash.slice(0, 10)}...${hash.slice(-6)}` : hash;
};