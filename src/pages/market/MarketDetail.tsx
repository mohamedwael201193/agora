import { BetTicket } from "@/components/market/BetTicket";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Mock market data (in production would fetch from API/chain)
const mockMarkets = [
  {
    id: "market_1",
    question: "Will Bitcoin reach $150k by end of 2025?",
    category: "Crypto",
    yesOdds: 67,
    noOdds: 33,
    volume: "$142.5K",
    participants: 1247,
    endsIn: "2 months",
    trending: true,
    description:
      "This market predicts whether Bitcoin (BTC) will reach or exceed $100,000 USD by December 31, 2025, 23:59:59 UTC.",
    resolutionSource: "CoinGecko historical price data",
    createdBy: "chain_a7f3d9c2e8b1",
    liquidity: "$85.2K",
  },
  {
    id: "market_2",
    question: "Will AI solve protein folding this year?",
    category: "Politics",
    yesOdds: 42,
    noOdds: 58,
    volume: "$89.2K",
    participants: 834,
    endsIn: "5 days",
    trending: false,
    description:
      "Market resolves YES if a peer-reviewed publication demonstrates AI solving protein folding with 95%+ accuracy by end of year.",
    resolutionSource: "Nature, Science, or Cell journal publications",
    createdBy: "chain_b2e9f8d3c1a4",
    liquidity: "$54.7K",
  },
  {
    id: "market_3",
    question: "Next major tech IPO valuation over $50B?",
    category: "Crypto",
    yesOdds: 55,
    noOdds: 45,
    volume: "$201.8K",
    participants: 2103,
    endsIn: "1 week",
    trending: true,
    description:
      "Resolves YES if any tech company IPOs with initial market cap exceeding $50B within the resolution timeframe.",
    resolutionSource: "SEC filings and major stock exchange data",
    createdBy: "chain_c4f1a9e7b5d2",
    liquidity: "$127.3K",
  },
  {
    id: "market_4",
    question: "Climate summit reaches binding agreement?",
    category: "Politics",
    yesOdds: 38,
    noOdds: 62,
    volume: "$67.3K",
    participants: 592,
    endsIn: "3 weeks",
    trending: false,
    description:
      "Market resolves YES if COP29 produces a legally binding international climate agreement signed by 100+ nations.",
    resolutionSource: "UN official documentation",
    createdBy: "chain_d8a3f5c9e2b7",
    liquidity: "$41.8K",
  },
];

export default function MarketDetail() {
  const { marketId } = useParams<{ marketId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isBetTicketOpen, setIsBetTicketOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Find market by ID
  const market = mockMarkets.find((m) => m.id === marketId);

  if (!market) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-12 glass-surface text-center">
          <h2 className="text-2xl font-bold mb-4">Market Not Found</h2>
          <p className="text-text-muted mb-6">
            The market you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/marketplace")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
        </Card>
      </div>
    );
  }

  const containerVariants = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <motion.div {...containerVariants}>
        <Button
          variant="ghost"
          onClick={() => navigate("/marketplace")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>
      </motion.div>

      {/* Market Header */}
      <motion.div {...containerVariants} transition={{ delay: 0.1 }}>
        <Card className="p-6 md:p-8 glass-surface mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{market.category}</Badge>
                {market.trending && (
                  <Badge className="bg-orange-primary/20 text-orange-primary border-orange-primary/30">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {market.question}
              </h1>
              <p className="text-text-secondary">{market.description}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-surface/50 rounded-lg border border-border/50">
              <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                Volume
              </div>
              <div className="text-xl font-bold">{market.volume}</div>
            </div>
            <div className="p-4 bg-surface/50 rounded-lg border border-border/50">
              <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
                <Users className="w-4 h-4" />
                Participants
              </div>
              <div className="text-xl font-bold">
                {market.participants.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-surface/50 rounded-lg border border-border/50">
              <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
                <Activity className="w-4 h-4" />
                Liquidity
              </div>
              <div className="text-xl font-bold">{market.liquidity}</div>
            </div>
            <div className="p-4 bg-surface/50 rounded-lg border border-border/50">
              <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
                <Clock className="w-4 h-4" />
                Ends In
              </div>
              <div className="text-xl font-bold">{market.endsIn}</div>
            </div>
          </div>

          {/* Odds Display */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-6 bg-success/10 border-2 border-success/30 rounded-lg">
              <div className="text-4xl font-bold text-success mb-1">
                {market.yesOdds}%
              </div>
              <div className="text-sm text-text-muted">YES</div>
            </div>
            <div className="p-6 bg-destructive/10 border-2 border-destructive/30 rounded-lg">
              <div className="text-4xl font-bold text-destructive mb-1">
                {market.noOdds}%
              </div>
              <div className="text-sm text-text-muted">NO</div>
            </div>
          </div>

          {/* Place Bet Button */}
          <Button
            size="lg"
            onClick={() => setIsBetTicketOpen(true)}
            className="w-full mt-6 bg-gradient-to-r from-orange-primary to-blue-electric hover:opacity-90"
          >
            Place Bet
          </Button>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div {...containerVariants} transition={{ delay: 0.2 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orderbook">Orderbook</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="p-6 glass-surface">
              <h3 className="text-xl font-bold mb-4">Market Overview</h3>
              <div className="space-y-4 text-text-secondary">
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">
                    Description
                  </h4>
                  <p>{market.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">
                    Resolution Source
                  </h4>
                  <p>{market.resolutionSource}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">
                    Created By
                  </h4>
                  <code className="text-sm font-mono">{market.createdBy}</code>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="orderbook">
            <Card className="p-6 glass-surface">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Orderbook
              </h3>
              <div className="text-center py-12 text-text-muted">
                <p className="mb-2">📊 Orderbook visualization coming soon</p>
                <p className="text-sm">
                  Real-time bid/ask spreads with depth chart visualization
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="trades">
            <Card className="p-6 glass-surface">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Trades
              </h3>
              <div className="text-center py-12 text-text-muted">
                <p className="mb-2">📈 Trade feed coming soon</p>
                <p className="text-sm">
                  Live stream of market trades with price impact analysis
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="rules">
            <Card className="p-6 glass-surface">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Market Rules & Resolution
              </h3>
              <div className="space-y-4 text-text-secondary">
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">
                    Resolution Criteria
                  </h4>
                  <p>{market.resolutionSource}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">
                    Trading Rules
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Minimum bet: 1 AGORA</li>
                    <li>Maximum bet: No limit (subject to liquidity)</li>
                    <li>
                      Fee structure: 0.1% maker / 0.2% taker / 0.05% protocol
                    </li>
                    <li>Settlement: Instant upon resolution</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">
                    Dispute Resolution
                  </h4>
                  <p>
                    In case of ambiguous outcomes, market creator or designated
                    oracle will resolve based on official data sources.
                    Community governance may override in cases of clear error.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="p-6 glass-surface">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Social Activity
              </h3>
              <div className="text-center py-12 text-text-muted">
                <p className="mb-2">💬 Social feed coming soon</p>
                <p className="text-sm">
                  Comments, predictions, and community sentiment analysis
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Bet Ticket Modal */}
      <BetTicket
        market={market}
        open={isBetTicketOpen}
        onOpenChange={setIsBetTicketOpen}
      />
    </div>
  );
}
