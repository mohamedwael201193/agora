import marketplacePreview from "@/assets/marketplace-preview.jpg";
import { BetTicket } from "@/components/market/BetTicket";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Market } from "@/stores/useAgoraStore";
import { motion } from "framer-motion";
import { Clock, Search, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  "All",
  "Sports",
  "Politics",
  "Crypto",
  "Entertainment",
  "Custom",
];

const markets = [
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
  },
];

export default function Marketplace() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [isBetTicketOpen, setIsBetTicketOpen] = useState(false);

  const handlePlaceBet = (market: Market, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setSelectedMarket(market);
    setIsBetTicketOpen(true);
  };

  const handleCardClick = (marketId: string) => {
    navigate(`/marketplace/${marketId}`);
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
          <Button className="bg-gradient-to-r from-orange-primary to-blue-electric hover:opacity-90">
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

      {/* Market Grid */}
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
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                  <div className="text-2xl font-bold text-success mb-1">
                    {market.yesOdds}%
                  </div>
                  <div className="text-sm text-text-muted">Yes</div>
                </div>
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <div className="text-2xl font-bold text-destructive mb-1">
                    {market.noOdds}%
                  </div>
                  <div className="text-sm text-text-muted">No</div>
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
                <Button
                  onClick={(e) => handlePlaceBet(market, e)}
                  className="bg-gradient-to-r from-orange-primary to-orange-secondary hover:opacity-90"
                >
                  Place Bet
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMarkets.length === 0 && (
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
