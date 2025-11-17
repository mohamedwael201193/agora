/**
 * Agora Wave-2 Linera Client
 * GraphQL client for prediction markets with cross-chain messaging
 */

export interface AgoraConfig {
  nodeUrl: string;
  applicationId: string;
  registryChainId: string;
}

export interface Market {
  marketId: number;
  question: string;
  description: string;
  chainId: string;
  phase: 'DRAFT' | 'OPEN' | 'REVEAL' | 'FINAL';
  result: 'YES' | 'NO' | null;
  closesAt: number;
}

export interface MarketStats {
  commitCount: number;
  revealCount: number;
}

// Re-export crypto functions for convenient access
export { makeCommitmentHex as generateCommitment, randomSaltHex, verifyCommitment } from './crypto';
export { deleteSalt, loadSalt, saveSalt } from './salts';

export class AgoraClient {
  private config: AgoraConfig;

  constructor(config: AgoraConfig) {
    this.config = config;
  }

  private getChainUrl(chainId: string): string {
    return `${this.config.nodeUrl}/chains/${chainId}/applications/${this.config.applicationId}`;
  }

  private async query<T>(chainId: string, query: string): Promise<T> {
    const url = this.getChainUrl(chainId);
    console.log(`[AgoraClient] Querying ${url}`);
    console.log(`[AgoraClient] Query: ${query}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[AgoraClient] HTTP Error: ${response.status} ${response.statusText}`);
      console.error(`[AgoraClient] Response: ${errorText}`);
      throw new Error(`GraphQL request failed: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log(`[AgoraClient] Result:`, result);
    
    if (result.errors) {
      console.error(`[AgoraClient] GraphQL Errors:`, result.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  }

  // Registry queries (on registry chain)
  async getRole(chainId: string): Promise<string> {
    const data = await this.query<{ role: string }>(chainId, '{ role }');
    return data.role;
  }

  async listMarkets(): Promise<Market[]> {
    const data = await this.query<{ listMarkets: Market[] }>(
      this.config.registryChainId,
      '{ listMarkets { marketId question description chainId phase result closesAt } }'
    );
    return data.listMarkets;
  }

  // Market queries (on market chain)
  async getMarketQuestion(chainId: string): Promise<string | null> {
    const data = await this.query<{ marketQuestion: string | null }>(
      chainId,
      '{ marketQuestion }'
    );
    return data.marketQuestion;
  }

  async getMarketStats(chainId: string): Promise<MarketStats> {
    const data = await this.query<MarketStats>(
      chainId,
      '{ commitCount revealCount }'
    );
    return data;
  }

  // Get market phase directly from market chain
  async getMarketPhase(chainId: string): Promise<'DRAFT' | 'OPEN' | 'REVEAL' | 'FINAL'> {
    const data = await this.query<{ marketPhase: 'DRAFT' | 'OPEN' | 'REVEAL' | 'FINAL' }>(
      chainId,
      '{ marketPhase }'
    );
    return data.marketPhase;
  }

  // Mutations
  async createMarket(
    targetChain: string,
    question: string,
    description: string,
    closesAt: number
  ): Promise<string> {
    const mutation = `mutation {
      createMarket(
        targetChain: "${targetChain}",
        question: "${question}",
        description: "${description}",
        closesAt: ${closesAt}
      )
    }`;

    const data = await this.query<string>(this.config.registryChainId, mutation);
    return data;
  }

  async openMarket(chainId: string): Promise<string> {
    const data = await this.query<string>(chainId, 'mutation { open }');
    return data;
  }

  async commit(chainId: string, commitmentHex: string): Promise<string> {
    const mutation = `mutation { commit(commitmentHex: "${commitmentHex}") }`;
    const data = await this.query<string>(chainId, mutation);
    return data;
  }

  async startReveal(chainId: string): Promise<string> {
    const data = await this.query<string>(chainId, 'mutation { startReveal }');
    return data;
  }

  async reveal(
    chainId: string,
    choice: 'YES' | 'NO',
    saltHex: string
  ): Promise<string> {
    const mutation = `mutation { reveal(choice: ${choice}, saltHex: "${saltHex}") }`;
    const data = await this.query<string>(chainId, mutation);
    return data;
  }

  async finalize(chainId: string, result: 'YES' | 'NO'): Promise<string> {
    const mutation = `mutation { finalize(result: ${result}) }`;
    const data = await this.query<string>(chainId, mutation);
    return data;
  }
}

// Default client instance with network detection
export const createAgoraClient = (): AgoraClient => {
  // Detect network environment
  const network = import.meta.env.VITE_NETWORK || 'local';
  const isLocal = network === 'local';
  
  // Default configurations
  const localConfig = {
    nodeUrl: import.meta.env.VITE_NODE_URL || 'http://localhost:8080',
    applicationId: import.meta.env.VITE_AGORA_APP_ID || '',
    registryChainId: import.meta.env.VITE_REGISTRY_CHAIN_ID || '',
  };

  const conwayConfig = {
    nodeUrl: import.meta.env.VITE_NODE_URL || 'http://localhost:8081',
    applicationId: import.meta.env.VITE_AGORA_APP_ID || '',
    registryChainId: import.meta.env.VITE_REGISTRY_CHAIN_ID || '',
  };

  const config: AgoraConfig = isLocal ? localConfig : conwayConfig;

  // Log connection info
  console.log(`[AgoraClient] Network: ${network}`);
  console.log(`[AgoraClient] Node URL: ${config.nodeUrl}`);
  console.log(`[AgoraClient] Application ID: ${config.applicationId || '(not set)'}`);
  console.log(`[AgoraClient] Registry Chain: ${config.registryChainId || '(not set)'}`);

  // Validate configuration
  if (!config.applicationId || !config.registryChainId) {
    console.warn('[AgoraClient] Missing configuration. Please set environment variables:');
    console.warn('- VITE_AGORA_APP_ID');
    console.warn('- VITE_REGISTRY_CHAIN_ID');
    if (isLocal) {
      console.warn('Run ./scripts/judge_quickstart.sh to auto-generate .env.local');
    }
  }

  return new AgoraClient(config);
};

