import { useEffect } from 'react';
import { useAgoraStore } from '@/stores/useAgoraStore';
import { toast } from 'sonner';

export const useNotifications = () => {
  const { addNotification, notifications } = useAgoraStore();

  // Simulate real-time notifications (for demo purposes)
  useEffect(() => {
    const simulateNotifications = () => {
      const notificationTypes = [
        {
          type: 'bet_placed' as const,
          title: 'Bet Placed',
          message: 'Your bet on "Bitcoin reaches $100k" has been placed successfully',
        },
        {
          type: 'market_resolved' as const,
          title: 'Market Resolved',
          message: 'The market "AI solves protein folding" has been resolved',
        },
        {
          type: 'position_updated' as const,
          title: 'Position Updated',
          message: 'Your position value has increased by 12%',
        },
        {
          type: 'chain_message' as const,
          title: 'Cross-Chain Message',
          message: 'Received settlement from market chain',
        },
      ];

      const randomNotification =
        notificationTypes[Math.floor(Math.random() * notificationTypes.length)];

      addNotification(randomNotification);

      // Show toast for important notifications
      if (randomNotification.type === 'market_resolved' || randomNotification.type === 'bet_placed') {
        toast.success(randomNotification.title, {
          description: randomNotification.message,
        });
      }
    };

    // Simulate a notification every 30 seconds (only in development)
    const interval = setInterval(simulateNotifications, 30000);

    return () => clearInterval(interval);
  }, [addNotification]);

  return {
    addNotification,
    notifications,
  };
};
