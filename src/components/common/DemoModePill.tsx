import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export function DemoModePill() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 cursor-help"
            aria-label="Demo mode indicator - Wave 1 uses simulated data"
          >
            <Info className="w-3 h-3 mr-1" aria-hidden="true" />
            Demo Mode • Mock data
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Wave 1 uses simulated data; no on‑chain actions.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
