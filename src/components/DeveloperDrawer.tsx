import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Radio, Activity, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgoraStore } from "@/stores/useAgoraStore";
import { toast } from "sonner";

export const DeveloperDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    transport,
    showPerformanceMetrics,
    latency,
    setTransport,
    togglePerformanceMetrics,
    updateLatency,
  } = useAgoraStore();

  const toggleDrawer = () => setIsOpen(!isOpen);

  const handleTransportChange = (mode: 'mock' | 'local-replica' | 'custom') => {
    setTransport({ mode });
    toast.success(`Transport mode set to: ${mode}`);
  };

  const simulateLatencyJitter = () => {
    const jitter = () => Math.floor(Math.random() * 200) + 50;
    updateLatency({
      mutation: jitter(),
      notification: jitter(),
      endToEnd: jitter() + jitter(),
    });
    toast.info('Latency jitter applied');
  };

  return (
    <>
      {/* Settings Icon Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDrawer}
        className="relative"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleDrawer}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-bg-secondary border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-primary" />
                <h2 className="text-lg font-bold text-text-primary">Developer Settings</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDrawer}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {/* Transport Mode */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-blue-electric" />
                    <Label className="text-sm font-semibold">Transport Mode</Label>
                  </div>
                  <div className="space-y-2">
                    {(['mock', 'local-replica', 'custom'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => handleTransportChange(mode)}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          transport.mode === mode
                            ? 'bg-orange-primary/10 border-orange-primary/50 text-text-primary'
                            : 'bg-surface border-border hover:border-border text-text-secondary'
                        }`}
                      >
                        <div className="font-medium capitalize">{mode.replace('-', ' ')}</div>
                        <div className="text-xs text-text-muted mt-1">
                          {mode === 'mock' && 'Simulated responses for demo'}
                          {mode === 'local-replica' && 'Connect to local Linera node'}
                          {mode === 'custom' && 'Custom endpoint configuration'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Faucet URL Override */}
                <div className="space-y-2">
                  <Label className="text-sm">Faucet URL</Label>
                  <Input
                    value={transport.faucetUrl}
                    onChange={(e) => setTransport({ faucetUrl: e.target.value })}
                    placeholder="https://faucet.devnet.linera.net"
                    className="bg-surface"
                  />
                </div>

                {/* Validator URL Override */}
                <div className="space-y-2">
                  <Label className="text-sm">Validator URL</Label>
                  <Input
                    value={transport.validatorUrl}
                    onChange={(e) => setTransport({ validatorUrl: e.target.value })}
                    placeholder="https://validator.devnet.linera.net"
                    className="bg-surface"
                  />
                </div>

                {/* Display Options */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-deep" />
                    <Label className="text-sm font-semibold">Display Options</Label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div>
                      <div className="text-sm font-medium">Performance Metrics</div>
                      <div className="text-xs text-text-muted">Show real-time HUD</div>
                    </div>
                    <Switch
                      checked={showPerformanceMetrics}
                      onCheckedChange={togglePerformanceMetrics}
                    />
                  </div>
                </div>

                {/* Stress Testing */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-bright" />
                    <Label className="text-sm font-semibold">Stress Testing</Label>
                  </div>

                  <Button
                    variant="outline"
                    onClick={simulateLatencyJitter}
                    className="w-full"
                  >
                    Simulate Latency Jitter
                  </Button>

                  <div className="p-3 bg-surface rounded-lg space-y-2">
                    <div className="text-xs font-medium text-text-muted">Current Metrics</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-success">{latency.mutation}ms</div>
                        <div className="text-[10px] text-text-muted">Mutation</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-electric">{latency.notification}ms</div>
                        <div className="text-[10px] text-text-muted">Notification</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-primary">{latency.endToEnd}ms</div>
                        <div className="text-[10px] text-text-muted">End-to-End</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 bg-blue-electric/5 border border-blue-electric/20 rounded-lg">
                  <p className="text-xs text-text-secondary">
                    These settings are for development and testing purposes. Changes will persist
                    across sessions.
                  </p>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
