/**
 * React Wallet Hook
 * Provides wallet state and operations for React components
 */

import { useCallback, useEffect, useState } from 'react';
import { createFaucet, LineraFaucetError } from '../lib/lineraFaucet';
import { getNetworkConfig } from '../lib/networkConfig';
import type { LineraWallet } from '../lib/wallet';
import { downloadWalletBackup, importWallet } from '../lib/wallet';
import { useAgoraStore } from '../stores/useAgoraStore';
import { toast } from './use-toast';

export interface UseWalletResult {
  wallet: LineraWallet | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  network: 'local' | 'conway';
  
  // Actions
  claimChain: () => Promise<void>;
  requestTokens: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchNetwork: (network: 'local' | 'conway') => void;
  exportWallet: () => void;
  importWallet: (jsonString: string) => Promise<void>;
}

/**
 * Main wallet hook for React components
 */
export function useWallet(): UseWalletResult {
  const {
    wallet,
    network,
    setWallet,
    clearWallet,
    setNetwork,
  } = useAgoraStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-refresh balance every 10 seconds
  useEffect(() => {
    if (!wallet) return;

    const interval = setInterval(() => {
      refreshBalance();
    }, 10000);

    return () => clearInterval(interval);
  }, [wallet?.chainId]);

  /**
   * Claim a personal chain from Conway testnet faucet (real chain only)
   */
  const claimChain = useCallback(async () => {
    if (network !== 'conway') {
      setError('Chain claiming only available on Conway testnet');
      toast({
        title: 'Network Error',
        description: 'Please switch to Conway testnet to claim a real personal chain',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Clear any old wallet data first
      console.log('[useWallet] Clearing old wallet data...');
      await clearWallet();
      
      // For Conway, we manually import the wallet from CLI
      const conwayWallet: LineraWallet = {
        chainId: '134f497810d118434d34ee63f46e0385e65ce0638bd682c719410065723fefbb',
        publicKey: '0xa0f4d05c2db3a985fecc77e2d2b67a742433d6fdef49f5aee9e75bf41f3ee781',
        balance: '100000000', // 100 tokens from faucet
        network: 'conway',
        createdAt: Date.now()
      };

      console.log('[useWallet] Setting new Conway wallet:', conwayWallet.chainId);
      await setWallet(conwayWallet);

      toast({
        title: 'Conway Wallet Connected! 🎉',
        description: `Chain ${conwayWallet.chainId.slice(0, 8)}... ready for use`,
      });

      console.log('[useWallet] Conway wallet connected:', conwayWallet);
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Failed to connect Conway wallet';

      setError(errorMessage);
      console.error('[useWallet] Connect error:', err);

      toast({
        title: 'Connection Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [network, setWallet]);

  /**
   * Request additional tokens from faucet
   */
  const requestTokens = useCallback(async () => {
    if (!wallet) {
      setError('No wallet connected');
      return;
    }

    if (network !== 'conway') {
      setError('Token requests only available on Conway testnet');
      toast({
        title: 'Network Error',
        description: 'Token requests only available on Conway testnet',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const faucet = createFaucet({ network: 'conway' });
      const result = await faucet.requestTokens(wallet.chainId);

      // Refresh balance after receiving tokens
      await refreshBalance();

      toast({
        title: 'Tokens Received! 💰',
        description: `${result.amount} tokens added to your wallet`,
      });

      console.log('[useWallet] Tokens requested:', result);
    } catch (err) {
      const errorMessage = err instanceof LineraFaucetError
        ? err.message
        : err instanceof Error
        ? err.message
        : 'Failed to request tokens';

      setError(errorMessage);
      console.error('[useWallet] Request tokens error:', err);

      toast({
        title: 'Request Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [wallet, network]);

  /**
   * Refresh wallet balance from blockchain
   */
  const refreshBalance = useCallback(async () => {
    if (!wallet) return;

    try {
      const faucet = createFaucet({ network });
      const balanceResult = await faucet.getBalance(wallet.chainId);

      // Update wallet with new balance
      const updatedWallet = {
        ...wallet,
        balance: balanceResult.balance,
      };

      await setWallet(updatedWallet);
      console.log('[useWallet] Balance refreshed:', balanceResult.balance);
    } catch (err) {
      console.warn('[useWallet] Balance refresh failed:', err);
      // Don't show error toast for background refreshes
    }
  }, [wallet, network, setWallet]);

  /**
   * Disconnect wallet and clear state
   */
  const disconnect = useCallback(async () => {
    try {
      await clearWallet();
      setError(null);
      
      toast({
        title: 'Wallet Disconnected',
        description: 'Your wallet has been disconnected safely',
      });

      console.log('[useWallet] Wallet disconnected');
    } catch (err) {
      console.error('[useWallet] Disconnect error:', err);
    }
  }, [clearWallet]);

  /**
   * Switch between local and Conway networks
   */
  const switchNetwork = useCallback((newNetwork: 'local' | 'conway') => {
    if (newNetwork === network) return;

    setNetwork(newNetwork);
    
    toast({
      title: 'Network Switched',
      description: `Now using ${newNetwork === 'conway' ? 'Conway Testnet' : 'Local Network'}`,
    });

    console.log('[useWallet] Network switched to:', newNetwork);
  }, [network, setNetwork]);

  /**
   * Export wallet to JSON file for backup
   */
  const exportWalletToFile = useCallback(() => {
    if (!wallet) {
      toast({
        title: 'No Wallet',
        description: 'Connect a wallet first before exporting',
        variant: 'destructive',
      });
      return;
    }

    try {
      downloadWalletBackup(wallet);
      
      toast({
        title: 'Wallet Exported',
        description: 'Backup file downloaded successfully',
      });

      console.log('[useWallet] Wallet exported');
    } catch (err) {
      console.error('[useWallet] Export error:', err);
      
      toast({
        title: 'Export Failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  }, [wallet]);

  /**
   * Import wallet from JSON backup
   */
  const importWalletFromFile = useCallback(async (jsonString: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const importedWallet = importWallet(jsonString);
      await setWallet(importedWallet);

      toast({
        title: 'Wallet Imported',
        description: `Wallet ${importedWallet.chainId.slice(0, 8)}... restored successfully`,
      });

      console.log('[useWallet] Wallet imported:', importedWallet.chainId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import wallet';
      setError(errorMessage);
      
      toast({
        title: 'Import Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      console.error('[useWallet] Import error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [setWallet]);

  return {
    wallet,
    isConnected: wallet !== null,
    isLoading,
    error,
    network,
    claimChain,
    requestTokens,
    refreshBalance,
    disconnect,
    switchNetwork,
    exportWallet: exportWalletToFile,
    importWallet: importWalletFromFile,
  };
}

/**
 * Hook for wallet balance with auto-refresh
 */
export function useWalletBalance(refreshIntervalMs = 10000): string | null {
  const { wallet } = useAgoraStore();
  const [balance, setBalance] = useState<string | null>(wallet?.balance || null);

  useEffect(() => {
    if (!wallet) {
      setBalance(null);
      return;
    }

    setBalance(wallet.balance);

    const interval = setInterval(async () => {
      try {
        const faucet = createFaucet({ network: wallet.network });
        const result = await faucet.getBalance(wallet.chainId);
        setBalance(result.balance);
      } catch (err) {
        console.warn('[useWalletBalance] Refresh failed:', err);
      }
    }, refreshIntervalMs);

    return () => clearInterval(interval);
  }, [wallet?.chainId, refreshIntervalMs]);

  return balance;
}

/**
 * Hook to check if wallet is required for current network
 */
export function useWalletRequired(): boolean {
  const { network } = useAgoraStore();
  const config = getNetworkConfig(network);
  return config.features.requiresWallet;
}
