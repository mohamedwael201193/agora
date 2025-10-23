import { motion } from "framer-motion";
import { Link as LinkIcon, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChainPillProps {
  chainId: string | null;
  status: 'connected' | 'disconnected' | 'connecting';
  className?: string;
}

export const ChainPill = ({ chainId, status, className }: ChainPillProps) => {
  const statusConfig = {
    connected: {
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/30",
      label: "Connected",
    },
    disconnected: {
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/30",
      label: "Disconnected",
    },
    connecting: {
      icon: LinkIcon,
      color: "text-orange-primary",
      bgColor: "bg-orange-primary/10",
      borderColor: "border-orange-primary/30",
      label: "Connecting",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full glass-surface border",
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <Icon 
        className={cn("w-3.5 h-3.5", config.color, status === 'connecting' && "animate-pulse")} 
      />
      <span className="text-xs font-medium text-text-primary">
        {chainId ? `${chainId.slice(0, 8)}...` : config.label}
      </span>
    </motion.div>
  );
};
