import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Home, 
  Link as LinkIcon, 
  Store, 
  Clock, 
  Hammer, 
  Network, 
  Map, 
  User,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { RealTimeHUD } from "./realtime/RealTimeHUD";
import { NotificationFeed } from "./notifications/NotificationFeed";
import { DeveloperDrawer } from "./DeveloperDrawer";
import { useNotifications } from "@/hooks/useNotifications";
import { useAgoraStore } from "@/stores/useAgoraStore";
import { useState } from "react";
import { X } from "lucide-react";

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <motion.div
      className="relative w-10 h-10"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-br from-orange-primary to-blue-electric opacity-20 blur-xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative w-full h-full rounded-lg bg-gradient-to-br from-orange-primary to-blue-electric flex items-center justify-center font-bold text-white text-xl">
        A
      </div>
    </motion.div>
    <span className="text-2xl font-bold bg-gradient-to-r from-orange-primary to-blue-electric bg-clip-text text-transparent">
      Agora
    </span>
  </Link>
);

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/connect", label: "Connect", icon: LinkIcon },
  { path: "/marketplace", label: "Marketplace", icon: Store },
  { path: "/chrono-echoes", label: "Chrono-Echoes", icon: Clock },
  { path: "/foundry", label: "Foundry", icon: Hammer },
  { path: "/architecture", label: "Architecture", icon: Network },
  { path: "/roadmap", label: "Roadmap", icon: Map },
  { path: "/profile", label: "Profile", icon: User },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [showTestnetBanner, setShowTestnetBanner] = useState(true);
  const { latency, showPerformanceMetrics } = useAgoraStore();
  
  // Initialize notifications hook
  useNotifications();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Testnet Banner */}
      {showTestnetBanner && (
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="bg-gradient-to-r from-orange-primary/20 to-blue-electric/20 border-b border-orange-primary/30 px-4 py-2 text-center text-sm relative"
        >
          <span className="font-semibold">Conway Testnet</span> — No Real Value • Learn & Experiment Safely
          <button
            onClick={() => setShowTestnetBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-orange-primary transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 glass-surface border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link key={item.path} to={item.path}>
                    <Button 
                      variant="ghost" 
                      className={`gap-2 relative ${
                        isActive 
                          ? "text-orange-primary bg-orange-primary/10" 
                          : "text-text-secondary hover:text-text-primary hover:bg-surface"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-primary to-blue-electric"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <DeveloperDrawer />
              <Link to="/connect">
                <Button className="bg-gradient-to-r from-orange-primary to-orange-secondary hover:opacity-90">
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Real-Time Latency Simulator */}
      {showPerformanceMetrics && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 z-50 hidden lg:block"
        >
          <Card className="p-4 glass-surface border-blue-electric/30">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-electric" />
              <span className="text-xs font-semibold">Performance</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center">
                <div className="font-bold text-success mb-1">{latency.mutation}ms</div>
                <div className="text-[10px] text-text-muted">Mutation</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-electric mb-1">{latency.notification}ms</div>
                <div className="text-[10px] text-text-muted">Notify</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-primary mb-1">{latency.endToEnd}ms</div>
                <div className="text-[10px] text-text-muted">E2E</div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-surface/30 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Logo />
              <p className="text-text-muted text-sm mt-4">
                Real-time prediction markets and microchain platform on Linera.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><Link to="/marketplace" className="hover:text-orange-primary transition-colors">Marketplace</Link></li>
                <li><Link to="/chrono-echoes" className="hover:text-orange-primary transition-colors">Chrono-Echoes</Link></li>
                <li><Link to="/foundry" className="hover:text-orange-primary transition-colors">Foundry Builder</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><Link to="/architecture" className="hover:text-orange-primary transition-colors">Architecture</Link></li>
                <li><Link to="/roadmap" className="hover:text-orange-primary transition-colors">Roadmap</Link></li>
                <li><a href="#" className="hover:text-orange-primary transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><a href="#" className="hover:text-orange-primary transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-orange-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-orange-primary transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-text-muted">
            <p>© 2025 Agora. Built on Linera microchains. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
