import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatedIcon } from "./AnimatedIcon";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface NavigationMenuProps {
  primaryItems: NavItem[];
  secondaryItems: NavItem[];
}

export const NavigationMenu = ({ primaryItems, secondaryItems }: NavigationMenuProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const hasActiveSecondary = secondaryItems.some(item => isActive(item.path));

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {/* Primary Navigation Items */}
      {primaryItems.map((item) => {
        const active = isActive(item.path);
        
        return (
          <Link key={item.path} to={item.path}>
            <Button 
              variant="ghost" 
              className={`gap-2 relative ${
                active 
                  ? "text-orange-primary bg-orange-primary/10" 
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
              }`}
            >
              <AnimatedIcon 
                icon={item.icon} 
                animation="hover"
                trigger="hover"
                color={active ? "orange" : "inherit"}
                size={16}
              />
              {item.label}
              {active && (
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

      {/* More Dropdown for Secondary Items */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={`gap-2 ${
              hasActiveSecondary 
                ? "text-orange-primary bg-orange-primary/10" 
                : "text-text-secondary hover:text-text-primary hover:bg-surface"
            }`}
          >
            More
            <AnimatedIcon 
              icon={ChevronDown}
              animation="bounce"
              trigger="hover"
              size={14}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 glass-surface border-border/80 shadow-xl"
        >
          {secondaryItems.map((item) => {
            const active = isActive(item.path);
            
            return (
              <DropdownMenuItem key={item.path} asChild>
                <Link 
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
                    active ? "bg-orange-primary/10 text-orange-primary" : ""
                  }`}
                >
                  <AnimatedIcon 
                    icon={item.icon}
                    animation="glow"
                    trigger="hover"
                    color={active ? "orange" : "inherit"}
                    size={16}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};