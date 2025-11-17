/**
 * Network Configuration for Local and Conway Testnet
 * Centralizes all network-specific settings and endpoints
 */

export type NetworkMode = 'local' | 'conway';

export interface NetworkConfig {
  name: string;
  mode: NetworkMode;
  validatorUrl: string;
  faucetUrl?: string;
  explorerUrl?: string;
  chainId?: string; // Default chain for registry
  applicationId?: string; // Agora application ID
  features: {
    hasFaucet: boolean;
    requiresWallet: boolean;
    supportsCrossChain: boolean;
    supportsStressTest: boolean;
  };
  limits: {
    maxMarketsPerChain: number;
    maxConcurrentBets: number;
    faucetCooldownMs: number;
  };
}

/**
 * Local development network configuration
 */
export const LOCAL_NETWORK: NetworkConfig = {
  name: 'Local Development',
  mode: 'local',
  validatorUrl: 'http://localhost:8080',
  chainId: import.meta.env.VITE_REGISTRY_CHAIN_ID,
  applicationId: import.meta.env.VITE_APPLICATION_ID,
  features: {
    hasFaucet: false,
    requiresWallet: false,
    supportsCrossChain: true,
    supportsStressTest: true,
  },
  limits: {
    maxMarketsPerChain: 100,
    maxConcurrentBets: 1000,
    faucetCooldownMs: 0,
  },
};

/**
 * Conway testnet configuration
 */
export const CONWAY_NETWORK: NetworkConfig = {
  name: 'Conway Testnet',
  mode: 'conway',
  validatorUrl: import.meta.env.VITE_LINERA_VALIDATOR_URL || 'https://validator.testnet-conway.linera.net',
  faucetUrl: import.meta.env.VITE_LINERA_FAUCET_URL || 'https://faucet.testnet-conway.linera.net',
  explorerUrl: 'https://explorer.testnet-conway.linera.net',
  chainId: import.meta.env.VITE_CONWAY_REGISTRY_CHAIN_ID,
  applicationId: import.meta.env.VITE_CONWAY_APPLICATION_ID,
  features: {
    hasFaucet: true,
    requiresWallet: true,
    supportsCrossChain: true,
    supportsStressTest: false, // Avoid stress testing public testnet
  },
  limits: {
    maxMarketsPerChain: 50,
    maxConcurrentBets: 100,
    faucetCooldownMs: 3600000, // 1 hour
  },
};

/**
 * Get current network configuration based on environment or override
 */
export function getNetworkConfig(mode?: NetworkMode): NetworkConfig {
  const envNetwork = import.meta.env.VITE_NETWORK as NetworkMode | undefined;
  const activeMode = mode || envNetwork || 'local';

  switch (activeMode) {
    case 'conway':
      return CONWAY_NETWORK;
    case 'local':
    default:
      return LOCAL_NETWORK;
  }
}

/**
 * Get GraphQL endpoint for a specific chain
 */
export function getChainGraphQLEndpoint(chainId: string, network?: NetworkMode): string {
  const config = getNetworkConfig(network);
  return `${config.validatorUrl}/chains/${chainId}`;
}

/**
 * Get application GraphQL endpoint
 */
export function getApplicationGraphQLEndpoint(
  chainId: string,
  applicationId: string,
  network?: NetworkMode
): string {
  const config = getNetworkConfig(network);
  return `${config.validatorUrl}/chains/${chainId}/applications/${applicationId}`;
}

/**
 * Validate network configuration
 */
export function validateNetworkConfig(config: NetworkConfig): boolean {
  if (!config.validatorUrl) {
    console.error('[Network] Missing validator URL');
    return false;
  }

  if (config.features.hasFaucet && !config.faucetUrl) {
    console.error('[Network] Faucet URL required for networks with faucet feature');
    return false;
  }

  if (config.features.requiresWallet && (!config.chainId || !config.applicationId)) {
    console.warn('[Network] Missing chain/app IDs for wallet-required network');
  }

  return true;
}

/**
 * Format network name for display
 */
export function getNetworkDisplayName(mode: NetworkMode): string {
  const config = getNetworkConfig(mode);
  return config.name;
}

/**
 * Get network badge color
 */
export function getNetworkBadgeColor(mode: NetworkMode): string {
  switch (mode) {
    case 'conway':
      return 'bg-gradient-to-r from-purple-500 to-pink-500';
    case 'local':
      return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    default:
      return 'bg-gray-500';
  }
}

/**
 * Check if feature is available on current network
 */
export function isFeatureAvailable(feature: keyof NetworkConfig['features'], network?: NetworkMode): boolean {
  const config = getNetworkConfig(network);
  return config.features[feature];
}

/**
 * Get network limit value
 */
export function getNetworkLimit(limit: keyof NetworkConfig['limits'], network?: NetworkMode): number {
  const config = getNetworkConfig(network);
  return config.limits[limit];
}
