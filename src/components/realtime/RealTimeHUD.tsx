import { motion } from "framer-motion";
import { ChainPill } from "./ChainPill";
import { LatencyHUD } from "./LatencyHUD";
import { NotificationCounter } from "./NotificationCounter";
import { useAgoraStore } from "@/stores/useAgoraStore";
import { cn } from "@/lib/utils";

interface RealTimeHUDProps {
  className?: string;
}

export const RealTimeHUD = ({ className }: RealTimeHUDProps) => {
  const {
    chainId,
    isConnected,
    latency,
    unreadCount,
    toggleNotificationFeed,
    showPerformanceMetrics,
  } = useAgoraStore();

  const status = isConnected ? 'connected' : 'disconnected';

  if (!showPerformanceMetrics) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("flex flex-col gap-2", className)}
    >
      <ChainPill chainId={chainId} status={status} />
      
      <LatencyHUD
        mutation={latency.mutation}
        notification={latency.notification}
        endToEnd={latency.endToEnd}
      />
      
      <NotificationCounter
        count={unreadCount}
        hasNew={unreadCount > 0}
        onClick={toggleNotificationFeed}
      />
    </motion.div>
  );
};
