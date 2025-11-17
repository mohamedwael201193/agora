import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  copyToClipboard,
  formatReceiptId,
  lineraClient,
  type GameRoundEvent,
} from "@/services/lineraClient";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  Copy,
  Database,
  ExternalLink,
  Hash,
  RefreshCw,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

interface OnChainLogProps {
  className?: string;
  maxHeight?: string;
  showRefresh?: boolean;
}

export const OnChainLog = ({
  className = "",
  maxHeight = "400px",
  showRefresh = true,
}: OnChainLogProps) => {
  const [rounds, setRounds] = useState<GameRoundEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRecentRounds = async () => {
    setLoading(true);
    try {
      const recentRounds = await lineraClient.queryRecentRounds(10);
      setRounds(recentRounds);
    } catch (error) {
      toast({
        title: "Query Failed",
        description: "Could not fetch recent rounds",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentRounds();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRecentRounds, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    toast({
      title: success ? "Copied!" : "Copy failed",
      description: success
        ? `${label} copied to clipboard`
        : "Please copy manually",
      variant: success ? "default" : "destructive",
    });
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - timestamp;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getOutcomeColor = (outcome: string) => {
    return outcome === "YES" ? "text-success" : "text-destructive";
  };

  const getBrierScoreColor = (score: number) => {
    if (score < 0.1) return "text-success";
    if (score < 0.25) return "text-orange-primary";
    return "text-destructive";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="glass-surface border-purple-deep/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-deep/5 to-transparent" />

        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-deep/20 flex items-center justify-center">
                <Database className="w-4 h-4 text-purple-deep" />
              </div>
              <div>
                <h3 className="font-semibold">On-Chain Log</h3>
                <p className="text-sm text-text-muted">
                  Recent game rounds from Conway testnet
                </p>
              </div>
            </div>

            {showRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRecentRounds}
                disabled={loading}
                className="h-8"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Loading..." : "Refresh"}
              </Button>
            )}
          </div>

          {/* Rounds List */}
          <ScrollArea className="h-full" style={{ maxHeight }}>
            {rounds.length === 0 ? (
              <div className="text-center py-8 text-text-muted">
                <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No rounds recorded yet</p>
                <p className="text-xs mt-1">
                  Play a game to see on-chain events
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {rounds.map((round, index) => (
                    <motion.div
                      key={round.roundId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-4 bg-surface/50 border border-border/50 hover:border-purple-deep/50 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-purple-deep flex-shrink-0" />
                            <span className="font-mono text-sm font-medium">
                              {round.userPseudo}
                            </span>
                            <Badge variant="outline" className="h-5 text-xs">
                              Round{" "}
                              {round.roundId.split("_")[1]?.slice(-6) || "XXX"}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-text-muted">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(round.timestamp)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                          <div>
                            <label className="text-xs text-text-muted uppercase tracking-wide">
                              Prediction
                            </label>
                            <div className="font-semibold">
                              {round.probability}% {round.outcome}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-text-muted uppercase tracking-wide">
                              Outcome
                            </label>
                            <div
                              className={`font-semibold ${getOutcomeColor(
                                round.outcome
                              )}`}
                            >
                              {round.outcome}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-text-muted uppercase tracking-wide">
                              Brier Score
                            </label>
                            <div
                              className={`font-semibold ${getBrierScoreColor(
                                round.brierScore
                              )}`}
                            >
                              {round.brierScore.toFixed(4)}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-text-muted uppercase tracking-wide">
                              Receipt
                            </label>
                            <div className="flex items-center gap-1">
                              <code className="text-xs bg-surface px-1 py-0.5 rounded">
                                {formatReceiptId(round.receiptId || "pending")}
                              </code>
                              {round.receiptId && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleCopy(round.receiptId!, "Receipt ID")
                                  }
                                  className="h-5 w-5 p-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Chain Data Row */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/30">
                          <div className="flex items-center gap-4 text-xs text-text-muted">
                            <div className="flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              <span>Round ID:</span>
                              <code className="bg-surface px-1 py-0.5 rounded">
                                {round.roundId}
                              </code>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCopy(
                                  JSON.stringify(round, null, 2),
                                  "Round Data"
                                )
                              }
                              className="h-6 text-xs"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy JSON
                            </Button>

                            {round.chainId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-6 text-xs"
                              >
                                <a
                                  href={`https://explorer.linera.dev/chain/${round.chainId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Explorer
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </ScrollArea>

          {/* Stats Summary */}
          {rounds.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex justify-between items-center text-xs text-text-muted">
                <span>
                  {rounds.length} rounds • Last updated{" "}
                  {formatTimestamp(Date.now())}
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>
                      Avg Brier:{" "}
                      {(
                        rounds.reduce((sum, r) => sum + r.brierScore, 0) /
                        rounds.length
                      ).toFixed(3)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>
                      {Math.round(
                        (rounds.filter((r) => r.outcome === "YES").length /
                          rounds.length) *
                          100
                      )}
                      % YES
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
