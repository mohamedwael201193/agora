import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { GameResult } from "@/stores/useAgoraStore";
import { formatScore, getBadgeInfo } from "@/utils/brier";
import { motion } from "framer-motion";
import { ChevronDown, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { memo, useState } from "react";

interface GameHistoryItemProps {
  game: GameResult;
}

const GameHistoryItem = memo(function GameHistoryItem({
  game,
}: GameHistoryItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const badgeInfo = getBadgeInfo(game.badge);

  const formattedDate = new Date(game.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="text-3xl"
                  role="img"
                  aria-label={`${game.badge} badge`}
                >
                  {badgeInfo.emoji}
                </div>
                <div className="text-left">
                  <CardTitle className="text-lg">
                    {badgeInfo.name} Badge
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formattedDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Score Display */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {game.percentileScore.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Brier: {formatScore(game.finalScore)}
                  </div>
                </div>

                {/* Calibration Indicator */}
                <div className="flex items-center gap-1">
                  {game.overconfident && (
                    <Badge variant="outline" className="gap-1">
                      <TrendingUp className="h-3 w-3" aria-hidden="true" />
                      <span className="sr-only">Overconfident</span>
                    </Badge>
                  )}
                  {game.underconfident && (
                    <Badge variant="outline" className="gap-1">
                      <TrendingDown className="h-3 w-3" aria-hidden="true" />
                      <span className="sr-only">Underconfident</span>
                    </Badge>
                  )}
                  {!game.overconfident && !game.underconfident && (
                    <Badge variant="outline" className="gap-1">
                      <Minus className="h-3 w-3" aria-hidden="true" />
                      <span className="sr-only">Well calibrated</span>
                    </Badge>
                  )}
                </div>

                {/* Expand Icon */}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown
                    className="h-5 w-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </motion.div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Total Rounds
                  </div>
                  <div className="text-xl font-bold">{game.totalRounds}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Avg Confidence
                  </div>
                  <div className="text-xl font-bold">
                    {(
                      game.rounds.reduce((sum, r) => sum + r.probability, 0) /
                      game.rounds.length
                    ).toFixed(0)}
                    %
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">
                    Correct
                  </div>
                  <div className="text-xl font-bold">
                    {
                      game.rounds.filter((r) => {
                        const predictedYes = r.probability >= 50;
                        return predictedYes === r.outcome;
                      }).length
                    }
                    /{game.totalRounds}
                  </div>
                </div>
              </div>

              {/* Round by Round Breakdown */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">
                  Round Breakdown
                </h4>
                <div className="space-y-1">
                  {game.rounds.map((round) => {
                    const predictedYes = round.probability >= 50;
                    const wasCorrect = predictedYes === round.outcome;
                    const scoreQuality =
                      round.brierScore < 0.25
                        ? "excellent"
                        : round.brierScore < 0.5
                        ? "good"
                        : "poor";

                    return (
                      <div
                        key={round.roundNumber}
                        className={`p-3 rounded border ${
                          wasCorrect
                            ? "border-green-500/20 bg-green-500/5"
                            : "border-red-500/20 bg-red-500/5"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-medium text-muted-foreground w-16">
                              Round {round.roundNumber}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={wasCorrect ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {round.outcome ? "YES" : "NO"}
                              </Badge>
                              <span className="text-sm">
                                Predicted: {round.probability}% YES
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                scoreQuality === "excellent"
                                  ? "default"
                                  : scoreQuality === "good"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {formatScore(round.brierScore)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
});

export default GameHistoryItem;
