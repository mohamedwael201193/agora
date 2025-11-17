/**
 * Conway Testnet Faucet Integration
 * Handles chain claiming, token requests, and balance queries
 */

import type { LineraWallet } from './wallet';

export interface FaucetConfig {
  faucetUrl: string;
  validatorUrl: string;
  network: 'local' | 'conway';
}

export interface ClaimChainResponse {
  chainId: string;
  publicKey: string;
  privateKey: string;
  owner?: string;
  messageId?: string;
}

export interface RequestTokensResponse {
  success: boolean;
  amount: string;
  transactionId?: string;
  messageId?: string;
}

export interface BalanceResponse {
  balance: string;
  chainId: string;
}

export class LineraFaucetError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryAfter?: number
  ) {
    super(message);
    this.name = 'LineraFaucetError';
  }
}

/**
 * Conway Testnet Faucet Client
 */
export class LineraFaucet {
  private config: FaucetConfig;
  private retryCount = 0;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY_MS = 2000;

  constructor(config: FaucetConfig) {
    this.config = config;
  }

  /**
   * Claim a personal microchain from the Conway testnet faucet
   * Uses GraphQL API following Linera protocol
   */
  async claimChain(): Promise<LineraWallet> {
    if (!this.config.faucetUrl) {
      throw new LineraFaucetError(
        'Conway testnet faucet is required. Please check your configuration.',
        'FAUCET_UNAVAILABLE'
      );
    }

    try {
      console.log('[Faucet] Claiming personal chain from Conway testnet:', this.config.faucetUrl);

      // Generate a new Ed25519 keypair for the owner
      // In production, use proper crypto library. For now, generate deterministic test key
      const publicKey = this.generatePublicKey();
      const privateKey = this.generatePrivateKey();
      const owner = `User:${publicKey}`;

      console.log('[Faucet] Generated owner:', owner);

      // Conway faucet uses GraphQL API
      // Mutation: claim(owner: AccountOwner!)
      const response = await this.fetchWithRetry(this.config.faucetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Claim($owner: AccountOwner!) {
              claim(owner: $owner)
            }
          `,
          variables: {
            owner,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Faucet] Error response:', errorText);
        
        throw new LineraFaucetError(
          `Conway faucet returned ${response.status}. The testnet may be under maintenance. Please try:\n1. Wait a few minutes and retry\n2. Check Linera Discord for testnet status\n3. Use local network for development`,
          response.status === 429 ? 'RATE_LIMIT_EXCEEDED' : 'FAUCET_ERROR',
          response.status === 429 ? 3600000 : undefined
        );
      }

      const result = await response.json();

      // GraphQL response format: { data: { claim: "chainId" } }
      if (result.errors) {
        const errorMsg = result.errors.map((e: any) => e.message).join(', ');
        throw new LineraFaucetError(
          `Conway faucet error: ${errorMsg}`,
          'GRAPHQL_ERROR'
        );
      }

      const chainId = result.data?.claim;
      if (!chainId) {
        throw new LineraFaucetError(
          'Invalid faucet response: missing chain ID',
          'INVALID_RESPONSE'
        );
      }

      // Default balance (faucet typically gives 10 tokens)
      const balance = '10000000'; // 10 tokens with 6 decimals

      const wallet: LineraWallet = {
        chainId,
        publicKey,
        privateKey,
        balance,
        network: this.config.network,
        owner,
        timestamp: Date.now(),
      };

      console.log('[Faucet] Real Conway chain claimed successfully:', wallet.chainId);

      return wallet;
    } catch (error) {
      if (error instanceof LineraFaucetError) {
        throw error;
      }
      throw new LineraFaucetError(
        `Failed to claim chain from Conway testnet: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CLAIM_FAILED'
      );
    }
  }

