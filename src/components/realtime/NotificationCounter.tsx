import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationCounterProps {
  count: number;
  hasNew?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NotificationCounter = ({
  count,
  hasNew = false,
  onClick,
  className,
}: NotificationCounterProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 px-3 py-1.5 rounded-full glass-surface border border-border hover:border-orange-primary/50 transition-all cursor-pointer",
        className
      )}
    >
      <Bell className={cn("w-4 h-4", hasNew ? "text-orange-primary" : "text-text-secondary")} />
      
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-orange-primary flex items-center justify-center"
          >
            <motion.span
              key={count}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-[10px] font-bold text-white px-1"
            >
              {count > 99 ? '99+' : count}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {hasNew && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-2 h-2 rounded-full bg-orange-primary animate-pulse"
        />
      )}
    </motion.button>
  );
};
