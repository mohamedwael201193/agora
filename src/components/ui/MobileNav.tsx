import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedIcon } from "./AnimatedIcon";
import { LucideIcon } from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface MobileNavProps {
  items: NavItem[];
}

export const MobileNav = ({ items }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden flex flex-col gap-1.5 p-2 hover:bg-surface rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        <motion.span
          animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
          className="w-6 h-0.5 bg-text-primary rounded-full"
        />
        <motion.span
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          className="w-6 h-0.5 bg-text-primary rounded-full"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
          className="w-6 h-0.5 bg-text-primary rounded-full"
        />
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Slide-out Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-surface border-l border-border shadow-2xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h2 className="text-xl font-bold text-gradient-primary">Navigation</h2>
                  <button
                    onClick={closeMenu}
                    className="p-2 hover:bg-surface-elevated rounded-lg transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-2">
                    {items.map((item, index) => {
                      const isActive = location.pathname === item.path;
                      
                      return (
                        <motion.li
                          key={item.path}
                          initial={{ x: 50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={item.path}
                            onClick={closeMenu}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                              isActive
                                ? "bg-gradient-to-r from-orange-primary/20 to-blue-electric/20 text-orange-primary border border-orange-primary/30"
                                : "hover:bg-surface-elevated text-text-secondary hover:text-text-primary"
                            }`}
                          >
                            <AnimatedIcon
                              icon={item.icon}
                              animation="glow"
                              trigger="hover"
                              color={isActive ? "orange" : "inherit"}
                              size={20}
                            />
                            <span className="font-medium text-base">{item.label}</span>
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-border">
                  <Link to="/connect" onClick={closeMenu}>
                    <Button className="w-full bg-gradient-to-r from-orange-primary to-orange-secondary hover:opacity-90">
                      Launch App
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};