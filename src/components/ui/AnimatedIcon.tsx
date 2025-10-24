import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AnimationType = 'hover' | 'pulse' | 'spin' | 'bounce' | 'glow' | 'none';
type TriggerType = 'hover' | 'click' | 'always';
type ColorType = 'orange' | 'blue' | 'gradient' | 'inherit';

interface AnimatedIconProps {
  icon: LucideIcon;
  animation?: AnimationType;
  trigger?: TriggerType;
  color?: ColorType;
  className?: string;
  size?: number;
}

const colorClasses = {
  orange: "text-orange-primary",
  blue: "text-blue-electric",
  gradient: "text-gradient-primary",
  inherit: ""
};

const getAnimationVariants = (animation: AnimationType, trigger: TriggerType) => {
  const variants: any = {
    initial: {},
    animate: {},
    hover: {},
  };

  switch (animation) {
    case 'pulse':
      if (trigger === 'always') {
        variants.animate = {
          scale: [1, 1.15, 1],
          opacity: [1, 0.8, 1],
        };
        variants.transition = {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        };
      } else if (trigger === 'hover') {
        variants.hover = {
          scale: [1, 1.15, 1],
          transition: { duration: 0.4, repeat: 2 }
        };
      }
      break;

    case 'bounce':
      if (trigger === 'always') {
        variants.animate = {
          y: [0, -8, 0],
        };
        variants.transition = {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        };
      } else if (trigger === 'hover') {
        variants.hover = {
          y: [0, -8, 0],
          transition: { duration: 0.5 }
        };
      }
      break;

    case 'spin':
      if (trigger === 'always') {
        variants.animate = {
          rotate: 360,
        };
        variants.transition = {
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        };
      } else if (trigger === 'hover') {
        variants.hover = {
          rotate: 360,
          transition: { duration: 0.6 }
        };
      }
      break;

    case 'glow':
      if (trigger === 'hover') {
        variants.hover = {
          filter: [
            "drop-shadow(0 0 2px hsl(14 100% 60%))",
            "drop-shadow(0 0 12px hsl(14 100% 60%))",
            "drop-shadow(0 0 2px hsl(14 100% 60%))"
          ],
          scale: 1.1,
          transition: { duration: 0.3 }
        };
      } else if (trigger === 'always') {
        variants.animate = {
          filter: [
            "drop-shadow(0 0 4px hsl(14 100% 60%))",
            "drop-shadow(0 0 12px hsl(14 100% 60%))",
            "drop-shadow(0 0 4px hsl(14 100% 60%))"
          ],
        };
        variants.transition = {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        };
      }
      break;

    case 'hover':
      variants.hover = {
        scale: 1.15,
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.3 }
      };
      break;

    default:
      // No animation
      break;
  }

  return variants;
};

export const AnimatedIcon = ({
  icon: Icon,
  animation = 'none',
  trigger = 'hover',
  color = 'inherit',
  className = "",
  size = 20,
}: AnimatedIconProps) => {
  const variants = getAnimationVariants(animation, trigger);
  const colorClass = colorClasses[color];

  return (
    <motion.div
      className={cn("inline-flex items-center justify-center", className)}
      initial={variants.initial}
      animate={trigger === 'always' ? variants.animate : undefined}
      whileHover={trigger === 'hover' ? variants.hover : undefined}
      transition={variants.transition}
    >
      <Icon 
        size={size} 
        className={cn(colorClass, "transition-colors duration-200")}
      />
    </motion.div>
  );
};