import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Copy, 
  ExternalLink, 
  Trophy, 
  TrendingUp, 
  Target, 
  Zap, 
  Link as LinkIcon, 
  Search, 
  DollarSign,
  CheckCircle,
  Hammer
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const badges = [
  { id: 1, tier: "bronze", name: "First Chain", icon: LinkIcon, unlocked: true, progress: 100 },
  { id: 2, tier: "bronze", name: "Market Explorer", icon: Search, unlocked: true, progress: 100 },
  { id: 3, tier: "bronze", name: "Predictor", icon: Target, unlocked: true, progress: 100 },
  { id: 4, tier: "silver", name: "Active Trader", icon: TrendingUp, unlocked: false, progress: 68 },
  { id: 5, tier: "silver", name: "Market Maker", icon: Hammer, unlocked: false, progress: 0 },
  { id: 6, tier: "gold", name: "Prediction Expert", icon: Trophy, unlocked: false, progress: 12 },
  { id: 7, tier: "platinum", name: "Chain Legend", icon: Zap, unlocked: false, progress: 0 },
];

const recentActivity = [
  { id: 1, type: "bet", action: "Placed bet on 'Bitcoin $100k'", amount: "+$250", time: "2 hours ago", icon: Target },
  { id: 2, type: "win", action: "Won market 'AI Breakthrough'", amount: "+$420", time: "5 hours ago", icon: CheckCircle },
  { id: 3, type: "create", action: "Created market 'Tech IPO'", amount: "", time: "1 day ago", icon: Hammer },
  { id: 4, type: "bet", action: "Placed bet on 'Climate Summit'", amount: "+$150", time: "2 days ago", icon: DollarSign },
];

export default function Profile() {
  const chainId = "chain_a7f3d9c2e8b1";
  
  const copyChainId = () => {
    navigator.clipboard.writeText(chainId);
    toast.success("Chain ID copied!");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <Card className="p-8 glass-surface">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24 border-2 border-orange-primary">
              <AvatarFallback className="text-3xl bg-gradient-to-br from-orange-primary to-blue-electric text-white">
                AG
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Agora Explorer</h1>
              <div className="flex items-center gap-2 mb-4">
                <code className="text-sm text-text-muted font-mono">{chainId}</code>
                <Button size="sm" variant="ghost" onClick={copyChainId} className="h-6 w-6 p-0">
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-orange-primary" />
                  <span className="text-text-muted">Reputation:</span>
                  <span className="font-semibold">847</span>
                </span>
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-electric" />
                  <span className="text-text-muted">Win Rate:</span>
                  <span className="font-semibold">68%</span>
                </span>
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-text-muted">Total P&L:</span>
                  <span className="font-semibold text-success">+$2,340</span>
                </span>
              </div>
            </div>

            <Button className="bg-gradient-to-r from-orange-primary to-blue-electric hover:opacity-90">
              Edit Profile
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-4 gap-4 mb-12"
      >
        <Card className="p-6 glass-surface">
          <div className="text-text-muted text-sm mb-1">Total Volume</div>
          <div className="text-2xl font-bold">$12.4K</div>
        </Card>
        <Card className="p-6 glass-surface">
          <div className="text-text-muted text-sm mb-1">Markets Created</div>
          <div className="text-2xl font-bold">3</div>
        </Card>
        <Card className="p-6 glass-surface">
          <div className="text-text-muted text-sm mb-1">Active Positions</div>
          <div className="text-2xl font-bold">7</div>
        </Card>
        <Card className="p-6 glass-surface">
          <div className="text-text-muted text-sm mb-1">Badges Earned</div>
          <div className="text-2xl font-bold">3/7</div>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-[1fr_400px] gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Achievement Badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 glass-surface">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-orange-primary" />
                Chain Mastery Badges
              </h2>

              {/* Badge Tiers */}
              <div className="space-y-6">
                {["bronze", "silver", "gold", "platinum"].map((tier) => {
                  const tierBadges = badges.filter((b) => b.tier === tier);
                  const tierColors = {
                    bronze: "orange-accent",
                    silver: "text-secondary",
                    gold: "warning",
                    platinum: "cyan-bright",
                  };
                  const color = tierColors[tier as keyof typeof tierColors];

                  return (
                    <div key={tier}>
                      <h3 className={`font-semibold mb-3 capitalize text-${color}`}>
                        {tier} Chains
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {tierBadges.map((badge) => {
                          const BadgeIcon = badge.icon;
                          return (
                            <motion.div
                              key={badge.id}
                              whileHover={{ scale: 1.05 }}
                              className={`p-4 rounded-lg border text-center ${
                                badge.unlocked
                                  ? "bg-surface-elevated border-orange-primary/50"
                                  : "bg-surface/50 border-border/50 opacity-60"
                              }`}
                            >
                              <div className="w-12 h-12 rounded-lg bg-orange-primary/20 flex items-center justify-center mx-auto mb-2">
                                <BadgeIcon className="w-6 h-6 text-orange-primary" />
                              </div>
                              <div className="text-xs font-medium mb-1">{badge.name}</div>
                              {!badge.unlocked && badge.progress > 0 && (
                                <div className="mt-2">
                                  <div className="h-1 bg-surface rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-orange-primary"
                                      style={{ width: `${badge.progress}%` }}
                                    />
                                  </div>
                                  <div className="text-xs text-text-muted mt-1">{badge.progress}%</div>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 glass-surface">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-electric" />
                Recent Activity
              </h3>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const ActivityIcon = activity.icon;

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (index * 0.05) }}
                      className="p-4 bg-surface-elevated rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-electric/20 flex items-center justify-center flex-shrink-0">
                          <ActivityIcon className="w-5 h-5 text-blue-electric" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-text-muted mt-1">{activity.time}</p>
                        </div>
                        {activity.amount && (
                          <span className="text-sm font-semibold text-success whitespace-nowrap">
                            {activity.amount}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <Button variant="outline" className="w-full mt-4">
                View All Activity
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