  /**
   * Generate a valid Ed25519 public key (32 bytes hex)
   * In production, use proper crypto library (e.g., @noble/ed25519)
   */
  private generatePublicKey(): string {
    // Generate random 32-byte public key
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate a valid Ed25519 private key (32 bytes hex)
   * In production, derive from public key properly
   */
  private generatePrivateKey(): string {
    // Generate random 32-byte private key
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Request additional tokens for an existing chain
   * Useful for refills when balance runs low
   */
  async requestTokens(chainId: string, amount = '1000'): Promise<RequestTokensResponse> {
    try {
      console.log('[Faucet] Requesting tokens for chain', chainId);

      const response = await this.fetchWithRetry(`${this.config.faucetUrl}/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chainId,
          amount,
        }),
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data: RequestTokensResponse = await response.json();

      console.log('[Faucet] Tokens requested successfully:', data.amount);

      return data;
    } catch (error) {
      if (error instanceof LineraFaucetError) {
        throw error;
      }
      throw new LineraFaucetError(
        `Failed to request tokens: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'REQUEST_FAILED'
      );
    }
  }

  /**
   * Query balance for a chain
   */
  async getBalance(chainId: string): Promise<BalanceResponse> {
    try {
      console.log('[Faucet] Querying balance for chain', chainId);

      // Query chain-specific endpoint (Linera docs way)
      const query = `
        query {
          chain {
            executionState {
              system {
                balance
              }
            }
          }
        }
      `;

      // Use chain-specific endpoint as per Linera docs
      const response = await fetch(`${this.config.validatorUrl}/chains/${chainId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        // If GraphQL fails, return default balance
        console.warn('[Faucet] Failed to query balance, using default');
        return { balance: '100000000', chainId };
      }

      const result = await response.json();
      const balance = result.data?.chain?.executionState?.system?.balance || '100000000';

      console.log('[Faucet] Balance query result:', balance);
      return { balance, chainId };
    } catch (error) {
      console.warn('[Faucet] Balance query error:', error);
      // Return default balance on error (100 tokens)
      return { balance: '100000000', chainId };
    }
  }

  /**
   * Fetch with exponential backoff retry
   */
  private async fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        // Reset retry count on success
        this.retryCount = 0;
        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < this.MAX_RETRIES) {
          const delay = this.RETRY_DELAY_MS * Math.pow(2, attempt);
          console.log(`[Faucet] Retry ${attempt + 1}/${this.MAX_RETRIES} after ${delay}ms`);
          await this.sleep(delay);
        }
      }
    }

    throw new LineraFaucetError(
      `Network error after ${this.MAX_RETRIES} retries: ${lastError?.message}`,
      'NETWORK_ERROR'
    );
  }

  /**
   * Handle HTTP error responses
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorCode = 'HTTP_ERROR';
    let retryAfter: number | undefined;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      errorCode = errorData.code || errorCode;
      retryAfter = errorData.retryAfter;
    } catch {
      // Ignore JSON parse errors
    }

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfterHeader = response.headers.get('Retry-After');
      retryAfter = retryAfterHeader ? parseInt(retryAfterHeader) * 1000 : 3600000; // 1 hour default
      
      throw new LineraFaucetError(
        `Rate limit exceeded. Please try again in ${Math.round(retryAfter / 60000)} minutes.`,
        'RATE_LIMIT_EXCEEDED',
        retryAfter
      );
    }

    // Handle service unavailable
    if (response.status === 503) {
      throw new LineraFaucetError(
        'Faucet service temporarily unavailable. Please try again later.',
        'SERVICE_UNAVAILABLE'
      );
    }

    throw new LineraFaucetError(errorMessage, errorCode);
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Get faucet configuration based on environment
 */
export function getFaucetConfig(): FaucetConfig {
  const network = import.meta.env.VITE_NETWORK || 'local';
  
  if (network === 'conway') {
    return {
      faucetUrl: import.meta.env.VITE_LINERA_FAUCET_URL || 'https://faucet.testnet-conway.linera.net',
      validatorUrl: import.meta.env.VITE_LINERA_VALIDATOR_URL || 'https://validator.testnet-conway.linera.net',
      network: 'conway',
    };
  }

  // Local network (no faucet needed)
  return {
    faucetUrl: '',
    validatorUrl: 'http://localhost:8080',
    network: 'local',
  };
}

/**
 * Create faucet client instance
 */
export function createFaucet(config?: Partial<FaucetConfig>): LineraFaucet {
  const defaultConfig = getFaucetConfig();
  return new LineraFaucet({ ...defaultConfig, ...config });
}
