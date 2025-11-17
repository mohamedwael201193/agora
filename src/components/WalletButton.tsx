/**
 * Wallet Button Component
 * Displays wallet connection status, balance, and network indicator
 */

import { Check, Copy, Power, RefreshCw, Wallet as WalletIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { getNetworkBadgeColor, getNetworkDisplayName } from '../lib/networkConfig';
import { formatBalance, truncateAddress } from '../lib/wallet';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function WalletButton() {
  const { wallet, isConnected, isLoading, network, disconnect, requestTokens, refreshBalance, exportWallet } = useWallet();
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleCopy = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.chainId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshBalance();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Not connected state
  if (!isConnected || !wallet) {
    return (
      <Link to="/connect">
        <Button 
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          disabled={isLoading}
        >
          <WalletIcon className="mr-2 h-4 w-4" />
          {isLoading ? 'Connecting...' : 'Connect Chain'}
        </Button>
      </Link>
    );
  }

  // Connected state with wallet info
  return (
    <div className="flex items-center gap-2">
      {/* Network Badge */}
      <Badge className={`${getNetworkBadgeColor(network)} text-white border-0 hidden lg:flex`}>
        {getNetworkDisplayName(network)}
      </Badge>

      {/* Wallet Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="glass-surface border-purple-500/30 hover:border-purple-500/50"
          >
            <WalletIcon className="mr-2 h-4 w-4" />
            <span className="font-mono hidden sm:inline">{truncateAddress(wallet.chainId)}</span>
            <span className="ml-2 text-green-400 font-semibold">
              {formatBalance(wallet.balance)}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 glass-surface border-purple-500/30">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="px-2 py-2 space-y-2">
            {/* Chain ID */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Chain ID:</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono">{truncateAddress(wallet.chainId, 8, 6)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            {/* Balance */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Balance:</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-green-400">{formatBalance(wallet.balance)} tokens</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Network */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Network:</span>
              <Badge className={`${getNetworkBadgeColor(network)} text-white border-0 text-xs`}>
                {getNetworkDisplayName(network)}
              </Badge>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Actions */}
          {network === 'conway' && (
            <DropdownMenuItem onClick={requestTokens}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Request Tokens
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={exportWallet}>
            <Copy className="mr-2 h-4 w-4" />
            Export Wallet
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={disconnect} className="text-red-400">
            <Power className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
