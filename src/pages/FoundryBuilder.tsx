import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hammer, Plus, Code, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import foundryPreview from "@/assets/foundry-preview.jpg";

const templates = [
  {
    id: 1,
    name: "Binary Market",
    description: "Simple yes/no prediction market",
    icon: "📊",
    popular: true,
  },
  {
    id: 2,
    name: "Multiple Choice",
    description: "Market with 3+ possible outcomes",
    icon: "🎯",
    popular: true,
  },
  {
    id: 3,
    name: "Numeric Range",
    description: "Predict a value within a range",
    icon: "📈",
    popular: false,
  },
  {
    id: 4,
    name: "Time-Bounded",
    description: "Event resolution within timeframe",
    icon: "⏱️",
    popular: false,
  },
];

const components = [
  { id: "question", label: "Question Block", icon: "❓" },
  { id: "outcomes", label: "Outcome Options", icon: "🎲" },
  { id: "oracle", label: "Oracle Connection", icon: "🔮" },
  { id: "timebound", label: "Time Bounds", icon: "⏰" },
  { id: "rules", label: "Participation Rules", icon: "📜" },
];

export default function FoundryBuilder() {
  const [marketName, setMarketName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-orange-primary/20 text-orange-primary border-orange-primary/30">
            <Hammer className="w-3 h-3 mr-1" />
            No-Code Builder
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Market <span className="text-gradient-primary">Foundry</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Drag-and-drop market builder. Create custom prediction markets in minutes 
            with zero coding required.
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
            src={foundryPreview} 
            alt="Drag and drop market builder interface with component palette" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Quick Start */}
      <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12">
        {/* Sidebar - Templates */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 glass-surface sticky top-24">
            <h3 className="font-semibold mb-4">Templates</h3>
            <div className="space-y-3">
              {templates.map((template) => (
                <motion.button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedTemplate === template.id
                      ? "border-orange-primary bg-orange-primary/10"
                      : "border-border bg-surface hover:border-orange-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{template.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{template.name}</h4>
                        {template.popular && (
                          <Badge className="text-xs bg-orange-primary/20 text-orange-primary border-orange-primary/30">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-text-muted">{template.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <Button className="w-full mt-4" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Blank Canvas
            </Button>
          </Card>
        </motion.div>

        {/* Main Builder Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Market Configuration */}
          <Card className="p-6 glass-surface">
            <h3 className="font-semibold mb-4">Market Configuration</h3>
            <div className="space-y-4">
              <div>
                <Label>Market Question</Label>
                <Input
                  placeholder="e.g., Will Bitcoin reach $100k by end of 2025?"
                  value={marketName}
                  onChange={(e) => setMarketName(e.target.value)}
                  className="bg-surface"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Input placeholder="Crypto" className="bg-surface" />
                </div>
                <div>
                  <Label>Resolution Date</Label>
                  <Input type="date" className="bg-surface" />
                </div>
              </div>
            </div>
          </Card>

          {/* Component Palette */}
          <Card className="p-6 glass-surface">
            <h3 className="font-semibold mb-4">Market Components</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {components.map((component) => (
                <motion.button
                  key={component.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-surface-elevated rounded-lg border border-border hover:border-orange-primary/50 transition-all text-center"
                >
                  <div className="text-3xl mb-2">{component.icon}</div>
                  <div className="text-sm font-medium">{component.label}</div>
                </motion.button>
              ))}
            </div>
          </Card>

          {/* Canvas Preview */}
          <Card className="p-6 glass-surface">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Canvas Preview</h3>
              <Button variant="outline" size="sm">
                <Code className="w-4 h-4 mr-2" />
                View Code
              </Button>
            </div>

            <div className="min-h-[400px] bg-surface-elevated rounded-lg border-2 border-dashed border-border flex items-center justify-center">
              <div className="text-center text-text-muted">
                <Plus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Drag components here to build your market</p>
                <p className="text-sm mt-2">Or select a template to get started</p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1">
              Save Draft
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-orange-primary to-blue-electric hover:opacity-90">
              <Rocket className="w-4 h-4 mr-2" />
              Deploy Market
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 glass-surface">
          <h3 className="text-xl font-bold mb-6">Foundry Features</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-primary/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🎨</span>
              </div>
              <h4 className="font-semibold mb-2">Visual Builder</h4>
              <p className="text-sm text-text-muted">Intuitive drag-and-drop interface</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-electric/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">⚡</span>
              </div>
              <h4 className="font-semibold mb-2">Instant Deploy</h4>
              <p className="text-sm text-text-muted">One-click market launch</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-deep/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🔌</span>
              </div>
              <h4 className="font-semibold mb-2">Oracle Integration</h4>
              <p className="text-sm text-text-muted">Connect external data sources</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-cyan-bright/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">💡</span>
              </div>
              <h4 className="font-semibold mb-2">Smart Templates</h4>
              <p className="text-sm text-text-muted">Pre-built market types</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
