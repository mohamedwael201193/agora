/**
 * Brier Score Utilities for Confidence Flip Game
 *
 * The Brier score measures the accuracy of probabilistic predictions.
 * Score ranges from 0 (perfect) to 1 (worst).
 * Formula: (outcome - probability)²
 */

export type Badge = "bronze" | "silver" | "gold" | "platinum" | "none";

export interface GameRound {
  roundNumber: number;
  probability: number; // 0-100 (confidence %)
  outcome: boolean; // true = YES, false = NO
  brierScore: number; // 0 to 1 (lower = better)
  timestamp: number;
}

/**
 * Calculate Brier score for a single prediction
 * Lower is better (0 = perfect, 1 = worst)
 * @param outcome - Actual outcome (true = YES, false = NO)
 * @param prediction - Predicted probability of YES (0-100)
 * @returns Brier score (0-1)
 */
export function calculateBrierScore(
  outcome: boolean,
  prediction: number
): number {
  const actualOutcome = outcome ? 1 : 0;
  const predictedProbability = prediction / 100;

  // Brier score formula: (outcome - probability)²
  return Math.pow(actualOutcome - predictedProbability, 2);
}

/**
 * Calculate average Brier score for a game
 * @param rounds - Array of completed game rounds
 * @returns Average score from 0 to 1
 */
export function calculateAverageScore(rounds: GameRound[]): number {
  if (rounds.length === 0) return 0;
  const sum = rounds.reduce((total, round) => total + round.brierScore, 0);
  return sum / rounds.length;
}

/**
 * Convert Brier score (0-1) to percentile score (0-100)
 * @param brierScore - Score from 0 to 1
 * @returns Score from 0 to 100
 */
export function toPercentileScore(brierScore: number): number {
  return (1 - brierScore) * 100;
}

/**
 * Calculate badge based on percentile score
 * @param percentileScore - Score as percentile (0-100, higher is better)
 * @returns Badge tier
 */
export function calculateBadge(percentileScore: number): Badge {
  if (percentileScore >= 92) return "platinum";
  if (percentileScore >= 85) return "gold";
  if (percentileScore >= 75) return "silver";
  if (percentileScore >= 60) return "bronze";
  return "none";
}

/**
 * Get display information for badge
 * @param badge - Badge tier
 * @returns Badge metadata
 */
export function getBadgeInfo(badge: Badge): {
  name: string;
  emoji: string;
  color: string;
  gradient: string;
  description: string;
} {
  switch (badge) {
    case "platinum":
      return {
        name: "Platinum",
        emoji: "💎",
        color: "hsl(220, 100%, 70%)",
        gradient:
          "linear-gradient(135deg, hsl(220, 100%, 70%), hsl(280, 100%, 70%))",
        description: "Elite calibration - top 8% of predictors",
      };
    case "gold":
      return {
        name: "Gold",
        emoji: "🥇",
        color: "hsl(45, 100%, 55%)",
        gradient:
          "linear-gradient(135deg, hsl(45, 100%, 55%), hsl(30, 100%, 50%))",
        description: "Excellent accuracy - top 15% of predictors",
      };
    case "silver":
      return {
        name: "Silver",
        emoji: "🥈",
        color: "hsl(0, 0%, 75%)",
        gradient: "linear-gradient(135deg, hsl(0, 0%, 85%), hsl(0, 0%, 65%))",
        description: "Strong performance - top 25% of predictors",
      };
    case "bronze":
      return {
        name: "Bronze",
        emoji: "🥉",
        color: "hsl(30, 100%, 50%)",
        gradient:
          "linear-gradient(135deg, hsl(35, 90%, 55%), hsl(25, 80%, 45%))",
        description: "Good calibration - top 40% of predictors",
      };
    default:
      return {
        name: "None",
        emoji: "📊",
        color: "hsl(var(--muted))",
        gradient:
          "linear-gradient(135deg, hsl(var(--muted)), hsl(var(--muted-foreground)))",
        description: "Keep practicing to earn a badge",
      };
  }
}

/**
 * Generate a random outcome for demo purposes
 * @returns Random outcome true (YES) or false (NO) with 50/50 probability
 */
export function generateRandomOutcome(): boolean {
  return Math.random() < 0.5;
}

/**
 * Analyze calibration and provide feedback
 * @param rounds - Array of game rounds
 * @returns Calibration advice with trend
 */
export function getCalibrationAdvice(rounds: GameRound[]): {
  advice: string;
  trend: "over" | "under" | "balanced";
} {
  if (rounds.length === 0) {
    return {
      advice: "No data yet - play some rounds!",
      trend: "balanced",
    };
  }

  // Calculate average prediction vs actual outcomes
  const avgPrediction =
    rounds.reduce((sum, r) => sum + r.probability, 0) / rounds.length;
  const yesOutcomes = rounds.filter((r) => r.outcome).length;
  const actualYesRate = (yesOutcomes / rounds.length) * 100;

  const diff = avgPrediction - actualYesRate;

  if (Math.abs(diff) < 10) {
    return {
      advice: "Well calibrated! Your confidence matches your accuracy.",
      trend: "balanced",
    };
  } else if (diff > 10) {
    return {
      advice:
        "You're predicting with more certainty than your results justify. Try being more conservative.",
      trend: "over",
    };
  } else {
    return {
      advice:
        "You're more accurate than you think! Don't be afraid to express stronger opinions.",
      trend: "under",
    };
  }
}

/**
 * Format score for display
 * @param score - Score from 0 to 1
 * @returns Formatted string (e.g., "0.847")
 */
export function formatScore(score: number): string {
  return score.toFixed(3);
}

/**
 * Get score color class based on value
 * @param percentileScore - Score from 0 to 100
 * @returns Tailwind color class
 */
export function getScoreColor(percentileScore: number): string {
  if (percentileScore >= 92) return "text-cyan-500";
  if (percentileScore >= 85) return "text-orange-500";
  if (percentileScore >= 75) return "text-blue-500";
  if (percentileScore >= 60) return "text-green-500";
  return "text-muted-foreground";
}
