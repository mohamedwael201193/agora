import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PillProps {
  variant?: "demo" | "default";
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

export function Pill({
  variant = "default",
  children,
  className,
  ...props
}: PillProps) {
  const variantStyles = {
    demo: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
    default: "bg-muted border-border",
  };

  return (
    <Badge
      variant="outline"
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Badge>
  );
}
