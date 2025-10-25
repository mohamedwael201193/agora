import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useAgoraStore } from "@/stores/useAgoraStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Download,
  Eye,
  Radio,
  Settings,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Validation schema for imported state
const importSchema = z.object({
  counterValue: z.number().optional(),
  balances: z.record(z.number()).optional(),
  userPositions: z.array(z.any()).optional(),
  transport: z
    .object({
      mode: z.enum(["mock", "local-replica", "custom"]),
      faucetUrl: z.string(),
      validatorUrl: z.string(),
    })
    .optional(),
});

export const DeveloperDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const store = useAgoraStore();
  const {
    transport,
    showPerformanceMetrics,
    latency,
    setTransport,
    togglePerformanceMetrics,
    updateLatency,
  } = store;

  const toggleDrawer = () => setIsOpen(!isOpen);

  const handleTransportChange = (mode: "mock" | "local-replica" | "custom") => {
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
    toast.info("Latency jitter applied");
  };

  const handleExport = () => {
    try {
      const state = useAgoraStore.getState();
      const exportData = {
        counterValue: state.counterValue,
        balances: state.balances,
        userPositions: state.userPositions,
        transport: state.transport,
        exportedAt: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `agora-state-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("State exported successfully", {
        description: "JSON file downloaded",
      });
    } catch (error) {
      toast.error("Export failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Validate with Zod
        const validated = importSchema.parse(data);

        // Merge validated data with current state
        const currentState = useAgoraStore.getState();
        const updates: Partial<typeof currentState> = {};

        if (validated.counterValue !== undefined)
          updates.counterValue = validated.counterValue;
        if (validated.balances) updates.balances = validated.balances;
        if (validated.userPositions)
          updates.userPositions = validated.userPositions;
        if (validated.transport)
          updates.transport = {
            ...currentState.transport,
            ...validated.transport,
          };

        useAgoraStore.setState(updates);

        toast.success("State imported successfully", {
          description: "Your data has been restored",
        });

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast.error("Invalid state file", {
            description: `Validation failed: ${error.errors[0].message}`,
          });
        } else if (error instanceof SyntaxError) {
          toast.error("Invalid JSON file", {
            description: "File must be valid JSON",
          });
        } else {
          toast.error("Import failed", {
            description:
              error instanceof Error ? error.message : "Unknown error",
          });
        }

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.readAsText(file);
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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-bg-secondary border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-primary" />
                <h2 className="text-lg font-bold text-text-primary">
                  Developer Settings
                </h2>
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
                    <Label className="text-sm font-semibold">
                      Transport Mode
                    </Label>
                  </div>
                  <div className="space-y-2">
                    {(["mock", "local-replica", "custom"] as const).map(
                      (mode) => (
                        <button
                          key={mode}
                          onClick={() => handleTransportChange(mode)}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            transport.mode === mode
                              ? "bg-orange-primary/10 border-orange-primary/50 text-text-primary"
                              : "bg-surface border-border hover:border-border text-text-secondary"
                          }`}
                        >
                          <div className="font-medium capitalize">
                            {mode.replace("-", " ")}
                          </div>
                          <div className="text-xs text-text-muted mt-1">
                            {mode === "mock" && "Simulated responses for demo"}
                            {mode === "local-replica" &&
                              "Connect to local Linera node"}
                            {mode === "custom" &&
                              "Custom endpoint configuration"}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Faucet URL Override */}
                <div className="space-y-2">
                  <Label className="text-sm">Faucet URL</Label>
                  <Input
                    value={transport.faucetUrl}
                    onChange={(e) =>
                      setTransport({ faucetUrl: e.target.value })
                    }
                    placeholder="https://faucet.devnet.linera.net"
                    className="bg-surface"
                  />
                </div>

                {/* Validator URL Override */}
                <div className="space-y-2">
                  <Label className="text-sm">Validator URL</Label>
                  <Input
                    value={transport.validatorUrl}
                    onChange={(e) =>
                      setTransport({ validatorUrl: e.target.value })
                    }
                    placeholder="https://validator.devnet.linera.net"
                    className="bg-surface"
                  />
                </div>

                {/* Display Options */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-deep" />
                    <Label className="text-sm font-semibold">
                      Display Options
                    </Label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div>
                      <div className="text-sm font-medium">
                        Performance Metrics
                      </div>
                      <div className="text-xs text-text-muted">
                        Show real-time HUD
                      </div>
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
                    <Label className="text-sm font-semibold">
                      Stress Testing
                    </Label>
                  </div>

                  <Button
                    variant="outline"
                    onClick={simulateLatencyJitter}
                    className="w-full"
                  >
                    Simulate Latency Jitter
                  </Button>

                  <div className="p-3 bg-surface rounded-lg space-y-2">
                    <div className="text-xs font-medium text-text-muted">
                      Current Metrics
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold text-success">
                          {latency.mutation}ms
                        </div>
                        <div className="text-[10px] text-text-muted">
                          Mutation
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-electric">
                          {latency.notification}ms
                        </div>
                        <div className="text-[10px] text-text-muted">
                          Notification
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-primary">
                          {latency.endToEnd}ms
                        </div>
                        <div className="text-[10px] text-text-muted">
                          End-to-End
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Import/Export */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-purple-deep" />
                    <Label className="text-sm font-semibold">
                      State Management
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={handleExport}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export State JSON
                    </Button>

                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                        id="import-file"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Import State JSON
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-deep/5 border border-purple-deep/20 rounded-lg">
                    <p className="text-xs text-text-secondary">
                      Export your state (balances, positions, settings) to JSON
                      or import from a previously saved file.
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 bg-blue-electric/5 border border-blue-electric/20 rounded-lg">
                  <p className="text-xs text-text-secondary">
                    These settings are for development and testing purposes.
                    Changes will persist across sessions.
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
