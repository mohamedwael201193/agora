import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, LucideIcon } from "lucide-react";

interface StatChipProps {
  icon: LucideIcon;
  label: string;
  tooltip: string;
}

export function StatChip({ icon: Icon, label, tooltip }: StatChipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex items-center gap-2 px-4 py-2 bg-surface/50 rounded-lg border border-border/50 hover:bg-surface transition-colors cursor-help"
            aria-label={label}
            aria-describedby={`tooltip-${label.replace(/\s+/g, "-")}`}
          >
            <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium">{label}</span>
            <Info
              className="w-3 h-3 text-muted-foreground ml-auto"
              aria-hidden="true"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent id={`tooltip-${label.replace(/\s+/g, "-")}`}>
          <p className="max-w-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
