import { motion } from "framer-motion";
import { Bell, TrendingUp, CheckCircle2, Activity, AlertCircle } from "lucide-react";
import { Notification } from "@/stores/useAgoraStore";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

export const NotificationItem = ({ notification, onClick }: NotificationItemProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'bet_placed':
        return TrendingUp;
      case 'market_resolved':
        return CheckCircle2;
      case 'position_updated':
        return Activity;
      case 'chain_message':
        return Bell;
      default:
        return AlertCircle;
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case 'bet_placed':
        return "text-orange-primary";
      case 'market_resolved':
        return "text-success";
      case 'position_updated':
        return "text-blue-electric";
      case 'chain_message':
        return "text-purple-deep";
      default:
        return "text-text-muted";
    }
  };

  const Icon = getIcon();
  const iconColor = getIconColor();

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ x: -4 }}
      onClick={onClick}
      className={cn(
        "flex gap-3 p-3 rounded-lg border cursor-pointer transition-all",
        notification.read
          ? "bg-surface border-border/50"
          : "bg-surface-elevated border-orange-primary/30 shadow-sm"
      )}
    >
      <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", 
        notification.read ? "bg-surface-elevated" : "bg-orange-primary/10"
      )}>
        <Icon className={cn("w-4 h-4", notification.read ? "text-text-muted" : iconColor)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className={cn(
            "text-sm font-semibold truncate",
            notification.read ? "text-text-secondary" : "text-text-primary"
          )}>
            {notification.title}
          </h4>
          {!notification.read && (
            <div className="w-2 h-2 rounded-full bg-orange-primary flex-shrink-0 mt-1" />
          )}
        </div>

        <p className="text-xs text-text-muted mb-2 line-clamp-2">
          {notification.message}
        </p>

        <span className="text-[10px] text-text-muted">
          {formatTimestamp(notification.timestamp)}
        </span>
      </div>
    </motion.div>
  );
};
