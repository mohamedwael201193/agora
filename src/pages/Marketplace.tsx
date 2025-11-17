import marketplacePreview from "@/assets/marketplace-preview.jpg";
import { BetTicket } from "@/components/market/BetTicket";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AgoraClient } from "@/lib/agoraClient";
import { Market } from "@/stores/useAgoraStore";
import { motion } from "framer-motion";
import { Clock, Loader2, Search, TrendingUp, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  "All",
  "Sports",
  "Politics",
  "Crypto",
  "Entertainment",
  "Custom",
];

interface LineraMarket {
  marketId: number;
  question: string;
  description: string;
  chainId: string;
  phase: 'DRAFT' | 'OPEN' | 'REVEAL' | 'FINAL';
  result: 'YES' | 'NO' | null;
  closesAt: number;
}

interface DisplayMarket {
  id: string;
  marketId: number;
  question: string;
  description: string;
  category: string;
  yesOdds: number;
  noOdds: number;
  volume: string;
  participants: number;
  endsIn: string;
  trending: boolean;
  phase: string;
  chainId: string;
}

export default function Marketplace() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [isBetTicketOpen, setIsBetTicketOpen] = useState(false);
  const [markets, setMarkets] = useState<DisplayMarket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Linera client
  const agoraClient = new AgoraClient({
    nodeUrl: import.meta.env.VITE_NODE_URL || 'http://localhost:8080',
    applicationId: import.meta.env.VITE_AGORA_APP_ID || '',
    registryChainId: import.meta.env.VITE_REGISTRY_CHAIN_ID || '',
  });

  // Track if this is the first load
  const [isFirstLoad, setIsFirstLoad] = React.useState(true);

  // Fetch real markets from Linera
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setIsLoading(true);
        console.log('[Marketplace] Fetching markets from Linera...');
        
        const lineraMarkets = await agoraClient.listMarkets();
        console.log('[Marketplace] Received markets:', lineraMarkets);

        // Fetch real phase AND stats from each market's chain
        const marketsWithRealData = await Promise.all(
          lineraMarkets.map(async (market) => {
            try {
              const [realPhase, stats] = await Promise.all([
                agoraClient.getMarketPhase(market.chainId),
                agoraClient.getMarketStats(market.chainId),
              ]);
              return { ...market, phase: realPhase, commitCount: stats.commitCount, revealCount: stats.revealCount };
            } catch (error) {
              console.warn(`[Marketplace] Failed to fetch data for market ${market.marketId}:`, error);
              return { ...market, commitCount: 0, revealCount: 0 }; // Fallback
            }
          })
        );

        // Transform Linera markets to display format
        const displayMarkets: DisplayMarket[] = marketsWithRealData.map((market, index) => {
          // Calculate time remaining
          const now = Date.now() / 1000;
          const remaining = market.closesAt - now;
          const days = Math.floor(remaining / 86400);
          const hours = Math.floor((remaining % 86400) / 3600);
          
          let endsIn = 'Ended';
          if (remaining > 0) {
            if (days > 0) {
              endsIn = `${days} day${days > 1 ? 's' : ''}`;
            } else if (hours > 0) {
              endsIn = `${hours} hour${hours > 1 ? 's' : ''}`;
            } else {
              endsIn = 'Soon';
            }
          }

          // Extract category from question or description
          const question = market.question.toLowerCase();
          let category = 'Custom';
          if (question.includes('bitcoin') || question.includes('crypto') || question.includes('eth')) {
            category = 'Crypto';
          } else if (question.includes('sport') || question.includes('game')) {
            category = 'Sports';
          } else if (question.includes('politic') || question.includes('election')) {
            category = 'Politics';
          } else if (question.includes('movie') || question.includes('music')) {
            category = 'Entertainment';
          }

          // Calculate real odds based on reveal count
          // During OPEN/DRAFT phase, we can't know the odds because bets are encrypted commitments
          // Only after reveals can we calculate real odds
          let yesOdds = 50;
          let noOdds = 50;
          
          // If market is in REVEAL or FINAL phase and has reveals, calculate from actual data
          if ((market.phase === 'REVEAL' || market.phase === 'FINAL') && market.revealCount > 0) {
            // TODO: Fetch actual YES/NO counts from reveals
            // For now, keep 50/50 until we implement reveal tracking
            yesOdds = 50;
            noOdds = 50;
          }
          
          // If result is final, show actual result
          if (market.result === 'YES') {
            yesOdds = 100;
            noOdds = 0;
          } else if (market.result === 'NO') {
            yesOdds = 0;
            noOdds = 100;
          }

          // Calculate volume from commit count (each commit = ~100 AGORA average)
          const estimatedVolume = market.commitCount * 100;
          const volumeStr = estimatedVolume >= 1000 
            ? `$${(estimatedVolume / 1000).toFixed(1)}K` 
            : `$${estimatedVolume}`;

          return {
            id: `market_${market.marketId}`,
            marketId: market.marketId,
            question: market.question,
            description: market.description,
            category,
            yesOdds,
            noOdds,
            volume: volumeStr,
            participants: market.commitCount, // Real participant count from commits
            endsIn,
            trending: market.phase === 'OPEN' && index % 3 === 0,
            phase: market.phase,
            chainId: market.chainId,
          };
        });

        setMarkets(displayMarkets);
        
        // Only show toast on first load (not on auto-refresh)
        if (isFirstLoad) {
          setIsFirstLoad(false);
          if (displayMarkets.length === 0) {
            toast({
              title: "No Markets Found",
              description: "Create your first market using the Foundry Builder!",
            });
          }
          // Silent on successful load - no toast spam
        }
      } catch (error) {
        console.error('[Marketplace] Error fetching markets:', error);
        // Only show error toast on first load
        if (isFirstLoad) {
          setIsFirstLoad(false);
          toast({
            title: "Connection Error",
            description: "Unable to fetch markets. Ensure Linera service is running.",
            variant: "destructive",
          });
        }
        // Set empty array on error
        setMarkets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkets();
    
    // Refresh markets every 60 seconds (silent background refresh)
    const interval = setInterval(fetchMarkets, 60000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array - only run once on mount

  const handlePlaceBet = (market: DisplayMarket, e: React.MouseEvent) => {
    e.stopPropagation();
    // Open betting modal with selected market
    const marketData: Market = {
      id: `market_${market.marketId}`,
      marketId: market.marketId,
      question: market.question,
      description: market.description,
      category: market.category,
      yesOdds: market.yesOdds,
      noOdds: market.noOdds,
      volume: market.volume,
      participants: market.participants,
      endsIn: market.endsIn,
      trending: market.trending,
      chainId: market.chainId,
    };
    setSelectedMarket(marketData);
    setIsBetTicketOpen(true);
  };

  const handleOpenMarket = async (market: DisplayMarket, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await agoraClient.openMarket(market.chainId);
      toast({
        title: "✅ Market Opened!",
        description: `"${market.question}" is now accepting bets`,
      });
      // Refresh markets after opening
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('[Marketplace] Error opening market:', error);
      toast({
        title: "Failed to Open Market",
        description: "Please try again or check the console for details.",
        variant: "destructive",
      });
    }
  };

  const handleCardClick = (marketId: string) => {
    // marketId is already just the number from DisplayMarket
    navigate(`/marketplace/market_${marketId}`);
  };

  const handleCreateMarket = () => {
    navigate('/foundry');
  };

  const filteredMarkets = markets.filter((market) => {
    const matchesCategory =
      selectedCategory === "All" || market.category === selectedCategory;
    const matchesSearch = market.question
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Prediction{" "}
              <span className="text-gradient-primary">Marketplace</span>
            </h1>
            <p className="text-text-secondary text-lg">
              Real-time markets with sub-second settlement on Linera microchains
            </p>
          </div>
          <Button 
            onClick={handleCreateMarket}
            className="bg-gradient-to-r from-orange-primary to-blue-electric hover:opacity-90"
          >
            Create Market
          </Button>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative h-64 rounded-xl overflow-hidden mb-8"
        >
          <img
            src={marketplacePreview}
            alt="Prediction market interface showing real-time odds and trading charts"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent" />
        </motion.div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <Input
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-surface border-border"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category ? "bg-orange-primary" : ""
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-orange-primary mb-4" />
          <p className="text-text-muted text-lg">Loading markets from Linera...</p>
        </div>
      )}

      {/* Market Grid */}
      {!isLoading && (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredMarkets.map((market, index) => (
          <motion.div
            key={market.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className="p-6 glass-surface hover:border-orange-primary/50 transition-all group cursor-pointer"
              onClick={() => handleCardClick(market.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {market.category}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        market.phase === 'OPEN' ? 'bg-success/20 text-success border-success/30' :
                        market.phase === 'REVEAL' ? 'bg-blue-electric/20 text-blue-electric border-blue-electric/30' :
                        market.phase === 'FINAL' ? 'bg-purple-500/20 text-purple-500 border-purple-500/30' :
                        'bg-text-muted/20 text-text-muted border-text-muted/30'
                      }`}
                    >
                      {market.phase}
                    </Badge>
                    {market.trending && (
                      <Badge className="text-xs bg-orange-primary/20 text-orange-primary border-orange-primary/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-orange-primary transition-colors">
                    {market.question}
                  </h3>
                </div>
              </div>

              {/* Odds Display */}
              <div className="space-y-2 mb-4">
                {market.phase === 'OPEN' && (
                  <div className="text-xs text-text-muted flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Odds shown as 50/50 - bets are encrypted commitments until reveal phase
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                    <div className="text-2xl font-bold text-success mb-1">
                      {market.yesOdds}%
                    </div>
                    <div className="text-sm text-text-muted">Yes</div>
                  </div>
                  <div className="p-4 bg-error/10 border border-error/30 rounded-lg">
                    <div className="text-2xl font-bold text-error mb-1">
                      {market.noOdds}%
                    </div>
                    <div className="text-sm text-text-muted">No</div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {market.participants.toLocaleString()}
                  </span>
                  <span className="font-semibold text-text-primary">
                    {market.volume}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {market.endsIn}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleCardClick(market.id)}
                  className="border-orange-primary/50 hover:bg-orange-primary/10"
                >
                  View Details
                </Button>
                {market.phase === 'DRAFT' ? (
                  <Button
                    onClick={(e) => handleOpenMarket(market, e)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
                  >
                    Open Market
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => handlePlaceBet(market, e)}
                    className="bg-gradient-to-r from-orange-primary to-orange-secondary hover:opacity-90"
                    disabled={market.phase === 'FINAL'}
                  >
                    {market.phase === 'OPEN' ? 'Place Bet' : market.phase === 'REVEAL' ? 'Reveal' : 'Closed'}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredMarkets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-text-muted text-lg">
            No markets found matching your criteria
          </p>
        </motion.div>
      )}

      {/* Bet Ticket Modal */}
      {selectedMarket && (
        <BetTicket
          market={selectedMarket}
          open={isBetTicketOpen}
          onOpenChange={setIsBetTicketOpen}
        />
      )}
    </div>
  );
}
