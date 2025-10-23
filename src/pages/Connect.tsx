import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Connect() {
  const [chainId, setChainId] = useState("");
  const [copied, setCopied] = useState(false);

  const handleClaim = () => {
    const mockChainId = `chain_${Math.random().toString(36).substring(7)}`;
    setChainId(mockChainId);
    toast.success("Personal chain claimed successfully!");
  };

  const copyChainId = () => {
    navigator.clipboard.writeText(chainId);
    setCopied(true);
    toast.success("Chain ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Claim Your <span className="text-gradient-primary">Personal Chain</span>
          </h1>
          <p className="text-text-secondary text-lg">
            Get started on Linera with your own microchain. No gas fees, instant finality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Faucet Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 glass-surface">
              <h2 className="text-2xl font-bold mb-4">Faucet</h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Faucet URL</Label>
                  <Input 
                    readOnly 
                    value="https://faucet.devnet.linera.net"
                    className="bg-surface"
                  />
                </div>

                <div>
                  <Label>Validator Endpoint</Label>
                  <Input 
                    readOnly 
                    value="https://validator.devnet.linera.net"
                    className="bg-surface"
                  />
                </div>

                <Button 
                  onClick={handleClaim}
                  className="w-full bg-gradient-to-r from-orange-primary to-blue-electric hover:opacity-90"
                  size="lg"
                >
                  Claim Personal Chain
                </Button>

                {chainId && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-success/10 border border-success/30 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-success">Your Chain ID</Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyChainId}
                        className="h-8 w-8 p-0"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <code className="text-sm font-mono break-all">{chainId}</code>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 glass-surface h-full">
              <h2 className="text-2xl font-bold mb-4">What is a Personal Chain?</h2>
              
              <div className="space-y-4 text-text-secondary">
                <p>
                  In Linera, each user has their own personal microchain. This revolutionary 
                  architecture provides:
                </p>
                
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-primary mt-1">•</span>
                    <span><strong className="text-text-primary">No Gas Fees:</strong> Your chain, your rules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-electric mt-1">•</span>
                    <span><strong className="text-text-primary">Instant Finality:</strong> Sub-second block confirmation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-deep mt-1">•</span>
                    <span><strong className="text-text-primary">Cross-Chain Messaging:</strong> Seamless interaction with app chains</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-bright mt-1">•</span>
                    <span><strong className="text-text-primary">Elastic Scaling:</strong> Automatic resource allocation</span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-border/50">
                  <a 
                    href="#" 
                    className="flex items-center gap-2 text-orange-primary hover:text-orange-secondary transition-colors"
                  >
                    Learn more about microchains
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Start Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="p-6 glass-surface">
            <h3 className="text-xl font-bold mb-4">Next Steps</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-surface-elevated rounded-lg">
                <div className="text-2xl mb-2">1️⃣</div>
                <h4 className="font-semibold mb-1">Explore Markets</h4>
                <p className="text-sm text-text-muted">Browse prediction markets and place your first bet</p>
              </div>
              <div className="p-4 bg-surface-elevated rounded-lg">
                <div className="text-2xl mb-2">2️⃣</div>
                <h4 className="font-semibold mb-1">Try Chrono-Echoes</h4>
                <p className="text-sm text-text-muted">Experience time-based betting with instant resolution</p>
              </div>
              <div className="p-4 bg-surface-elevated rounded-lg">
                <div className="text-2xl mb-2">3️⃣</div>
                <h4 className="font-semibold mb-1">Build Markets</h4>
                <p className="text-sm text-text-muted">Use Foundry to create your own prediction markets</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
