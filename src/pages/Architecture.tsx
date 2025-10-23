import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Layers, Zap, Shield, User, Clock, ArrowRightLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const architectureFeatures = [
  {
    icon: Layers,
    title: "Microchain Architecture",
    description: "Personal chains for users, app chains for applications, and temporary chains for atomic operations.",
    color: "orange",
  },
  {
    icon: Zap,
    title: "Sub-Second Finality",
    description: "Block confirmation in <300ms with elastic scaling and no gas auctions.",
    color: "blue",
  },
  {
    icon: Network,
    title: "Cross-Chain Messaging",
    description: "Native asynchronous messages between chains with guaranteed delivery.",
    color: "purple",
  },
  {
    icon: Shield,
    title: "Trustless Browser Client",
    description: "Full node in the browser with cryptographic verification of all operations.",
    color: "cyan",
  },
];

const designPatterns = [
  {
    title: "Personal Chain Pattern",
    description: "Each user owns their microchain with full control over block production",
    steps: [
      "User initiates action on personal chain",
      "Block created with <300ms latency",
      "Cross-chain message sent to app chain",
      "App chain processes and responds",
    ],
  },
  {
    title: "Oracle Integration Pattern",
    description: "Validators attest to external events with cryptographic proofs",
    steps: [
      "Oracle service monitors external data",
      "Validator signs attestation",
      "Attestation posted to app chain",
      "Smart contract resolves market",
    ],
  },
  {
    title: "Atomic Swap Pattern",
    description: "Temporary chains enable complex multi-party transactions",
    steps: [
      "Temporary chain created for swap",
      "All parties lock assets",
      "Atomic execution or rollback",
      "Temporary chain closes",
    ],
  },
  {
    title: "Real-Time Update Pattern",
    description: "Push notifications deliver instant updates to users",
    steps: [
      "Market event occurs on app chain",
      "Notification service triggered",
      "Push message to user chains",
      "UI updates in real-time",
    ],
  },
];

export default function Architecture() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Badge className="mb-4 bg-blue-electric/20 text-blue-electric border-blue-electric/30">
          <Network className="w-3 h-3 mr-1" />
          Technical Deep Dive
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          System <span className="text-gradient-primary">Architecture</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Understanding how Agora leverages Linera's microchain architecture for 
          real-time, trustless prediction markets.
        </p>
      </motion.div>

      {/* Core Features */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {architectureFeatures.map((feature, index) => {
          const Icon = feature.icon;
          const colorMap = {
            orange: "orange-primary",
            blue: "blue-electric",
            purple: "purple-deep",
            cyan: "cyan-bright",
          };
          const color = colorMap[feature.color as keyof typeof colorMap];

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 glass-surface h-full hover:border-orange-primary/50 transition-all">
                <div className={`w-12 h-12 rounded-lg bg-${color}/20 flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 text-${color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Design Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Design Patterns</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {designPatterns.map((pattern, index) => (
            <Card key={pattern.title} className="p-6 glass-surface">
              <h3 className="text-xl font-bold mb-2">{pattern.title}</h3>
              <p className="text-text-secondary text-sm mb-4">{pattern.description}</p>
              
              <div className="space-y-3">
                {pattern.steps.map((step, stepIndex) => (
                  <motion.div
                    key={stepIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1) + (stepIndex * 0.05) }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-orange-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-orange-primary">{stepIndex + 1}</span>
                    </div>
                    <p className="text-sm text-text-secondary">{step}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* System Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-8 glass-surface">
          <h2 className="text-2xl font-bold mb-6 text-center">Real-Time Market Flow</h2>
          
          <div className="relative">
            {/* Flow diagram */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-6 bg-surface-elevated rounded-lg border border-orange-primary/30">
                <div className="w-12 h-12 rounded-full bg-orange-primary/20 flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-orange-primary" />
                </div>
                <h4 className="font-semibold text-center mb-2">User Action</h4>
                <p className="text-xs text-text-muted text-center">
                  Place bet on personal chain
                </p>
              </div>

              <div className="p-6 bg-surface-elevated rounded-lg border border-blue-electric/30">
                <div className="w-12 h-12 rounded-full bg-blue-electric/20 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-electric" />
                </div>
                <h4 className="font-semibold text-center mb-2">Block Creation</h4>
                <p className="text-xs text-text-muted text-center">
                  &lt;300ms confirmation
                </p>
              </div>

              <div className="p-6 bg-surface-elevated rounded-lg border border-purple-deep/30">
                <div className="w-12 h-12 rounded-full bg-purple-deep/20 flex items-center justify-center mx-auto mb-3">
                  <ArrowRightLeft className="w-6 h-6 text-purple-deep" />
                </div>
                <h4 className="font-semibold text-center mb-2">Cross-Chain</h4>
                <p className="text-xs text-text-muted text-center">
                  Message to market chain
                </p>
              </div>

              <div className="p-6 bg-surface-elevated rounded-lg border border-cyan-bright/30">
                <div className="w-12 h-12 rounded-full bg-cyan-bright/20 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-cyan-bright" />
                </div>
                <h4 className="font-semibold text-center mb-2">UI Update</h4>
                <p className="text-xs text-text-muted text-center">
                  Push notification sent
                </p>
              </div>
            </div>

            {/* Connection arrows (hidden on mobile) */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-primary via-blue-electric to-cyan-bright -z-10" />
          </div>

          <div className="mt-8 p-4 bg-success/10 border border-success/30 rounded-lg">
            <p className="text-sm text-center">
              <strong className="text-success">Total Latency:</strong> User action to UI update in &lt;500ms
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-12"
      >
        <Card className="p-6 glass-surface">
          <h3 className="text-xl font-bold mb-4">Technology Stack</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-orange-primary">Frontend</h4>
              <ul className="text-sm text-text-muted space-y-1">
                <li>• React 18 + TypeScript</li>
                <li>• Vite build system</li>
                <li>• Tailwind CSS + Framer Motion</li>
                <li>• Linera GraphQL client</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-blue-electric">Blockchain</h4>
              <ul className="text-sm text-text-muted space-y-1">
                <li>• Linera microchains</li>
                <li>• WebAssembly contracts</li>
                <li>• Byzantine consensus</li>
                <li>• Cross-chain messaging</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-purple-deep">Infrastructure</h4>
              <ul className="text-sm text-text-muted space-y-1">
                <li>• Validator network</li>
                <li>• Oracle services</li>
                <li>• Push notification system</li>
                <li>• IPFS for metadata</li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
