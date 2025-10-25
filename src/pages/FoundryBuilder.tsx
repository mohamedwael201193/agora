import foundryPreview from "@/assets/foundry-preview.jpg";
import { AnimatedIcon } from "@/components/ui/AnimatedIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Clock,
  Code,
  Dices,
  DollarSign,
  Eye,
  Hammer,
  HelpCircle,
  Lightbulb,
  LineChart,
  Palette,
  Plug,
  Plus,
  RefreshCw,
  Rocket,
  ScrollText,
  Target,
  Timer,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const templates = [
  {
    id: 1,
    name: "Binary Market",
    description: "Simple yes/no prediction market",
    icon: BarChart3,
    popular: true,
  },
  {
    id: 2,
    name: "Multiple Choice",
    description: "Market with 3+ possible outcomes",
    icon: Target,
    popular: true,
  },
  {
    id: 3,
    name: "Numeric Range",
    description: "Predict a value within a range",
    icon: TrendingUp,
    popular: false,
  },
  {
    id: 4,
    name: "Time-Bounded",
    description: "Event resolution within timeframe",
    icon: Timer,
    popular: false,
  },
];

const components = [
  {
    id: "question",
    label: "Question Block",
    icon: HelpCircle,
    color: "orange",
  },
  { id: "outcomes", label: "Outcome Options", icon: Dices, color: "blue" },
  { id: "oracle", label: "Oracle Connection", icon: Eye, color: "purple" },
  { id: "timebound", label: "Time Bounds", icon: Clock, color: "cyan" },
  {
    id: "rules",
    label: "Participation Rules",
    icon: ScrollText,
    color: "orange",
  },
  { id: "pricing", label: "Fee Structure", icon: DollarSign, color: "blue" },
  {
    id: "liquidity",
    label: "Liquidity Pool",
    icon: LineChart,
    color: "purple",
  },
  {
    id: "resolution",
    label: "Resolution Logic",
    icon: RefreshCw,
    color: "cyan",
  },
];

interface DroppedComponent {
  id: string;
  componentId: string;
  label: string;
  icon: any;
  color: string;
}

// Draggable Component Item
function DraggableComponent({
  component,
}: {
  component: (typeof components)[0];
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: component.id,
  });

  const colorMap: Record<string, string> = {
    orange: "orange-primary",
    blue: "blue-electric",
    purple: "purple-deep",
    cyan: "cyan-bright",
  };

  const bgColor = colorMap[component.color] || "orange-primary";

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      whileHover={{ scale: isDragging ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-4 bg-surface-elevated rounded-lg border border-border hover:border-orange-primary/50 transition-all text-center cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div
        className={`w-12 h-12 rounded-lg bg-${bgColor}/20 flex items-center justify-center mx-auto mb-2`}
      >
        <component.icon className={`w-6 h-6 text-${bgColor}`} />
      </div>
      <div className="text-sm font-medium">{component.label}</div>
    </motion.div>
  );
}

