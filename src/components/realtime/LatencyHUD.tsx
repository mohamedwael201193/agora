import { motion } from "framer-motion";
import { Activity, Zap, Bell, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface LatencyHUDProps {
  mutation: number;
  notification: number;
  endToEnd: number;
  target?: number;
  className?: string;
}

export const LatencyHUD = ({
  mutation,
  notification,
  endToEnd,
  target = 500,
  className,
}: LatencyHUDProps) => {
  const getLatencyColor = (value: number) => {
    if (value < target * 0.5) return "text-success";
    if (value < target * 0.8) return "text-orange-primary";
    return "text-destructive";
  };

  const metrics = [
    {
      icon: Zap,
      label: "Mutation",
      value: mutation,
      color: getLatencyColor(mutation),
    },
    {
      icon: Bell,
      label: "Notification",
      value: notification,
      color: getLatencyColor(notification),
    },
    {
      icon: TrendingUp,
      label: "End-to-End",
      value: endToEnd,
      color: getLatencyColor(endToEnd),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={cn("glass-surface border border-border rounded-lg p-3", className)}
    >
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4 text-blue-electric" />
        <span className="text-xs font-semibold text-text-primary">Latency</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="flex flex-col items-center"
            >
              <Icon className={cn("w-3.5 h-3.5 mb-1", metric.color)} />
              <span className={cn("text-sm font-bold", metric.color)}>
                {metric.value}ms
              </span>
              <span className="text-[10px] text-text-muted">{metric.label}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-2 pt-2 border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-muted">Target</span>
          <span className="text-[10px] font-semibold text-text-secondary">
            {'<'}{target}ms
          </span>
        </div>
      </div>
    </motion.div>
  );
};
