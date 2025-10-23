import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Circle, Clock } from "lucide-react";
import { motion } from "framer-motion";

const waves = [
  {
    id: 1,
    title: "Foundation",
    dateRange: "Q1 2025",
    status: "in-progress",
    features: [
      { name: "Personal chain claiming", status: "completed" },
      { name: "Real-time HUD + notifications", status: "completed" },
      { name: "Basic counter/transfer demos", status: "completed" },
      { name: "Profile system v1", status: "in-progress" },
    ],
  },
  {
    id: 2,
    title: "Core Markets",
    dateRange: "Q2 2025",
    status: "in-progress",
    features: [
      { name: "Marketplace launch (5 initial markets)", status: "in-progress" },
      { name: "Basic betting interface", status: "in-progress" },
      { name: "AddressBook + wallet persistence", status: "planned" },
      { name: "Oracle integration MVP", status: "planned" },
    ],
  },
  {
    id: 3,
    title: "Advanced Features",
    dateRange: "Q2-Q3 2025",
    status: "planned",
    features: [
      { name: "Chrono-Echoes platform", status: "planned" },
      { name: "Cross-chain market resolution", status: "planned" },
      { name: "Advanced analytics dashboard", status: "planned" },
      { name: "Mobile-responsive optimization", status: "planned" },
    ],
  },
  {
    id: 4,
    title: "Builder Tools",
    dateRange: "Q3 2025",
    status: "planned",
    features: [
      { name: "Foundry Builder drag & drop", status: "planned" },
      { name: "Smart contract templates", status: "planned" },
      { name: "Market performance analytics", status: "planned" },
      { name: "Revenue sharing tools", status: "planned" },
    ],
  },
  {
    id: 5,
    title: "AI & Automation",
    dateRange: "Q4 2025",
    status: "planned",
    features: [
      { name: "AI market suggestions", status: "planned" },
      { name: "Automated oracle feeds", status: "planned" },
      { name: "Predictive analytics engine", status: "planned" },
      { name: "Agent integration (MCP)", status: "planned" },
    ],
  },
  {
    id: 6,
    title: "Ecosystem",
    dateRange: "Q1 2026",
    status: "planned",
    features: [
      { name: "Third-party integrations", status: "planned" },
      { name: "Advanced charting tools", status: "planned" },
      { name: "Social trading features", status: "planned" },
      { name: "Governance mechanisms", status: "planned" },
    ],
  },
];

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "completed") {
    return <Check className="w-4 h-4 text-success" />;
  }
  if (status === "in-progress") {
    return <Clock className="w-4 h-4 text-orange-primary animate-pulse" />;
  }
  return <Circle className="w-4 h-4 text-text-muted" />;
};

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    completed: "bg-success/20 text-success border-success/30",
    "in-progress": "bg-orange-primary/20 text-orange-primary border-orange-primary/30",
    planned: "bg-text-muted/20 text-text-muted border-text-muted/30",
  };

  return (
    <Badge className={variants[status as keyof typeof variants]}>
      {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function Roadmap() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Development <span className="text-gradient-primary">Roadmap</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Our journey from foundation to full-featured prediction market ecosystem on Linera microchains.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line (hidden on mobile) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-primary via-blue-electric to-purple-deep" />

        {/* Waves */}
        <div className="space-y-12">
          {waves.map((wave, index) => {
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={wave.id}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative grid md:grid-cols-2 gap-8 ${isLeft ? "" : "md:flex-row-reverse"}`}
              >
                {/* Card */}
                <div className={isLeft ? "md:pr-12" : "md:pl-12 md:col-start-2"}>
                  <Card className="p-6 glass-surface">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">Wave {wave.id}: {wave.title}</h3>
                        <p className="text-text-muted text-sm">{wave.dateRange}</p>
                      </div>
                      <StatusBadge status={wave.status} />
                    </div>

                    <ul className="space-y-3">
                      {wave.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index * 0.1) + (featureIndex * 0.05) }}
                          className="flex items-start gap-3"
                        >
                          <StatusIcon status={feature.status} />
                          <span className="text-text-secondary">{feature.name}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </Card>
                </div>

                {/* Timeline dot */}
                <div className="hidden md:block absolute left-1/2 top-8 -translate-x-1/2">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    wave.status === "completed" 
                      ? "bg-success border-success" 
                      : wave.status === "in-progress"
                      ? "bg-orange-primary border-orange-primary animate-pulse"
                      : "bg-surface border-text-muted"
                  }`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-16"
      >
        <Card className="p-8 glass-surface">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-success mb-2">
                {waves.flatMap(w => w.features).filter(f => f.status === "completed").length}
              </div>
              <div className="text-sm text-text-muted">Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-primary mb-2">
                {waves.flatMap(w => w.features).filter(f => f.status === "in-progress").length}
              </div>
              <div className="text-sm text-text-muted">In Progress</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-text-muted mb-2">
                {waves.flatMap(w => w.features).filter(f => f.status === "planned").length}
              </div>
              <div className="text-sm text-text-muted">Planned</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient-primary mb-2">
                {Math.round((waves.flatMap(w => w.features).filter(f => f.status === "completed").length / waves.flatMap(w => w.features).length) * 100)}%
              </div>
              <div className="text-sm text-text-muted">Complete</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-12 text-center"
      >
        <Card className="p-8 glass-surface">
          <h3 className="text-2xl font-bold mb-3">Want to influence our roadmap?</h3>
          <p className="text-text-secondary mb-6">
            Join our community and share your ideas for features you'd like to see.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#" className="text-orange-primary hover:text-orange-secondary transition-colors">
              Discord
            </a>
            <span className="text-text-muted">•</span>
            <a href="#" className="text-orange-primary hover:text-orange-secondary transition-colors">
              Twitter
            </a>
            <span className="text-text-muted">•</span>
            <a href="#" className="text-orange-primary hover:text-orange-secondary transition-colors">
              GitHub Discussions
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
