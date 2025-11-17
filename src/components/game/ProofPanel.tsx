import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  copyToClipboard,
  formatChainId,
  lineraClient,
  type ChainConfig,
  type LineraClientState,
} from "@/services/lineraClient";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Copy,
  Database,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ProofPanelProps {
  className?: string;
  compact?: boolean;
}

export const ProofPanel = ({
  className = "",
  compact = false,
}: ProofPanelProps) => {
  const [state, setState] = useState<
    LineraClientState & { config: ChainConfig }
  >();
  const { toast } = useToast();

  useEffect(() => {
    const updateState = () => {
      setState(lineraClient.getState());
    };

    updateState();
    const interval = setInterval(updateState, 2000); // Update every 2s

    return () => clearInterval(interval);
  }, []);

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    toast({
      title: success ? "Copied!" : "Copy failed",
      description: success
        ? `${label} copied to clipboard`
        : "Please copy manually",
      variant: success ? "default" : "destructive",
    });
  };

  const handleTestConnection = async () => {
    toast({
      title: "Testing Connection...",
      description: "Pinging Conway testnet",
    });

    const connected = await lineraClient.testConnection();

    toast({
      title: connected ? "Connection Successful" : "Connection Failed",
      description: connected
        ? "Conway testnet is responding"
        : "Falling back to simulation mode",
      variant: connected ? "default" : "destructive",
    });
  };

  const getModeIcon = () => {
    if (!state) return <Clock className="w-4 h-4" />;

    switch (state.mode) {
      case "live":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "sim":
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <Clock className="w-4 h-4 text-text-muted" />;
    }
  };

  const getModeColor = () => {
    if (!state) return "secondary";
    return state.mode === "live" ? "default" : "secondary";
  };

  if (!state) {
    return (
      <Card
        className={`p-4 glass-surface border-blue-electric/30 ${className}`}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse text-blue-electric" />
          <span className="text-sm font-medium">
            Initializing Linera client...
          </span>
        </div>
      </Card>
    );
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 ${className}`}
      >
        <Badge variant={getModeColor()} className="flex items-center gap-1">
          {getModeIcon()}
          {state.mode === "live" ? "Live (Conway)" : "Sim Mode"}
        </Badge>
        {state.eventCount > 0 && (
          <Badge variant="outline" className="text-xs">
            {state.eventCount} rounds
          </Badge>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-6 glass-surface border-blue-electric/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-electric/10 to-transparent" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-electric/20 flex items-center justify-center">
                <Database className="w-4 h-4 text-blue-electric" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  Linera Integration Proof
                </h3>
                <p className="text-sm text-text-muted">
                  Conway Testnet • Judge Verification Panel
                </p>
              </div>
            </div>

            <Badge variant={getModeColor()} className="flex items-center gap-1">
              {getModeIcon()}
              {state.mode === "live" ? "Live Mode" : "Simulation Mode"}
            </Badge>
          </div>

          {/* Network Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">
                  Network
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-sm">
                    {state.config.networkName}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleTestConnection}
                    className="h-6 px-2 text-xs"
                  >
                    Test
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">
                  Chain ID
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm bg-surface px-2 py-1 rounded font-mono">
                    {formatChainId(state.config.chainId)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(state.config.chainId, "Chain ID")}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">
                  Application ID
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm bg-surface px-2 py-1 rounded font-mono">
                    {formatChainId(state.config.applicationId)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopy(state.config.applicationId, "App ID")
                    }
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">
                  Events Recorded
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold text-lg text-orange-primary">
                    {state.eventCount}
                  </span>
                  <span className="text-sm text-text-muted">game rounds</span>
                </div>
              </div>

              {state.lastEventTimestamp && (
                <div>
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wide">
                    Last Event
                  </label>
                  <div className="text-sm mt-1">
                    {new Date(state.lastEventTimestamp).toLocaleString()}
                  </div>
                </div>
              )}

              {state.lastError && (
                <div>
                  <label className="text-xs font-medium text-destructive uppercase tracking-wide">
                    Last Error
                  </label>
                  <div className="text-sm text-destructive mt-1">
                    {state.lastError}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* GraphQL Section */}
          <div className="border-t border-border/50 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">GraphQL Query Example</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleCopy(lineraClient.getSampleQuery(), "GraphQL Query")
                  }
                  className="h-7 text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy Query
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-7 text-xs"
                >
                  <a
                    href={lineraClient.getGraphQLPlaygroundURL()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Try Live
                  </a>
                </Button>
              </div>
            </div>

            <pre className="text-xs bg-surface p-3 rounded-md border overflow-x-auto">
              <code>{lineraClient.getSampleQuery()}</code>
            </pre>
          </div>

          {/* Judge Instructions */}
          <div className="mt-4 p-3 bg-orange-primary/5 border border-orange-primary/20 rounded-md">
            <div className="flex items-start gap-2">
              <LinkIcon className="w-4 h-4 text-orange-primary mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-sm mb-1">
                  For Judges: Verification Steps
                </h5>
                <ol className="text-xs text-text-muted space-y-1 list-decimal list-inside">
                  <li>Play a game round to trigger on-chain write</li>
                  <li>Check "On-Chain Log" section below for new entries</li>
                  <li>Copy Chain/App IDs and test GraphQL query</li>
                  <li>Verify receipts show sub-second Linera finality</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
