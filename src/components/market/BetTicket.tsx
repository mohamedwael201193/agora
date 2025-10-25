import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Market, useAgoraStore } from "@/stores/useAgoraStore";
import { calculateBetFees, hasSufficientBalance } from "@/utils/money";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const betSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .min(1, "Minimum bet is 1"),
});

interface BetTicketProps {
  market: Market;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BetTicket({ market, open, onOpenChange }: BetTicketProps) {
  const { balances, addPosition, addNotification, updateLatency, latency } =
    useAgoraStore();

  const [side, setSide] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Calculate fees and payout using money utilities
  const numAmount = parseFloat(amount) || 0;
  const feeBreakdown = calculateBetFees(numAmount);

  // Simple payout calculation based on odds
  const odds = side === "YES" ? market.yesOdds / 100 : market.noOdds / 100;
  const payoutEst = numAmount * (1 / odds) - parseFloat(feeBreakdown.totalFees);

  const availableBalance = balances.AGORA || 0;

  const validateBet = () => {
    try {
      betSchema.parse({ amount: numAmount });

      if (!hasSufficientBalance(numAmount, availableBalance)) {
        setError("Insufficient balance");
        return false;
      }

      setError(null);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
      return false;
    }
  };

  const handlePlaceBet = async () => {
    if (!validateBet()) {
      toast.error("Validation failed", {
        description: error || "Please check your inputs",
      });
      return;
    }

    setIsProcessing(true);
    const startTime = Date.now();

    try {
      // Simulate mutation latency
      await new Promise((resolve) => setTimeout(resolve, latency.mutation));

      // Add position
      addPosition({
        marketId: market.id,
        side,
        amount: numAmount,
        odds: side === "YES" ? market.yesOdds : market.noOdds,
        fees: {
          maker: parseFloat(feeBreakdown.makerFee),
          taker: parseFloat(feeBreakdown.takerFee),
          protocol: parseFloat(feeBreakdown.protocolFee),
          total: parseFloat(feeBreakdown.totalFees),
        },
        payoutEst,
        status: "open",
      });

      // Update balance (deduct bet amount + fees)
      const totalCost = parseFloat(feeBreakdown.totalCost);
      useAgoraStore.setState((state) => ({
        balances: {
          ...state.balances,
          AGORA: state.balances.AGORA - totalCost,
        },
      }));

      // Add notification
      setTimeout(() => {
        addNotification({
          type: "bet_placed",
          title: "Bet Placed Successfully",
          message: `${side} on "${market.question}" for ${numAmount} AGORA`,
          data: { marketId: market.id, side, amount: numAmount },
        });

        const endToEndTime = Date.now() - startTime;
        updateLatency({ endToEnd: endToEndTime });

        toast.success("Bet placed!", {
          description: `${side} position opened on ${market.question.substring(
            0,
            30
          )}...`,
        });
      }, latency.notification);

      // Close dialog and reset
      setTimeout(() => {
        onOpenChange(false);
        setAmount("");
        setSide("YES");
        setIsProcessing(false);
      }, latency.notification + 100);
    } catch (err) {
      setIsProcessing(false);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to place bet";
      setError(errorMessage);
      toast.error("Bet failed", { description: errorMessage });
    }
  };

  const containerVariants = prefersReducedMotion
    ? {}
    : {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.95, opacity: 0 },
      };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <motion.div {...containerVariants}>
          <DialogHeader>
            <DialogTitle className="text-xl">Place Bet</DialogTitle>
            <DialogDescription className="text-text-secondary">
              {market.question}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Side Selection */}
            <div>
              <Label className="mb-3 block">Select Outcome</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={side === "YES" ? "default" : "outline"}
                  onClick={() => setSide("YES")}
                  disabled={isProcessing}
                  className={`h-auto py-4 flex flex-col items-center gap-2 ${
                    side === "YES"
                      ? "bg-gradient-to-br from-success to-lime-electric"
                      : ""
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-bold">YES</span>
                  <span className="text-xs opacity-80">{market.yesOdds}%</span>
                </Button>
                <Button
                  type="button"
                  variant={side === "NO" ? "default" : "outline"}
                  onClick={() => setSide("NO")}
                  disabled={isProcessing}
                  className={`h-auto py-4 flex flex-col items-center gap-2 ${
                    side === "NO"
                      ? "bg-gradient-to-br from-destructive to-orange-primary"
                      : ""
                  }`}
                >
                  <TrendingDown className="w-5 h-5" />
                  <span className="font-bold">NO</span>
                  <span className="text-xs opacity-80">{market.noOdds}%</span>
                </Button>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <Label htmlFor="betAmount">Amount (AGORA)</Label>
              <Input
                id="betAmount"
                type="number"
                step="1"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isProcessing}
                className="mt-1.5 text-lg"
              />
              <div className="flex justify-between items-center mt-1.5 text-xs">
                <span className="text-text-muted">
                  Available: {availableBalance.toFixed(2)} AGORA
                </span>
                {error && (
                  <span className="text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </span>
                )}
              </div>
            </div>

            {/* Fee Breakdown */}
            {numAmount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-surface/50 rounded-lg p-4 space-y-2 text-sm"
              >
                <div className="flex justify-between text-text-secondary">
                  <span>Bet Amount</span>
                  <span className="font-medium">
                    {feeBreakdown.amount} AGORA
                  </span>
                </div>
                <div className="flex justify-between text-text-muted text-xs">
                  <span>Maker Fee (0.1%)</span>
                  <span>{feeBreakdown.makerFee}</span>
                </div>
                <div className="flex justify-between text-text-muted text-xs">
                  <span>Taker Fee (0.2%)</span>
                  <span>{feeBreakdown.takerFee}</span>
                </div>
                <div className="flex justify-between text-text-muted text-xs">
                  <span>Protocol Fee (0.05%)</span>
                  <span>{feeBreakdown.protocolFee}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-text-secondary font-semibold">
                  <span>Total Fees</span>
                  <span>{feeBreakdown.totalFees} AGORA</span>
                </div>
                <div className="flex justify-between text-text-primary font-bold text-base">
                  <span>Estimated Payout</span>
                  <span className="text-gradient-primary">
                    {payoutEst.toFixed(2)} AGORA
                  </span>
                </div>
              </motion.div>
            )}

            {/* Slippage Notice */}
            {numAmount > 0 && (
              <div className="flex items-start gap-2 text-xs text-text-muted bg-orange-primary/10 border border-orange-primary/30 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 text-orange-primary mt-0.5 flex-shrink-0" />
                <p>
                  Estimated payout is based on current odds. Actual payout may
                  vary due to market movements and liquidity.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handlePlaceBet}
                disabled={isProcessing || !amount || !!error}
                className="flex-1 bg-gradient-to-r from-orange-primary to-blue-electric hover:opacity-90"
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={prefersReducedMotion ? {} : { rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Placing...
                  </>
                ) : (
                  `Place ${side} Bet`
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
