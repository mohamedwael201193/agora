import { useEffect, useState } from 'react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { createAgoraClient, generateCommitment, loadSalt, Market, MarketStats, randomSaltHex, saveSalt } from '../lib/agoraClient';

export default function AgoraMarkets() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [stats, setStats] = useState<MarketStats | null>(null);

  // Form state for creating markets
  const [newMarket, setNewMarket] = useState({
    targetChain: '',
    question: '',
    description: '',
    closesAt: '',
  });

  const client = createAgoraClient();
  const { toast } = useToast();
  const APP_ID = import.meta.env.VITE_AGORA_APP_ID || '';

  useEffect(() => {
    loadMarkets();
  }, []);

  const loadMarkets = async () => {
    try {
      setLoading(true);
      setError(null);
      const marketList = await client.listMarkets();
      setMarkets(marketList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load markets');
    } finally {
      setLoading(false);
    }
  };

  const loadMarketStats = async (chainId: string) => {
    try {
      const marketStats = await client.getMarketStats(chainId);
      setStats(marketStats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleCreateMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const closesAt = Math.floor(new Date(newMarket.closesAt).getTime() / 1000);

      await client.createMarket(
        newMarket.targetChain,
        newMarket.question,
        newMarket.description,
        closesAt
      );

      // Reset form
      setNewMarket({ targetChain: '', question: '', description: '', closesAt: '' });

      // Reload markets after a delay to allow for blockchain confirmation
      setTimeout(loadMarkets, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create market');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMarket = async (chainId: string) => {
    try {
      console.log(`[AgoraMarkets] Opening market on chain: ${chainId}`);
      setLoading(true);
      setError(null);
      const result = await client.openMarket(chainId);
      console.log(`[AgoraMarkets] Open market result:`, result);
      
      // Show success message
      alert('Market opened successfully! ✅\n\nThe market is now OPEN for betting. The phase will be reflected in the registry when the market is finalized.');
      
      setTimeout(loadMarkets, 2000);
    } catch (err) {
      console.error(`[AgoraMarkets] Failed to open market:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to open market';
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async (chainId: string, result: 'YES' | 'NO') => {
    try {
      setLoading(true);
      setError(null);
      await client.finalize(chainId, result);
      
      toast({
        title: 'Market Finalized ✅',
        description: `Market finalized with result: ${result}`,
      });
      
      setTimeout(loadMarkets, 2000);
    } catch (err) {
      console.error('[AgoraMarkets] Finalize failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to finalize market';
      setError(errorMessage);
      toast({
        title: 'Finalize Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Commit a bet with automatic salt generation and storage
  const handleCommit = async (market: Market, choice: 'YES' | 'NO') => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate random salt and commitment
      const saltHex = randomSaltHex(32);
      const commitmentHex = await generateCommitment(choice, saltHex);
      
      console.log('[AgoraMarkets] Committing:', { choice, saltHex, commitmentHex });
      
      // Submit commitment to blockchain
      await client.commit(market.chainId, commitmentHex);
      
      // Save salt for later reveal
      saveSalt(APP_ID, market.chainId, market.marketId, saltHex, choice, commitmentHex);
      
      toast({
        title: 'Commit Successful ✅',
        description: `Your ${choice} bet is committed. Salt saved for reveal.`,
      });
      
      setTimeout(loadMarkets, 2000);
    } catch (err) {
      console.error('[AgoraMarkets] Commit failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to commit bet';
      setError(errorMessage);
      toast({
        title: 'Commit Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Start reveal phase
  const handleStartReveal = async (chainId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await client.startReveal(chainId);
      
      toast({
        title: 'Reveal Phase Started ✅',
        description: 'Market is now accepting reveals.',
      });
      
      setTimeout(loadMarkets, 2000);
    } catch (err) {
      console.error('[AgoraMarkets] Start reveal failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start reveal';
      setError(errorMessage);
      toast({
        title: 'Start Reveal Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Reveal a bet using stored salt
  const handleReveal = async (market: Market) => {
    try {
      setLoading(true);
      setError(null);
      
      // Load saved salt
      const saved = loadSalt(APP_ID, market.chainId, market.marketId);
      if (!saved) {
        toast({
          title: 'No Saved Salt',
          description: 'Could not find saved salt for this market. You must have committed from this browser.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      
      console.log('[AgoraMarkets] Revealing:', { choice: saved.choice, saltHex: saved.saltHex });
      
      // Submit reveal to blockchain
      await client.reveal(market.chainId, saved.choice, saved.saltHex);
      
      toast({
        title: 'Reveal Successful ✅',
        description: `Your ${saved.choice} bet has been revealed.`,
      });
      
      setTimeout(loadMarkets, 2000);
    } catch (err) {
      console.error('[AgoraMarkets] Reveal failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to reveal bet';
      setError(errorMessage);
      toast({
        title: 'Reveal Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Demo mode: Run full lifecycle for judges
  const handleRunDemo = async (market: Market) => {
    try {
      setLoading(true);
      setError(null);
      
      toast({
        title: 'Demo Mode 🎯',
        description: 'Running full lifecycle: Open → Commit → Reveal → Finalize',
      });
      
      // Step 1: Open market
      await client.openMarket(market.chainId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Commit YES
      const saltHex = randomSaltHex(32);
      const commitmentHex = await generateCommitment('YES', saltHex);
      await client.commit(market.chainId, commitmentHex);
      saveSalt(APP_ID, market.chainId, market.marketId, saltHex, 'YES', commitmentHex);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 3: Start Reveal
      await client.startReveal(market.chainId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 4: Reveal YES
      await client.reveal(market.chainId, 'YES', saltHex);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 5: Finalize YES
      await client.finalize(market.chainId, 'YES');
      
      toast({
        title: 'Demo Complete ✅',
        description: 'Full lifecycle executed successfully!',
      });
      
      setTimeout(loadMarkets, 2000);
    } catch (err) {
      console.error('[AgoraMarkets] Demo failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Demo failed';
      setError(errorMessage);
      toast({
        title: 'Demo Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'DRAFT':
        return 'secondary';
      case 'OPEN':
        return 'default';
      case 'REVEAL':
        return 'default';
      case 'FINAL':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Agora Prediction Markets</h1>
        <p className="text-muted-foreground">
          Wave-2: Cross-chain prediction markets powered by Linera
        </p>
      </div>

      {/* Demo Toolbar */}
      {import.meta.env.VITE_NETWORK === 'local' && (
        <div className="mb-4 p-4 bg-orange-500/10 border border-orange-500 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-orange-600">🎯 Judge Demo Mode</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Select a DRAFT market below and click "Run Full Demo" to execute the complete lifecycle
              </p>
            </div>
            <Badge variant="secondary">Localnet</Badge>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
          {error}
        </div>
      )}

      <Tabs defaultValue="markets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="markets">Markets</TabsTrigger>
          <TabsTrigger value="create">Create Market</TabsTrigger>
        </TabsList>

        <TabsContent value="markets" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Active Markets</h2>
            <Button onClick={loadMarkets} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>

          {markets.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No markets found. Create one to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {markets.map((market) => (
                <Card key={market.marketId} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{market.question}</CardTitle>
                        <CardDescription className="mt-2">{market.description}</CardDescription>
                      </div>
                      <Badge variant={getPhaseColor(market.phase)}>{market.phase}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Market ID:</span>
                        <span className="font-mono">{market.marketId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Chain:</span>
                        <span className="font-mono text-xs">{market.chainId.slice(0, 16)}...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Closes:</span>
                        <span>{new Date(market.closesAt * 1000).toLocaleString()}</span>
                      </div>
                      {market.result && (
                        <div className="flex justify-between font-semibold">
                          <span>Result:</span>
                          <Badge variant={market.result === 'YES' ? 'default' : 'secondary'}>
                            {market.result}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2 flex-wrap">
                      {market.phase === 'DRAFT' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleOpenMarket(market.chainId)}
                            disabled={loading}
                          >
                            Open Market
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRunDemo(market)}
                            disabled={loading}
                          >
                            Run Full Demo
                          </Button>
                        </>
                      )}
                      
                      {market.phase === 'OPEN' && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleCommit(market, 'YES')}
                            disabled={loading}
                          >
                            Commit YES
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleCommit(market, 'NO')}
                            disabled={loading}
                          >
                            Commit NO
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStartReveal(market.chainId)}
                            disabled={loading}
                          >
                            Start Reveal
                          </Button>
                        </>
                      )}
                      
                      {market.phase === 'REVEAL' && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleReveal(market)}
                            disabled={loading}
                          >
                            Reveal My Bet
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleFinalize(market.chainId, 'YES')}
                            disabled={loading}
                          >
                            Finalize YES
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleFinalize(market.chainId, 'NO')}
                            disabled={loading}
                          >
                            Finalize NO
                          </Button>
                        </>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMarket(market);
                          loadMarketStats(market.chainId);
                        }}
                      >
                        View Stats
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedMarket && stats && (
            <Card>
              <CardHeader>
                <CardTitle>Market Statistics</CardTitle>
                <CardDescription>{selectedMarket.question}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold">{stats.commitCount}</div>
                    <div className="text-sm text-muted-foreground">Commits</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold">{stats.revealCount}</div>
                    <div className="text-sm text-muted-foreground">Reveals</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Market</CardTitle>
              <CardDescription>
                Create a prediction market on a target chain. A cross-chain message will be sent to initialize it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateMarket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Target Chain ID</label>
                  <Input
                    placeholder="5d5ac09fe813a6848806662974fbb8d6045a3e08cc482ffd4dee26bb9627716d"
                    value={newMarket.targetChain}
                    onChange={(e) => setNewMarket({ ...newMarket, targetChain: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Available chain from your wallet
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Question</label>
                  <Input
                    placeholder="Will BTC reach 100k by end of 2025?"
                    value={newMarket.question}
                    onChange={(e) => setNewMarket({ ...newMarket, question: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Input
                    placeholder="Bitcoin price prediction market"
                    value={newMarket.description}
                    onChange={(e) => setNewMarket({ ...newMarket, description: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Closes At</label>
                  <Input
                    type="datetime-local"
                    value={newMarket.closesAt}
                    onChange={(e) => setNewMarket({ ...newMarket, closesAt: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Market'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-sm">Configuration Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1 font-mono">
              <div>Node URL: {import.meta.env.VITE_NODE_URL || 'Not configured'}</div>
              <div>App ID: {import.meta.env.VITE_AGORA_APP_ID ? `${import.meta.env.VITE_AGORA_APP_ID.slice(0, 16)}...` : 'Not configured'}</div>
              <div>Registry: {import.meta.env.VITE_REGISTRY_CHAIN_ID ? `${import.meta.env.VITE_REGISTRY_CHAIN_ID.slice(0, 16)}...` : 'Not configured'}</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