// Droppable Canvas Area
function DroppableCanvas({
  children,
  isOver,
}: {
  children: React.ReactNode;
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({
    id: "canvas",
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[400px] bg-surface-elevated rounded-lg border-2 transition-all ${
        isOver
          ? "border-orange-primary border-dashed bg-orange-primary/5"
          : "border-dashed border-border"
      }`}
    >
      {children}
    </div>
  );
}

export default function FoundryBuilder() {
  const [marketName, setMarketName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [droppedComponents, setDroppedComponents] = useState<
    DroppedComponent[]
  >([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && over.id === "canvas") {
      const component = components.find((c) => c.id === active.id);
      if (component) {
        const newComponent: DroppedComponent = {
          id: `${component.id}-${Date.now()}`,
          componentId: component.id,
          label: component.label,
          icon: component.icon,
          color: component.color,
        };
        setDroppedComponents((prev) => [...prev, newComponent]);
        toast({
          title: "Component Added ✓",
          description: `${component.label} added to your market canvas`,
        });
      }
    }
  };

  const removeComponent = (id: string) => {
    setDroppedComponents((prev) => prev.filter((c) => c.id !== id));
  };

  const handleDeploy = async () => {
    if (!marketName || droppedComponents.length === 0) {
      toast({
        title: "Incomplete Configuration",
        description: "Please add a market question and at least one component",
        variant: "destructive",
      });
      return;
    }

    setIsDeploying(true);

    // Simulate realistic deployment process
    await new Promise((resolve) => setTimeout(resolve, 1800));

    toast({
      title: "🚀 Market Deployed Successfully!",
      description: `"${marketName}" is now live on the Agora marketplace`,
    });

    setIsDeploying(false);

    // Reset form after successful deployment
    setTimeout(() => {
      setMarketName("");
      setDroppedComponents([]);
      setSelectedTemplate(null);
    }, 500);
  };

  const isConfigValid = marketName.length > 0 && droppedComponents.length > 0;

  const activeDragComponent = activeId
    ? components.find((c) => c.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-orange-primary/20 text-orange-primary border-orange-primary/30">
              <AnimatedIcon
                icon={Hammer}
                animation="bounce"
                trigger="hover"
                color="orange"
                size={12}
                className="mr-1"
              />
              No-Code Builder
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Market <span className="text-gradient-primary">Foundry</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Drag-and-drop market builder. Create custom prediction markets in
              minutes with zero coding required.
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
                      <div className="w-10 h-10 rounded-lg bg-orange-primary/20 flex items-center justify-center flex-shrink-0">
                        <template.icon className="w-5 h-5 text-orange-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">
                            {template.name}
                          </h4>
                          {template.popular && (
                            <Badge className="text-xs bg-orange-primary/20 text-orange-primary border-orange-primary/30">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-text-muted">
                          {template.description}
                        </p>
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
              <h3 className="font-semibold mb-2">Market Components</h3>
              <p className="text-sm text-text-muted mb-4">
                Drag components to the canvas below to build your market
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {components.map((component) => (
                  <DraggableComponent
                    key={component.id}
                    component={component}
                  />
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

              <DroppableCanvas isOver={!!activeId}>
                {droppedComponents.length === 0 ? (
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="text-center text-text-muted">
                      <Plus className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium mb-2">
                        Drag components here to build your market
                      </p>
                      <p className="text-sm">
                        Or select a template to get started
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    <AnimatePresence>
                      {droppedComponents.map((component, index) => {
                        const colorMap: Record<string, string> = {
                          orange: "orange-primary",
                          blue: "blue-electric",
                          purple: "purple-deep",
                          cyan: "cyan-bright",
                        };
                        const bgColor =
                          colorMap[component.color] || "orange-primary";

                        return (
                          <motion.div
                            key={component.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -100, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 bg-surface rounded-lg border border-border hover:border-orange-primary/50 transition-all flex items-center gap-4 group"
                          >
                            <div
                              className={`w-10 h-10 rounded-lg bg-${bgColor}/20 flex items-center justify-center flex-shrink-0`}
                            >
                              <component.icon
                                className={`w-5 h-5 text-${bgColor}`}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">
                                {component.label}
                              </h4>
                              <p className="text-xs text-text-muted">
                                Component #{index + 1} • Configured
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeComponent(component.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </DroppableCanvas>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">
                Save Draft
              </Button>
              <Button
                onClick={handleDeploy}
                disabled={!isConfigValid || isDeploying}
                className="flex-1 bg-gradient-to-r from-orange-primary to-blue-electric hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeploying ? (
                  <>
                    <AnimatedIcon
                      icon={RefreshCw}
                      animation="spin"
                      trigger="always"
                      size={16}
                      className="mr-2"
                    />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Deploy Market
                  </>
                )}
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
                  <AnimatedIcon
                    icon={Palette}
                    animation="pulse"
                    trigger="hover"
                    color="orange"
                    size={32}
                  />
                </div>
                <h4 className="font-semibold mb-2">Visual Builder</h4>
                <p className="text-sm text-text-muted">
                  Intuitive drag-and-drop interface
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-electric/20 flex items-center justify-center mx-auto mb-3">
                  <AnimatedIcon
                    icon={Zap}
                    animation="glow"
                    trigger="hover"
                    color="blue"
                    size={32}
                  />
                </div>
                <h4 className="font-semibold mb-2">Instant Deploy</h4>
                <p className="text-sm text-text-muted">
                  One-click market launch
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-deep/20 flex items-center justify-center mx-auto mb-3">
                  <Plug className="w-8 h-8 text-purple-deep" />
                </div>
                <h4 className="font-semibold mb-2">Oracle Integration</h4>
                <p className="text-sm text-text-muted">
                  Connect external data sources
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-cyan-bright/20 flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="w-8 h-8 text-cyan-bright" />
                </div>
                <h4 className="font-semibold mb-2">Smart Templates</h4>
                <p className="text-sm text-text-muted">
                  Pre-built market types
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeDragComponent && (
            <div className="p-4 bg-surface-elevated rounded-lg border-2 border-orange-primary shadow-2xl cursor-move">
              <div
                className={`w-12 h-12 rounded-lg bg-${
                  activeDragComponent.color === "orange"
                    ? "orange-primary"
                    : activeDragComponent.color === "blue"
                    ? "blue-electric"
                    : activeDragComponent.color === "purple"
                    ? "purple-deep"
                    : "cyan-bright"
                }/20 flex items-center justify-center mx-auto mb-2`}
              >
                <activeDragComponent.icon
                  className={`w-6 h-6 text-${
                    activeDragComponent.color === "orange"
                      ? "orange-primary"
                      : activeDragComponent.color === "blue"
                      ? "blue-electric"
                      : activeDragComponent.color === "purple"
                      ? "purple-deep"
                      : "cyan-bright"
                  }`}
                />
              </div>
              <div className="text-sm font-medium text-center">
                {activeDragComponent.label}
              </div>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
