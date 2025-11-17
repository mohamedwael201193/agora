/**
 * Connect Chain Page - Conway Testnet Onboarding
 * Allows users to claim a personal microchain from the faucet
 */

import { AlertCircle, CheckCircle2, Loader2, Network, Shield, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useWallet } from '../hooks/useWallet';
import { getNetworkConfig } from '../lib/networkConfig';
import { formatBalance, truncateAddress } from '../lib/wallet';

export default function Connect() {
  const navigate = useNavigate();
  const { wallet, isConnected, isLoading, error, network, claimChain, switchNetwork } = useWallet();
  const [claiming, setClaiming] = useState(false);

  const config = getNetworkConfig('conway');

  // Redirect if already connected
  useEffect(() => {
    if (isConnected && wallet) {
      // Give user a moment to see success state
      const timer = setTimeout(() => {
        navigate('/marketplace');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, wallet, navigate]);

  // No auto-switch - respect current network (local or conway)

  const handleClaimChain = async () => {
    setClaiming(true);
    try {
      await claimChain();
      // Success toast will be shown by useWallet hook
    } catch (error) {
      // Error toast will be shown by useWallet hook
      console.error('[Connect] Claim failed:', error);
    } finally {
      setClaiming(false);
    }
  };

  const isBusy = isLoading || claiming;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Network Setup
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose your network: Local for instant testing or Conway for public testnet.
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-400">Current Network:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              network === 'conway' 
                ? 'bg-purple-500/20 text-purple-300' 
                : 'bg-blue-500/20 text-blue-300'
            }`}>
              {network === 'conway' ? 'Conway Testnet' : 'Local Network'}
            </span>
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Conway Testnet Access</CardTitle>
            <CardDescription className="text-gray-400">
              Claim a personal microchain in 30 seconds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Network-specific instructions */}
            {network === 'conway' ? (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-300 mb-3">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold">Connect to Conway Testnet</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    Click below to connect your existing Conway chain or import your wallet.
                  </p>
                  <Button
                    onClick={handleClaimChain}
                    disabled={isBusy}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isBusy ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-5 w-5" />
                        Connect Conway Wallet
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold text-sm">Don't have a Conway wallet?</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    Use Linera CLI to claim a testnet chain:
                  </p>
                  <div className="bg-gray-900/50 rounded p-2 font-mono text-xs text-green-400">
                    linera wallet init --faucet {config.faucetUrl}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Local Network Ready!</span>
                </div>
                <p className="text-sm text-gray-400">
                  Your local blockchain is running with 4 BFT validators. Start using Agora now!
                </p>
              </div>
            )}


            {/* Success State */}
            {isConnected && wallet && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Chain Claimed Successfully!</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Chain ID:</span>
                    <span className="text-white font-mono">{truncateAddress(wallet.chainId)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Balance:</span>
                    <span className="text-green-400 font-semibold">{formatBalance(wallet.balance)} tokens</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Redirecting to marketplace...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isConnected && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">Claim Failed</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">{error}</p>
              </div>
            )}

            {/* Action Button */}
            {!isConnected && (
              <div className="space-y-3">
                {network === 'conway' ? (
                  <Button
                    onClick={() => switchNetwork('local')}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                  >
                    <Network className="mr-2 h-5 w-5" />
                    Switch to Local Network
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate('/marketplace')}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                  >
                    Go to Marketplace
                  </Button>
                )}
                <div className="text-center">
                  <button
                    onClick={() => switchNetwork(network === 'local' ? 'conway' : 'local')}
                    className="text-sm text-gray-400 hover:text-gray-300 underline"
                  >
                    {network === 'local' ? 'Switch to Conway Testnet' : 'Back to Local Network'}
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                What is a Personal Chain?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-300">
              <p>
                A personal microchain is your own dedicated blockchain on Linera, isolated from other users for maximum performance and security.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Zero gas fees</strong> - All transactions are free</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Instant finality</strong> - Sub-0.5s confirmations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Cross-chain messaging</strong> - Seamless market interactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Elastic scaling</strong> - Unlimited concurrent markets</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">1</span>
                </div>
                <div>
                  <strong className="text-white">Explore Markets</strong>
                  <p className="text-gray-400">Browse trending prediction markets across categories</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">2</span>
                </div>
                <div>
                  <strong className="text-white">Try Chrono-Echoes</strong>
                  <p className="text-gray-400">Test your calibration skills in our confidence game</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">3</span>
                </div>
                <div>
                  <strong className="text-white">Build Markets</strong>
                  <p className="text-gray-400">Create your own prediction markets in seconds</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-400">
            Running on Conway Testnet • Powered by Linera • Real Byzantine Fault Tolerant Validators
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Sub-0.5s finality
            </span>
            <span className="flex items-center gap-1">
              <Network className="w-3 h-3" />
              Multi-chain architecture
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Cryptographic security
            </span>
          </div>
        </div>

        {/* Alternative: Local Network */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => {
              switchNetwork('local');
              navigate('/marketplace');
            }}
            className="text-gray-400 hover:text-white"
          >
            Or use local development network →
          </Button>
        </div>
      </div>
    </div>
  );
}
