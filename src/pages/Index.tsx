import heroBackground from "@/assets/hero-bg.jpg";
import { StatChip } from "@/components/common/StatChip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Network, Shield, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBackground}
            alt="Abstract microchain network with flowing particles"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/50 via-bg-primary/80 to-bg-primary" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-orange-primary/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-amber-500/20 text-amber-400 border-amber-500/30 text-base px-4 py-2">
              Wave 1 Demo
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Don't be late.
              <br />
              <span className="text-gradient-primary">Be real-time.</span>
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary mb-4 max-w-3xl mx-auto">
              Build prediction markets, games, and agentic apps on Linera
              microchains with sub-second finality.
            </p>

            <p className="text-base text-text-muted mb-8 max-w-2xl mx-auto">
              This Wave 1 demo uses simulated data to showcase the user
              experience. No on‑chain state is created. Testnet integration
              launches in Wave 2.
            </p>

            {/* Stats Strip with Tooltips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 mb-12"
            >
              <StatChip
                icon={Clock}
                label="Target block finality: <300 ms"
                tooltip="Simulated in Wave 1. Real block times will be measured on testnet in Wave 2."
              />
              <StatChip
                icon={Shield}
                label="Browser light client: Planned"
                tooltip="Wave 3+ will enable trustless browser-based chain verification."
              />
              <StatChip
                icon={Network}
                label="Push notifications: Planned"
                tooltip="Wave 4+ will deliver native GraphQL subscriptions for real-time updates."
              />
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/game/confidence">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-primary to-orange-secondary hover:opacity-90 text-lg px-8"
                >
                  Try Confidence Flip
                  <Target className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/architecture">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-electric/50 text-blue-electric hover:bg-blue-electric/10 text-lg px-8"
                >
                  View Architecture
                </Button>
              </Link>
              <Link to="/roadmap">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-deep/50 text-purple-deep hover:bg-purple-deep/10 text-lg px-8"
                >
                  See Roadmap
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Why <span className="text-gradient-primary">Agora</span>?
          </h2>
          <p className="text-text-secondary text-lg">
            The most advanced prediction market platform on blockchain
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Pillar 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 glass-surface h-full hover:border-orange-primary/50 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-primary to-orange-secondary flex items-center justify-center mb-6 mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">
                Predictable Performance
              </h3>
              <p className="text-text-secondary text-center">
                No gas wars, no front-running. Elastic microchain scaling
                ensures consistent sub-second finality regardless of network
                congestion.
              </p>
            </Card>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 glass-surface h-full hover:border-blue-electric/50 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-electric to-cyan-bright flex items-center justify-center mb-6 mx-auto">
                <Network className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">
                Agentic Integration
              </h3>
              <p className="text-text-secondary text-center">
                AI agents transact directly via MCP and GraphQL. Build
                autonomous prediction systems that operate 24/7.
              </p>
            </Card>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 glass-surface h-full hover:border-purple-deep/50 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-deep to-orange-primary flex items-center justify-center mb-6 mx-auto">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">
                Real-Time UX
              </h3>
              <p className="text-text-secondary text-center">
                Instant feedback with native push notifications. Users see
                market updates in real-time without polling or websockets.
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Confidence Flip Feature Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="p-10 glass-surface relative overflow-hidden hover:border-orange-primary/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-primary/5 via-transparent to-purple-deep/5" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-primary to-purple-deep flex items-center justify-center flex-shrink-0">
                <Target className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <Badge className="mb-3 bg-orange-primary/20 text-orange-primary border-orange-primary/30">
                  Featured Game
                </Badge>
                <h3 className="text-3xl font-bold mb-3">Confidence Flip</h3>
                <p className="text-text-secondary text-lg mb-4">
                  A 10-round micro-game that teaches calibrated prediction using
                  Brier scoring. Earn badges (Bronze/Silver/Gold/Platinum) and
                  track your progress. Scores save to your Profile.
                </p>
                <Link to="/game/confidence">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-primary to-orange-secondary hover:opacity-90"
                  >
                    Play Now
                    <Target className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card className="p-12 glass-surface text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-primary/10 via-blue-electric/10 to-purple-deep/10" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">
                Ready to experience{" "}
                <span className="text-gradient-primary">real-time</span>?
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                Join the Conway testnet and start building prediction markets on
                Linera microchains today.
              </p>
              <Link to="/connect">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-primary via-blue-electric to-purple-deep hover:opacity-90 text-lg px-10"
                >
                  Claim Your Chain
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
