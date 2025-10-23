import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Shield, Clock, Network } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-bg.jpg";

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
            <Badge className="mb-6 bg-orange-primary/20 text-orange-primary border-orange-primary/30 text-base px-4 py-2">
              Conway Testnet Now Live
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Don't be late.
              <br />
              <span className="text-gradient-primary">Be real-time.</span>
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto">
              Build prediction markets, games, and agentic apps on Linera microchains 
              with sub-second finality.
            </p>

            {/* Metrics Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-8 mb-12 text-sm"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-primary" />
                <span className="text-text-muted">Block Finality</span>
                <span className="font-bold">{"<"}300ms</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-electric" />
                <span className="text-text-muted">Trustless</span>
                <span className="font-bold">Browser Client</span>
              </div>
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-deep" />
                <span className="text-text-muted">Native</span>
                <span className="font-bold">Push Notifications</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/marketplace">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-primary to-orange-secondary hover:opacity-90 text-lg px-8"
                >
                  Launch Marketplace
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/chrono-echoes">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-orange-primary/50 text-orange-primary hover:bg-orange-primary/10 text-lg px-8"
                >
                  Try Chrono-Echoes
                </Button>
              </Link>
              <Link to="/foundry">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-blue-electric/50 text-blue-electric hover:bg-blue-electric/10 text-lg px-8"
                >
                  Build with Foundry
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

        <div className="grid md:grid-cols-3 gap-8">
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
              <h3 className="text-2xl font-bold mb-4 text-center">Predictable Performance</h3>
              <p className="text-text-secondary text-center">
                No gas wars, no front-running. Elastic microchain scaling ensures consistent 
                sub-second finality regardless of network congestion.
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
              <h3 className="text-2xl font-bold mb-4 text-center">Agentic Integration</h3>
              <p className="text-text-secondary text-center">
                AI agents transact directly via MCP and GraphQL. Build autonomous prediction 
                systems that operate 24/7.
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
              <h3 className="text-2xl font-bold mb-4 text-center">Real-Time UX</h3>
              <p className="text-text-secondary text-center">
                Instant feedback with native push notifications. Users see market updates 
                in real-time without polling or websockets.
              </p>
            </Card>
          </motion.div>
        </div>
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
                Ready to experience <span className="text-gradient-primary">real-time</span>?
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                Join the Conway testnet and start building prediction markets on Linera microchains today.
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
