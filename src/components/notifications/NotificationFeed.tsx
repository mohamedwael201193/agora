import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./NotificationItem";
import { useAgoraStore } from "@/stores/useAgoraStore";

export const NotificationFeed = () => {
  const {
    notifications,
    unreadCount,
    showNotificationFeed,
    toggleNotificationFeed,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useAgoraStore();

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showNotificationFeed) {
        toggleNotificationFeed();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showNotificationFeed, toggleNotificationFeed]);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {showNotificationFeed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleNotificationFeed}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {showNotificationFeed && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-bg-secondary border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-text-primary">Notifications</h2>
                {unreadCount > 0 && (
                  <p className="text-xs text-text-muted">
                    {unreadCount} unread
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleNotificationFeed}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="flex gap-2 p-3 border-b border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllNotificationsRead}
                  disabled={unreadCount === 0}
                  className="text-xs h-8"
                >
                  <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
                  Mark all read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearNotifications}
                  className="text-xs h-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Clear all
                </Button>
              </div>
            )}

            {/* Notification List */}
            <ScrollArea className="flex-1 p-3">
              {notifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
                    <CheckCheck className="w-8 h-8 text-text-muted" />
                  </div>
                  <p className="text-text-muted">All caught up!</p>
                  <p className="text-xs text-text-muted mt-1">No new notifications</p>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onClick={() => markNotificationRead(notification.id)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
