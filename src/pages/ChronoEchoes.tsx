import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, Timer, Target, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import chronoPreview from "@/assets/chrono-echoes-preview.jpg";

const timeHorizons = [
  { id: "1min", label: "1 Min", duration: 60 },
  { id: "5min", label: "5 Min", duration: 300 },
  { id: "15min", label: "15 Min", duration: 900 },
  { id: "1hr", label: "1 Hour", duration: 3600 },
  { id: "24hr", label: "24 Hours", duration: 86400 },
];

const events = [
  {
    id: 1,
    type: "crypto",
    question: "BTC price moves 0.5% in next 5 minutes?",
    currentPrice: "$94,234.56",
    multiplier: "2.4x",
    participants: 234,
    timeLeft: 287,
  },
  {
    id: 2,
    type: "social",
    question: "Elon Musk tweets in next 15 minutes?",
    lastTweet: "8 min ago",
    multiplier: "1.8x",
    participants: 567,
    timeLeft: 742,
  },
  {
    id: 3,
    type: "sports",
    question: "Goal scored in live match (next minute)?",
    match: "Arsenal vs Chelsea - 67'",
    multiplier: "5.2x",
    participants: 892,
    timeLeft: 52,
  },
];

export default function ChronoEchoes() {
  const [selectedHorizon, setSelectedHorizon] = useState("5min");

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-purple-deep/20 text-purple-deep border-purple-deep/30">
            <Zap className="w-3 h-3 mr-1" />
            Ultra Fast Settlement
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Chrono-<span className="text-gradient-secondary">Echoes</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Time-based prediction markets that resolve in seconds. Bet on events within specific time windows 
            with instant, trustless settlement.
          </p>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative h-80 rounded-xl overflow-hidden mb-8"
        >
          <img 
            src={chronoPreview} 
            alt="Time-based betting interface with countdown timers and ripple effects" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent" />
          
          {/* Floating time indicators */}
          <motion.div
            className="absolute top-8 left-8 glass-surface px-4 py-2 rounded-lg"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2 text-orange-primary">
              <Timer className="w-5 h-5" />
              <span className="font-mono text-xl font-bold">00:05:00</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Time Horizon Selector */}
        <Card className="p-6 glass-surface mb-8">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-primary" />
            Select Time Horizon
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {timeHorizons.map((horizon) => (
              <Button
                key={horizon.id}
                variant={selectedHorizon === horizon.id ? "default" : "outline"}
                onClick={() => setSelectedHorizon(horizon.id)}
                className={`${
                  selectedHorizon === horizon.id 
                    ? "bg-gradient-to-r from-purple-deep to-orange-primary text-white" 
                    : ""
                }`}
              >
                {horizon.label}
              </Button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Active Events */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">
          Active Events • {selectedHorizon}
        </h2>

        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 glass-surface hover:border-purple-deep/50 transition-all">
              <div className="grid md:grid-cols-[1fr_auto] gap-6">
                {/* Event Details */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="capitalize">
                      {event.type}
                    </Badge>
                    <Badge className="bg-success/20 text-success border-success/30">
                      {event.multiplier}
                    </Badge>
                    <span className="text-sm text-text-muted">
                      {event.participants} betting
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">{event.question}</h3>

                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    {event.type === "crypto" && (
                      <span>Current: <span className="text-text-primary font-mono">{event.currentPrice}</span></span>
                    )}
                    {event.type === "social" && (
                      <span>Last: <span className="text-text-primary">{event.lastTweet}</span></span>
                    )}
                    {event.type === "sports" && (
                      <span className="text-text-primary">{event.match}</span>
                    )}
                  </div>
                </div>

                {/* Timer & Action */}
                <div className="flex flex-col items-center justify-center gap-4 md:min-w-[200px]">
                  <div className="relative">
                    <motion.div
                      className="w-24 h-24 rounded-full border-4 border-purple-deep/30 flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: event.timeLeft, ease: "linear", repeat: Infinity }}
                    >
                      <div className="text-center">
                        <div className="font-mono text-2xl font-bold text-purple-deep">
                          {Math.floor(event.timeLeft / 60)}:{String(event.timeLeft % 60).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-text-muted">left</div>
                      </div>
                    </motion.div>
                    
                    {/* Ripple effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-purple-deep"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-deep to-orange-primary hover:opacity-90">
                    Place Bet
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12"
      >
        <Card className="p-6 glass-surface">
          <h3 className="text-xl font-bold mb-4">How Chrono-Echoes Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 rounded-lg bg-purple-deep/20 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-purple-deep" />
              </div>
              <h4 className="font-semibold mb-2">Select Time Window</h4>
              <p className="text-sm text-text-muted">
                Choose your prediction horizon from 1 minute to 24 hours
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-orange-primary/20 flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-orange-primary" />
              </div>
              <h4 className="font-semibold mb-2">Place Your Bet</h4>
              <p className="text-sm text-text-muted">
                Predict outcomes with real-time odds and instant confirmation
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-blue-electric/20 flex items-center justify-center mb-3">
                <DollarSign className="w-6 h-6 text-blue-electric" />
              </div>
              <h4 className="font-semibold mb-2">Auto-Settlement</h4>
              <p className="text-sm text-text-muted">
                Oracles resolve events automatically, payouts are instant
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
