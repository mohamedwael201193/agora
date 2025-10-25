import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/hooks/useNotifications";
import { useAgoraStore } from "@/stores/useAgoraStore";
import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  Hammer,
  Home,
  Link as LinkIcon,
  Map,
  Network,
  Store,
  Target,
  User,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AgoraLogo } from "./ui/AgoraLogo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MobileNav } from "./ui/MobileNav";
import { NavigationMenu } from "./ui/NavigationMenu";

// Navigation structure - Primary items always visible, secondary in dropdown
const primaryNavItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/marketplace", label: "Marketplace", icon: Store },
  { path: "/game/confidence", label: "Game", icon: Target },
  { path: "/roadmap", label: "Roadmap", icon: Map },
  { path: "/foundry", label: "Foundry Builder", icon: Hammer },
];

const secondaryNavItems = [
  { path: "/chrono-echoes", label: "Chrono-Echoes", icon: Clock },
  { path: "/demo/counter", label: "Demo: Counter", icon: Zap },
  { path: "/demo/transfer", label: "Demo: Transfer", icon: Activity },
  { path: "/architecture", label: "Architecture", icon: Network },
];

const allNavItems = [...primaryNavItems, ...secondaryNavItems];

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
          <span className="font-semibold">Conway Testnet</span> — No Real Value
          • Learn & Experiment Safely
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
            {/* Animated Logo */}
            <AgoraLogo />

            {/* Desktop Navigation with Dropdown */}
            <NavigationMenu
              primaryItems={primaryNavItems}
              secondaryItems={secondaryNavItems}
            />

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* User Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden lg:flex items-center gap-2 hover:bg-surface"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-gradient-to-br from-orange-primary to-blue-electric text-white text-sm font-semibold">
                        U
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 glass-surface border-border/80"
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/connect" className="cursor-pointer">
                      <LinkIcon className="mr-2 h-4 w-4" />
                      <span>Connect Chain</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive">
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/connect" className="hidden lg:block">
                <Button className="bg-gradient-to-r from-orange-primary to-orange-secondary hover:opacity-90">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Connect Chain
                </Button>
              </Link>

              {/* Mobile Navigation */}
              <MobileNav items={allNavItems} />
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
                <div className="font-bold text-success mb-1">
                  {latency.mutation}ms
                </div>
                <div className="text-[10px] text-text-muted">Mutation</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-electric mb-1">
                  {latency.notification}ms
                </div>
                <div className="text-[10px] text-text-muted">Notify</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-primary mb-1">
                  {latency.endToEnd}ms
                </div>
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
              <AgoraLogo />
              <p className="text-text-muted text-sm mt-4">
                Real-time prediction markets and microchain platform on Linera.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>
                  <Link
                    to="/marketplace"
                    className="hover:text-orange-primary transition-colors"
                  >
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link
                    to="/chrono-echoes"
                    className="hover:text-orange-primary transition-colors"
                  >
                    Chrono-Echoes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/foundry"
                    className="hover:text-orange-primary transition-colors"
                  >
                    Foundry Builder
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>
                  <Link
                    to="/architecture"
                    className="hover:text-orange-primary transition-colors"
                  >
                    Architecture
                  </Link>
                </li>
                <li>
                  <Link
                    to="/roadmap"
                    className="hover:text-orange-primary transition-colors"
                  >
                    Roadmap
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-primary transition-colors"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-primary transition-colors"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-primary transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-primary transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-text-muted space-y-2">
            <p className="text-amber-500/80 italic">
              Wave 1 is a UX demo using simulated data. No on‑chain state is
              created; testnet connectivity arrives in Wave 2.
            </p>
            <p>
              © 2025 Agora. Built on Linera microchains. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
