import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface AgoraLogoProps {
  className?: string;
}

export const AgoraLogo = ({ className = "" }: AgoraLogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-3 group ${className}`}>
      {/* Animated Logo Icon */}
      <motion.div
        className="relative w-10 h-10"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* Glowing Background */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-primary to-blue-electric opacity-30 blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* SVG Logo */}
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.img
            src="/favicon.svg"
            alt="Agora Logo"
            className="w-full h-full"
            animate={{
              filter: [
                "drop-shadow(0 0 8px rgba(255,107,53,0.6))",
                "drop-shadow(0 0 15px rgba(255,107,53,0.9))",
                "drop-shadow(0 0 8px rgba(255,107,53,0.6))",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Orbital Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-orange-primary/40"
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: "center" }}
        >
          {/* Orbital Particles */}
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-blue-electric shadow-lg"
              style={{
                top: "50%",
                left: "50%",
                marginTop: "-3px",
                marginLeft: "-3px",
              }}
              animate={{
                rotate: [angle, angle + 360],
                scale: [1, 1.3, 1],
              }}
              transition={{
                rotate: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.3,
                },
                scale: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                },
              }}
            >
              <div
                className="absolute inset-0 rounded-full blur-sm bg-blue-electric"
                style={{
                  transform: `translateX(20px)`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Animated Wordmark */}
      <div className="flex items-center">
        {["A", "G", "O", "R", "A"].map((letter, i) => (
          <motion.span
            key={i}
            className="text-2xl font-bold leading-none"
            initial={{ y: 0, opacity: 1 }}
            whileHover={{
              y: -3,
              transition: { duration: 0.2 },
            }}
            style={{
              background:
                "linear-gradient(135deg, hsl(14 100% 60%) 0%, hsl(190 100% 50%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {/* Electric Connection Lines (subtle) */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={false}
      >
        <svg
          className="w-full h-full"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <motion.line
            x1="15%"
            y1="50%"
            x2="85%"
            y2="50%"
            stroke="url(#electric-gradient)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            whileHover={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 0.6 }}
          />
          <defs>
            <linearGradient
              id="electric-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="hsl(14 100% 60%)" />
              <stop offset="100%" stopColor="hsl(190 100% 50%)" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </Link>
  );
};
