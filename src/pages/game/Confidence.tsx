import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useAgoraStore } from "@/stores/useAgoraStore";
import {
  calculateBadge,
  calculateBrierScore,
  generateRandomOutcome,
  getBadgeInfo,
  getCalibrationAdvice,
} from "@/utils/brier";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  Minus,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const TOTAL_ROUNDS = 10;

type GamePhase = "intro" | "prediction" | "outcome" | "complete";

export default function Confidence() {
  const shouldReduceMotion = useReducedMotion();
  const {
    currentGame,
    startGame,
    submitRound,
    finishGame,
    abandonGame,
    bestScore,
    totalGames,
  } = useAgoraStore();

  const [phase, setPhase] = useState<GamePhase>("intro");
  const [probability, setProbability] = useState(50);
  const [currentOutcome, setCurrentOutcome] = useState<boolean | null>(null);
  const [currentBrierScore, setCurrentBrierScore] = useState<number | null>(
    null
  );
  const [predictedSide, setPredictedSide] = useState<"YES" | "NO" | null>(null);
  const [showAchievement, setShowAchievement] = useState(false);

  // Store final game results for display after currentGame is cleared
  const [finalPercentileScore, setFinalPercentileScore] = useState(0);
  const [finalBadge, setFinalBadge] = useState<
    "bronze" | "silver" | "gold" | "platinum" | "none"
  >("none");
  const [finalRounds, setFinalRounds] = useState<any[]>([]);

  // Calculate running average Brier score
  const runningAverage = currentGame
    ? currentGame.rounds.reduce((sum, r) => sum + r.brierScore, 0) /
      currentGame.rounds.length
    : null;

  const percentileScore =
    runningAverage !== null ? (1 - runningAverage) * 100 : 0;

  // Handle starting new game
  const handleStartGame = () => {
    startGame();
    setPhase("prediction");
    setProbability(50);
    setCurrentOutcome(null);
    setCurrentBrierScore(null);
    setPredictedSide(null);
    setFinalPercentileScore(0);
    setFinalBadge("none");
    setFinalRounds([]);
  };

  // Handle submitting prediction
  const handleSubmitPrediction = (side: "YES" | "NO", prob: number) => {
    if (!currentGame) return;

    // Generate random outcome
    const outcome = generateRandomOutcome();
    const brierScore = calculateBrierScore(outcome, prob);

    // Submit to store
    submitRound(prob, outcome, brierScore);

    // Update local state for animation
    setCurrentOutcome(outcome);
    setCurrentBrierScore(brierScore);
    setPredictedSide(side);
    setPhase("outcome");
  };

  // Handle advancing to next round
  const handleNextRound = () => {
    if (!currentGame) return;

    if (currentGame.rounds.length >= TOTAL_ROUNDS) {
      // Game complete - calculate and store final results before finishing
      const finalAvg =
        currentGame.rounds.reduce((sum, r) => sum + r.brierScore, 0) /
        currentGame.rounds.length;
      const finalPercentile = (1 - finalAvg) * 100;
      const badge = calculateBadge(finalPercentile);

      // Store final results in component state before clearing currentGame
      setFinalPercentileScore(finalPercentile);
      setFinalBadge(badge);
      setFinalRounds(currentGame.rounds);

      finishGame(finalAvg, finalPercentile, badge);
      setPhase("complete");
      setShowAchievement(true);
    } else {
      // Next round
      setProbability(50);
      setCurrentOutcome(null);
      setCurrentBrierScore(null);
      setPredictedSide(null);
      setPhase("prediction");
    }
  };

  // Handle abandoning game
  const handleAbandonGame = () => {
    abandonGame();
    setPhase("intro");
    setProbability(50);
    setCurrentOutcome(null);
    setCurrentBrierScore(null);
    setPredictedSide(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't abandon game on unmount - let user resume
    };
  }, []);

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : -20 },
  };

  const slideIn = {
    initial: { opacity: 0, x: shouldReduceMotion ? 0 : -40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: shouldReduceMotion ? 0 : 40 },
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Screen reader announcements */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {phase === "outcome" && currentOutcome !== null && (
          <>
            The coin landed on {currentOutcome ? "HEADS" : "TAILS"}. Your
            prediction was {predictedSide} with{" "}
            {predictedSide === "YES"
              ? currentGame?.rounds[currentGame.rounds.length - 1]?.probability
              : 100 -
                (currentGame?.rounds[currentGame.rounds.length - 1]
                  ?.probability || 0)}{" "}
            percent confidence. Brier score: {currentBrierScore?.toFixed(4)}.
          </>
        )}
        {phase === "complete" && (
          <>
            Game complete! Final percentile score:{" "}
            {finalPercentileScore.toFixed(1)} percent. Badge earned:{" "}
            {getBadgeInfo(finalBadge).name}.
          </>
        )}
      </div>

      {/* Header */}
      <motion.div className="mb-8 text-center" {...fadeIn}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Target className="h-8 w-8 text-primary" aria-hidden="true" />
          <h1 className="text-4xl font-bold">Confidence Flip</h1>
        </div>
        <p className="text-muted-foreground">
          Test your prediction skills. Guess the outcome and assign your
          confidence level.
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Badge
            variant="outline"
            aria-label={`Best score: ${bestScore.toFixed(1)} percent`}
          >
            Best: {bestScore.toFixed(1)}%
          </Badge>
          <Badge
            variant="outline"
            aria-label={`Total games played: ${totalGames}`}
          >
            Games: {totalGames}
          </Badge>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Intro Phase */}
        {phase === "intro" && (
          <motion.div key="intro" {...fadeIn}>
            <Card>
              <CardHeader>
                <CardTitle>How to Play</CardTitle>
                <CardDescription>
                  A prediction accuracy game based on Brier scoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Rules:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>You'll play 10 rounds of coin flip predictions</li>
                    <li>
                      Each round, predict YES or NO and set your confidence
                      (5%-95%)
                    </li>
                    <li>The outcome is revealed instantly</li>
                    <li>
                      Your accuracy is measured using Brier scoring (lower is
                      better)
                    </li>
                    <li>
                      Achieve badges: Bronze (60%+), Silver (75%+), Gold (85%+),
                      Platinum (92%+)
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">💡 Pro Tip:</h3>
                  <p className="text-sm text-muted-foreground">
                    The key is calibration: match your confidence to your actual
                    accuracy. If you're right 70% of the time, your average
                    confidence should be ~70%.
                  </p>
                </div>

                <Button
                  onClick={handleStartGame}
                  className="w-full"
                  size="lg"
                  aria-label="Start new prediction game"
                >
                  Start Game
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Prediction Phase */}
        {phase === "prediction" && currentGame && (
          <motion.div key="prediction" {...slideIn}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Round {currentGame.roundNumber} of {TOTAL_ROUNDS}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAbandonGame}
                    aria-label="Abandon game"
                  >
                    Abandon
                  </Button>
                </div>
                <Progress
                  value={(currentGame.rounds.length / TOTAL_ROUNDS) * 100}
                  className="h-2"
                />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Running Score */}
                {currentGame.rounds.length > 0 && (
                  <motion.div
                    className="p-4 bg-muted rounded-lg"
                    initial={{
                      opacity: 0,
                      scale: shouldReduceMotion ? 1 : 0.95,
                    }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Current Score:
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {percentileScore.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Average Brier: {runningAverage?.toFixed(4)}
                    </div>
                  </motion.div>
                )}

                {/* Question */}
                <div className="text-center py-8">
                  <h2 className="text-3xl font-bold mb-4">
                    Will the coin land on{" "}
                    <span className="text-primary">HEADS</span>?
                  </h2>
                  <p className="text-muted-foreground">
                    Set your confidence level and make your prediction
                  </p>
                </div>

                {/* Confidence Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="confidence-slider"
                      className="text-sm font-medium"
                    >
                      Confidence Level
                    </label>
                    <span className="text-3xl font-bold text-primary">
                      {probability}%
                    </span>
                  </div>
                  <Slider
                    id="confidence-slider"
                    value={[probability]}
                    onValueChange={(val) => setProbability(val[0])}
                    min={5}
                    max={95}
                    step={5}
                    className="w-full"
                    aria-label={`Confidence level slider, currently at ${probability} percent`}
                    aria-valuemin={5}
                    aria-valuemax={95}
                    aria-valuenow={probability}
                    aria-valuetext={`${probability} percent confidence`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5% (Very Unlikely)</span>
                    <span>50% (Toss-up)</span>
                    <span>95% (Very Likely)</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      // For NO prediction, use inverted probability
                      const noProbability = 100 - probability;
                      handleSubmitPrediction("NO", noProbability);
                    }}
                    className="h-20"
                    aria-label={`Predict NO, meaning Tails, with ${
                      100 - probability
                    } percent confidence. Press Enter or Space to submit.`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <XCircle
                        className="h-6 w-6 text-destructive"
                        aria-hidden="true"
                      />
                      <span className="font-bold">
                        NO ({100 - probability}%)
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Tails
                      </span>
                    </div>
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => handleSubmitPrediction("YES", probability)}
                    className="h-20"
                    aria-label={`Predict YES, meaning Heads, with ${probability} percent confidence. Press Enter or Space to submit.`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                      <span className="font-bold">YES ({probability}%)</span>
                      <span className="text-xs">Heads</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Outcome Phase */}
        {phase === "outcome" &&
          currentGame &&
          currentOutcome !== null &&
          currentBrierScore !== null && (
            <motion.div key="outcome" {...fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    Round {currentGame.rounds.length} Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Outcome Display */}
                  <motion.div
                    className={`p-8 rounded-lg text-center ${
                      currentOutcome ? "bg-primary/10" : "bg-destructive/10"
                    }`}
                    initial={{
                      scale: shouldReduceMotion ? 1 : 0.8,
                      opacity: 0,
                    }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                  >
                    {currentOutcome ? (
                      <>
                        <CheckCircle2
                          className="h-16 w-16 text-primary mx-auto mb-4"
                          aria-hidden="true"
                        />
                        <h2 className="text-3xl font-bold text-primary">
                          HEADS!
                        </h2>
                      </>
                    ) : (
                      <>
                        <XCircle
                          className="h-16 w-16 text-destructive mx-auto mb-4"
                          aria-hidden="true"
                        />
                        <h2 className="text-3xl font-bold text-destructive">
                          TAILS!
                        </h2>
                      </>
                    )}
                  </motion.div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">
                        Your Prediction
                      </div>
                      <div className="text-2xl font-bold">
                        {predictedSide === "YES"
                          ? `${
                              currentGame.rounds[currentGame.rounds.length - 1]
                                ?.probability
                            }% YES`
                          : `${
                              100 -
                              currentGame.rounds[currentGame.rounds.length - 1]
                                ?.probability
                            }% NO`}
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">
                        Brier Score
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {currentBrierScore.toFixed(4)}
                      </div>
                    </div>
                  </div>

                  {/* Performance Indicator */}
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Round Performance:
                      </span>
                      <Badge
                        variant={
                          currentBrierScore < 0.25
                            ? "default"
                            : currentBrierScore < 0.5
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {currentBrierScore < 0.25
                          ? "Excellent"
                          : currentBrierScore < 0.5
                          ? "Good"
                          : "Poor"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {currentBrierScore < 0.25
                        ? "Your confidence matched the outcome well!"
                        : currentBrierScore < 0.5
                        ? "Decent prediction, but room for calibration improvement."
                        : "Consider adjusting your confidence levels."}
                    </p>
                  </div>

                  <Button
                    onClick={handleNextRound}
                    className="w-full"
                    size="lg"
                  >
                    {currentGame.rounds.length >= TOTAL_ROUNDS
                      ? "View Results"
                      : "Next Round →"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

        {/* Complete Phase */}
        {phase === "complete" && (
          <motion.div key="complete" {...fadeIn}>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Game Complete!</CardTitle>
                <CardDescription className="text-center">
                  Here's how you performed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Final Score */}
                <div className="text-center py-6">
                  <Trophy
                    className="h-16 w-16 text-primary mx-auto mb-4"
                    aria-hidden="true"
                  />
                  <div className="text-6xl font-bold text-primary mb-2">
                    {finalPercentileScore.toFixed(1)}%
                  </div>
                  <div className="text-muted-foreground">Percentile Score</div>
                </div>

                {/* Badge Display */}
                {(() => {
                  const badgeInfo = getBadgeInfo(finalBadge);
                  return finalBadge !== "none" ? (
                    <motion.div
                      className="p-6 rounded-lg text-center"
                      style={{ background: badgeInfo.gradient }}
                      initial={{
                        scale: shouldReduceMotion ? 1 : 0.8,
                        opacity: 0,
                      }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    >
                      <div
                        className="text-4xl mb-2"
                        role="img"
                        aria-label={`${finalBadge} badge`}
                      >
                        {badgeInfo.emoji}
                      </div>
                      <div className="text-xl font-bold text-white">
                        {badgeInfo.name} Badge Earned!
                      </div>
                      <div className="text-sm text-white/80 mt-1">
                        {badgeInfo.description}
                      </div>
                    </motion.div>
                  ) : null;
                })()}

                {/* Calibration Advice */}
                {finalRounds.length > 0 && (
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      {(() => {
                        const advice = getCalibrationAdvice(finalRounds);
                        return advice.trend === "over" ? (
                          <>
                            <TrendingUp
                              className="h-4 w-4 text-orange-500"
                              aria-hidden="true"
                            />
                            <span>Overconfident</span>
                          </>
                        ) : advice.trend === "under" ? (
                          <>
                            <TrendingDown
                              className="h-4 w-4 text-blue-500"
                              aria-hidden="true"
                            />
                            <span>Underconfident</span>
                          </>
                        ) : (
                          <>
                            <Minus className="h-4 w-4" aria-hidden="true" />
                            <span>Well Calibrated</span>
                          </>
                        );
                      })()}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getCalibrationAdvice(finalRounds).advice}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => setPhase("intro")}>
                    Back to Menu
                  </Button>
                  <Button onClick={handleStartGame}>Play Again</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Dialog */}
      <Dialog open={showAchievement} onOpenChange={setShowAchievement}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Achievement Unlocked! 🎉
            </DialogTitle>
            <DialogDescription className="text-center">
              You've earned a new badge for your performance
            </DialogDescription>
          </DialogHeader>
          {(() => {
            const badgeInfo = getBadgeInfo(finalBadge);
            return finalBadge !== "none" ? (
              <div className="text-center py-6">
                <motion.div
                  className="text-6xl mb-4"
                  initial={{
                    scale: shouldReduceMotion ? 1 : 0,
                    rotate: shouldReduceMotion ? 0 : -180,
                  }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.6 }}
                  role="img"
                  aria-label={`${finalBadge} badge earned`}
                >
                  {badgeInfo.emoji}
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">
                  {badgeInfo.name} Badge
                </h3>
                <p className="text-muted-foreground mb-4">
                  {badgeInfo.description}
                </p>
                <div className="text-4xl font-bold text-primary">
                  {finalPercentileScore.toFixed(1)}%
                </div>
              </div>
            ) : null;
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
