import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAgoraStore } from "@/stores/useAgoraStore";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Send,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Validation schema
const transferSchema = z.object({
  token: z.string().min(1, "Please select a token"),
  amount: z
    .number()
    .positive("Amount must be positive")
    .finite("Amount must be a valid number"),
  toAddress: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(100, "Address too long"),
});

type TransferStep =
  | "idle"
  | "building"
  | "submitting"
  | "settling"
  | "success"
  | "error";

export default function Transfer() {
  const { balances, sendTokens, latency, addNotification, updateLatency } =
    useAgoraStore();

  const [selectedToken, setSelectedToken] = useState("");
  const [amount, setAmount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [currentStep, setCurrentStep] = useState<TransferStep>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const prefersReducedMotion = useReducedMotion();

  // Configurable failure rate (5% for demo)
  const failureRate = 0.05;

  const validateForm = () => {
    try {
      const numAmount = parseFloat(amount);
      transferSchema.parse({
        token: selectedToken,
        amount: numAmount,
        toAddress,
      });

      // Check balance
      if (numAmount > balances[selectedToken]) {
        setErrors({ amount: "Insufficient balance" });
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Validation failed", {
        description: "Please check your inputs",
      });
      return;
    }

    const numAmount = parseFloat(amount);
    const startTime = Date.now();

    // Simulate random failure
    const shouldFail = Math.random() < failureRate;

    try {
      // Step 1: Building transaction
      setCurrentStep("building");
      await new Promise((resolve) =>
        setTimeout(resolve, latency.mutation * 0.4)
      );

      if (shouldFail && Math.random() > 0.5) {
        throw new Error("Transaction building failed");
      }

      // Step 2: Submitting to chain
      setCurrentStep("submitting");
      await new Promise((resolve) =>
        setTimeout(resolve, latency.mutation * 0.3)
      );

      if (shouldFail) {
        throw new Error("Transaction submission failed");
      }

      // Step 3: Settling cross-chain
      setCurrentStep("settling");
      await sendTokens(selectedToken, numAmount, toAddress);
      await new Promise((resolve) =>
        setTimeout(resolve, latency.mutation * 0.3)
      );

      // Success
      setCurrentStep("success");

      // Add notification
      setTimeout(() => {
        addNotification({
          type: "chain_message",
          title: "Transfer Completed",
          message: `Successfully sent ${numAmount} ${selectedToken} to ${toAddress.substring(
            0,
            10
          )}...`,
        });

        const endToEndTime = Date.now() - startTime;
        updateLatency({ endToEnd: endToEndTime });

        toast.success("Transfer successful!", {
          description: `${numAmount} ${selectedToken} sent`,
        });
      }, latency.notification);

      // Reset form after delay
      setTimeout(() => {
        setCurrentStep("idle");
        setAmount("");
        setToAddress("");
      }, 3000);
    } catch (error) {
      setCurrentStep("error");
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      toast.error("Transfer failed", {
        description: errorMessage,
      });

      addNotification({
        type: "system",
        title: "Transfer Failed",
        message: errorMessage,
      });

      // Reset after delay
      setTimeout(() => {
        setCurrentStep("idle");
      }, 3000);
    }
  };

  const isProcessing = ["building", "submitting", "settling"].includes(
    currentStep
  );
  const isFinished = ["success", "error"].includes(currentStep);

  // Timeline steps
  const steps = [
    {
      id: "build",
      label: "Build",
      description: "Prepare transaction",
      active: currentStep === "building",
      completed: ["submitting", "settling", "success"].includes(currentStep),
    },
    {
      id: "submit",
      label: "Submit",
      description: "Send to chain",
      active: currentStep === "submitting",
      completed: ["settling", "success"].includes(currentStep),
    },
    {
      id: "settle",
      label: "Settle",
      description: "Cross-chain confirmation",
      active: currentStep === "settling",
      completed: currentStep === "success",
    },
  ];

  const containerVariants = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div {...containerVariants} className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Send className="w-8 h-8 text-blue-electric" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Demo <span className="text-gradient-primary">Transfer</span>
          </h1>
        </div>
        <p className="text-text-secondary text-lg max-w-3xl">
          Experience cross-chain token transfers with visual progress tracking.
          Watch the transaction flow through build → submit → settle phases.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Wallet Balances */}
        <motion.div {...containerVariants} transition={{ delay: 0.1 }}>
          <Card className="p-6 glass-surface">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-orange-primary" />
              <h2 className="text-xl font-bold">Your Balances</h2>
            </div>
            <div className="space-y-3">
              {Object.entries(balances).map(([token, balance]) => (
                <div
                  key={token}
                  className="flex justify-between items-center p-3 rounded-lg bg-surface/50 border border-border/50"
                >
                  <span className="font-semibold text-text-primary">
                    {token}
                  </span>
                  <span className="text-text-secondary">
                    {(balance as number).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Transfer Form */}
        <motion.div {...containerVariants} transition={{ delay: 0.2 }}>
          <Card className="p-6 glass-surface">
            <h2 className="text-xl font-bold mb-6">Send Tokens</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Token Selection */}
              <div>
                <Label htmlFor="token">Token</Label>
                <Select
                  value={selectedToken}
                  onValueChange={setSelectedToken}
                  disabled={isProcessing || isFinished}
                >
                  <SelectTrigger id="token" className="mt-1.5">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(balances).map((token) => (
                      <SelectItem key={token} value={token}>
                        {token} ({balances[token].toFixed(2)} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.token && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.token}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isProcessing || isFinished}
                  className="mt-1.5"
                />
                {errors.amount && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.amount}
                  </p>
                )}
              </div>

              {/* To Address */}
              <div>
                <Label htmlFor="toAddress">To Address</Label>
                <Input
                  id="toAddress"
                  placeholder="chain_a7f3d9c2e8b1..."
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  disabled={isProcessing || isFinished}
                  className="mt-1.5 font-mono text-sm"
                />
                {errors.toAddress && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.toAddress}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isProcessing || isFinished}
                className="w-full bg-gradient-to-r from-blue-electric to-purple-deep hover:opacity-90"
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
                    Processing...
                  </>
                ) : currentStep === "success" ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Success!
                  </>
                ) : currentStep === "error" ? (
                  <>
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Failed
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Tokens
                  </>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>

      {/* Timeline */}
      {(isProcessing || isFinished) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mt-8"
        >
          <Card className="p-6 glass-surface">
            <h3 className="text-lg font-semibold mb-6 text-center">
              Transaction Progress
            </h3>
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
              <motion.div
                className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-orange-primary to-blue-electric"
                initial={{ width: "0%" }}
                animate={{
                  width:
                    currentStep === "building"
                      ? "16%"
                      : currentStep === "submitting"
                      ? "50%"
                      : currentStep === "settling"
                      ? "83%"
                      : currentStep === "success"
                      ? "100%"
                      : "50%",
                }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
              />

              {/* Steps */}
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center relative z-10 flex-1"
                >
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      step.completed
                        ? "bg-gradient-to-br from-orange-primary to-blue-electric border-transparent"
                        : step.active
                        ? "bg-surface border-orange-primary"
                        : "bg-surface border-border"
                    }`}
                    animate={
                      step.active && !prefersReducedMotion
                        ? { scale: [1, 1.1, 1] }
                        : {}
                    }
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : step.active ? (
                      <Clock className="w-6 h-6 text-orange-primary" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-text-muted" />
                    )}
                  </motion.div>
                  <p className="text-sm font-semibold mt-3 text-text-primary">
                    {step.label}
                  </p>
                  <p className="text-xs text-text-muted mt-1 text-center">
                    {step.description}
                  </p>
                </div>
              ))}

              {/* Final Status */}
              <div className="flex flex-col items-center relative z-10">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    currentStep === "success"
                      ? "bg-gradient-to-br from-success via-lime-electric to-blue-electric border-transparent"
                      : currentStep === "error"
                      ? "bg-destructive border-transparent"
                      : "bg-surface border-border"
                  }`}
                >
                  {currentStep === "success" ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : currentStep === "error" ? (
                    <AlertCircle className="w-6 h-6 text-white" />
                  ) : (
                    <ArrowRight className="w-6 h-6 text-text-muted" />
                  )}
                </motion.div>
                <p className="text-sm font-semibold mt-3 text-text-primary">
                  {currentStep === "success"
                    ? "Complete"
                    : currentStep === "error"
                    ? "Failed"
                    : "Pending"}
                </p>
                <p className="text-xs text-text-muted mt-1">Final state</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Info Panel */}
      <motion.div
        {...containerVariants}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto mt-8"
      >
        <Card className="p-6 glass-surface">
          <h3 className="text-lg font-semibold mb-3 text-text-primary">
            Cross-Chain Transfer Flow
          </h3>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-electric mt-1">•</span>
              <span>
                <strong>Build:</strong> Transaction is constructed and validated
                locally
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-electric mt-1">•</span>
              <span>
                <strong>Submit:</strong> Transaction is sent to the Linera
                microchain
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-electric mt-1">•</span>
              <span>
                <strong>Settle:</strong> Cross-chain message delivers and
                balance updates
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-electric mt-1">•</span>
              <span>
                Simulated failure rate: {(failureRate * 100).toFixed(1)}% (for
                error path testing)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-electric mt-1">•</span>
              <span>Balances persist across page reloads</span>
            </li>
          </ul>
        </Card>
      </motion.div>
    </div>
  );
}
