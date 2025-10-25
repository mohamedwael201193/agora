import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAgoraStore } from "@/stores/useAgoraStore";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, RotateCcw, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Counter() {
  const {
    counterValue,
    incrementCounter,
    decrementCounter,
    resetCounter,
    latency,
    addNotification,
    updateLatency,
  } = useAgoraStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Simulate latency and emit notification
  const handleAction = async (
    action: () => void,
    actionName: string,
    newValue: number
  ) => {
    setIsProcessing(true);

    // Record start time for end-to-end metric
    const startTime = Date.now();

    // Simulate mutation latency
    await new Promise((resolve) => setTimeout(resolve, latency.mutation));

    // Execute action
    action();

    // Simulate notification latency
    const notificationDelay = latency.notification;
    setTimeout(() => {
      addNotification({
        type: "system",
        title: `Counter ${actionName}`,
        message: `Counter value updated to ${newValue}`,
      });

      // Calculate end-to-end latency
      const endToEndTime = Date.now() - startTime;
      updateLatency({ endToEnd: endToEndTime });

      toast.success(`Counter ${actionName.toLowerCase()}`, {
        description: `New value: ${newValue}`,
      });
    }, notificationDelay);

    setIsProcessing(false);
  };

  const handleIncrement = () => {
    handleAction(incrementCounter, "Incremented", counterValue + 1);
  };

  const handleDecrement = () => {
    handleAction(decrementCounter, "Decremented", counterValue - 1);
  };

  const handleReset = () => {
    handleAction(resetCounter, "Reset", 0);
  };

  // Animation variants - respect reduced motion
  const containerVariants = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };

  const counterVariants = prefersReducedMotion
    ? {}
    : {
        initial: { scale: 1 },
        animate: { scale: 1 },
        tap: { scale: 0.95 },
      };

  const valueVariants = prefersReducedMotion
    ? {}
    : {
        key: counterValue,
        initial: { scale: 1.2, opacity: 0.5 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.2 },
      };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div {...containerVariants} className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-8 h-8 text-orange-primary" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Demo <span className="text-gradient-primary">Counter</span>
          </h1>
        </div>
        <p className="text-text-secondary text-lg max-w-3xl">
          Experience Linera's sub-second finality with a simulated latency
          counter. Watch the real-time HUD update as each action flows through
          the microchain.
        </p>
      </motion.div>

      {/* Counter Card */}
      <motion.div
        {...containerVariants}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-8 md:p-12 glass-surface text-center">
          {/* Latency Indicator */}
          <div className="flex justify-center gap-2 mb-6">
            <Badge variant="outline" className="text-xs">
              Mutation: {latency.mutation}ms
            </Badge>
            <Badge variant="outline" className="text-xs">
              Notification: {latency.notification}ms
            </Badge>
          </div>

          {/* Counter Display */}
          <div className="mb-8">
            <p className="text-text-muted text-sm uppercase tracking-wider mb-2">
              Current Value
            </p>
            <motion.div
              {...valueVariants}
              className="text-8xl md:text-9xl font-bold text-gradient-primary"
            >
              {counterValue}
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
            <motion.div {...counterVariants}>
              <Button
                size="lg"
                onClick={handleDecrement}
                disabled={isProcessing}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-deep to-blue-electric hover:opacity-90 disabled:opacity-50"
              >
                <Minus className="w-5 h-5 mr-2" />
                Decrement
              </Button>
            </motion.div>

            <motion.div {...counterVariants}>
              <Button
                size="lg"
                onClick={handleIncrement}
                disabled={isProcessing}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-primary to-blue-electric hover:opacity-90 disabled:opacity-50"
              >
                <Plus className="w-5 h-5 mr-2" />
                Increment
              </Button>
            </motion.div>

            <motion.div {...counterVariants}>
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                disabled={isProcessing}
                className="w-full sm:w-auto border-orange-primary/50 hover:bg-orange-primary/10 disabled:opacity-50"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </motion.div>
          </div>

          {/* Status Indicator */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-text-muted text-sm flex items-center justify-center gap-2"
            >
              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-orange-primary border-t-transparent rounded-full"
              />
              Processing on microchain...
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Info Panel */}
      <motion.div
        {...containerVariants}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto mt-8"
      >
        <Card className="p-6 glass-surface">
          <h3 className="text-lg font-semibold mb-3 text-text-primary">
            How it works
          </h3>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-primary mt-1">•</span>
              <span>
                Each action simulates a mutation with configurable latency
                (default: {latency.mutation}ms)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-primary mt-1">•</span>
              <span>
                Notifications are pushed after a simulated delay (default:{" "}
                {latency.notification}ms)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-primary mt-1">•</span>
              <span>
                The Real-Time HUD tracks end-to-end latency and updates live
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-primary mt-1">•</span>
              <span>
                Counter value persists across page reloads using Zustand
                persistence
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-primary mt-1">•</span>
              <span>
                Open Developer Settings to toggle latency jitter and observe
                performance variations
              </span>
            </li>
          </ul>
        </Card>
      </motion.div>
    </div>
  );
}
