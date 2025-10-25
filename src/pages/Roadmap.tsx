import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Target } from "lucide-react";
import { Link } from "react-router-dom";

const waves = [
  {
    id: 1,
    title: "Foundation (Demo)",
    buildDates: "Oct 20 – Oct 29",
    status: "done",
    objective:
      "Ship a polished, fully interactive demo that showcases the Linera microchain experience with simulated sub‑second finality and real-time UX.",
    scope: [
      "Confidence Flip calibration game (10 rounds, probability slider 5–95%, YES/NO predict)",
      "Brier scoring with percentile, badges (Bronze/Silver/Gold/Platinum)",
      "Achievement modal, calibration advice, persistent game history",
      "Accessibility: screen-reader live region, ARIA for slider and buttons, full keyboard navigation",
      "Profile integration (game stats, best score, total games, averages)",
      "Recent history list, badge display, 'Play Now' CTA when empty",
      "Real-time UX demo (live HUD + notifications, instant feedback patterns)",
      "Precise financial math (integer math, 4-dec precision), BetTicket refactor",
      "Performance: lazy loading for heavy routes, React.memo on hot components",
      "Clear demo framing: header pill + footer disclaimer marking Wave 1 as simulated",
    ],
    links: [
      { label: "Play Confidence Flip", to: "/game/confidence" },
      { label: "Architecture", to: "/architecture" },
    ],
  },
  {
    id: 2,
    title: "Core Markets (Conway integration MVP)",
    buildDates: "Nov 3 – Nov 12",
    status: "planned",
    objective:
      "Connect the demo to real Conway testnet microchains for core flows and introduce basic live markets.",
    scope: [
      "Conway testnet connection for personal/app chains (MVP)",
      "Marketplace launch (initial markets) with on-chain placement and settlement (MVP)",
      "Wallet persistence + basic address book",
      "Oracle integration (MVP) for resolving at least one real market",
      "Faucet/claim flow for test funds (if available)",
    ],
    links: [],
  },
  {
    id: 3,
    title: "Advanced Features",
    buildDates: "Nov 17 – Nov 26",
    status: "planned",
    objective:
      "Deepen market mechanics, analytics, and cross-chain resolution fidelity.",
    scope: [
      "Chrono‑Echoes exploratory prototype",
      "Cross‑chain market resolution with message guarantees",
      "Advanced analytics dashboard (P/L, calibration, win rate over time)",
      "Mobile-responsive polish across main flows",
    ],
    links: [],
  },
  {
    id: 4,
    title: "Builder Tools",
    buildDates: "Dec 1 – Dec 10",
    status: "planned",
    objective: "Enable fast market creation and operator workflows.",
    scope: [
      "Foundry Builder (drag & drop market builder) with presets",
      "Smart contract templates (starter kits)",
      "Market performance analytics for creators",
      "Revenue sharing configuration",
    ],
    links: [],
  },
  {
    id: 5,
    title: "AI & Automation",
    buildDates: "Dec 15 – Jan 7",
    status: "planned",
    objective: "Introduce agentic workflows and predictive guidance.",
    scope: [
      "AI market suggestions",
      "Automated oracle feeds (pipeline MVP)",
      "Predictive analytics engine for risk/edge",
      "Agent integration (MCP) for autonomous operations",
    ],
    links: [],
  },
  {
    id: 6,
    title: "Ecosystem",
    buildDates: "Jan 12 – Jan 21",
    status: "planned",
    objective: "Ship integrations and social features that grow the network.",
    scope: [
      "Third‑party integrations",
      "Advanced charting tools",
      "Social trading features (follows, shared slates)",
      "Governance mechanisms (proposal → vote flow MVP)",
    ],
    links: [],
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    completed: "bg-success/20 text-success border-success/30",
    "in-progress":
      "bg-orange-primary/20 text-orange-primary border-orange-primary/30 animate-pulse",
    planned: "bg-text-muted/20 text-text-muted border-text-muted/30",
  };

  return (
    <Badge className={variants[status as keyof typeof variants]}>
      {status === "in-progress"
        ? "In Progress"
        : status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function Roadmap() {
  return (
    <div className="container mx-auto px-4 py-12 overflow-hidden">
      {/* Header with enhanced animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Development <span className="text-gradient-primary">Roadmap</span>
        </motion.h1>
        <motion.p
          className="text-text-secondary text-xl max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Our path from demo foundation to a full, real-time prediction market
          ecosystem on Linera microchains.
        </motion.p>
      </motion.div>

      {/* Program Schedule Summary with gradient background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-16"
      >
        <Card className="p-8 glass-surface relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-primary/5 via-transparent to-purple-deep/5" />
          <h2 className="text-2xl font-bold mb-6 text-center relative z-10">
            Program Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {[
              {
                wave: "W1",
                dates: "Oct 20–29",
                title: "Foundation (Demo)",
                active: true,
              },
              {
                wave: "W2",
                dates: "Nov 3–12",
                title: "Core Markets",
                active: false,
              },
              {
                wave: "W3",
                dates: "Nov 17–26",
                title: "Advanced Features",
                active: false,
              },
              {
                wave: "W4",
                dates: "Dec 1–10",
                title: "Builder Tools",
                active: false,
              },
              {
                wave: "W5",
                dates: "Dec 15–Jan 7",
                title: "AI & Automation",
                active: false,
              },
              {
                wave: "W6",
                dates: "Jan 12–21",
                title: "Ecosystem",
                active: false,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                className={`text-center p-4 rounded-lg transition-all duration-300 ${
                  item.active
                    ? "bg-orange-primary/10 border border-orange-primary/30 scale-105"
                    : "hover:bg-surface/50"
                }`}
              >
                <div
                  className={`font-bold text-lg mb-2 ${
                    item.active ? "text-orange-primary" : "text-text-muted"
                  }`}
                >
                  {item.wave}: {item.dates}
                </div>
                <div className="text-text-muted text-sm">{item.title}</div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Waves with improved animations */}
      <div className="space-y-10">
        {waves.map((wave, index) => (
          <motion.div
            key={wave.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="p-8 glass-surface relative overflow-hidden group">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-primary/0 via-transparent to-purple-deep/0 group-hover:from-orange-primary/5 group-hover:to-purple-deep/5 transition-all duration-500" />

                {/* Wave Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-4 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <h2 className="text-4xl font-bold mb-3">
                      Wave {wave.id} — {wave.title}
                    </h2>
                    <p className="text-text-muted font-medium">
                      Build: {wave.buildDates}
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <StatusBadge status={wave.status} />
                  </motion.div>
                </div>

                {/* Objective with icon animation */}
                <motion.div
                  className="mb-8 relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Target className="w-6 h-6 text-orange-primary" />
                    </motion.div>
                    Objective
                  </h3>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    {wave.objective}
                  </p>
                </motion.div>

                {/* Scope with staggered animation */}
                <motion.div
                  className="relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <h3 className="text-xl font-semibold mb-4">
                    What's included
                  </h3>
                  <ul className="space-y-3">
                    {wave.scope.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                        className="flex items-start gap-3 text-text-secondary group/item"
                      >
                        <motion.div
                          className="mt-2 w-2 h-2 rounded-full bg-orange-primary flex-shrink-0"
                          whileHover={{ scale: 1.5 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        />
                        <span className="group-hover/item:text-text-primary transition-colors duration-200">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Primary Links with smooth hover */}
                {wave.links.length > 0 && (
                  <motion.div
                    className="pt-8 mt-8 border-t border-border/50 relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <h3 className="text-sm font-semibold mb-4 text-text-muted uppercase tracking-wider">
                      Primary links
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {wave.links.map((link, i) => (
                        <Link key={i} to={link.to}>
                          <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 17,
                            }}
                          >
                            <Badge className="bg-orange-primary/20 text-orange-primary border-orange-primary/30 hover:bg-orange-primary/30 transition-colors cursor-pointer px-4 py-2 text-sm font-medium">
                              {link.label}
                              <ArrowRight className="ml-2 w-4 h-4 inline" />
                            </Badge>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
