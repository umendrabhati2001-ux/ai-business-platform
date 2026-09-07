    "use client";

import { motion } from "framer-motion";

const particles = [
  { x: 120, y: 150, duration: 8, delay: 0 },
  { x: 350, y: 300, duration: 10, delay: 1 },
  { x: 600, y: 250, duration: 9, delay: 2 },
  { x: 900, y: 450, duration: 11, delay: 3 },
  { x: 1200, y: 350, duration: 8, delay: 4 },
  { x: 1500, y: 550, duration: 10, delay: 5 },
];

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Cyan Aurora */}
      <motion.div
        animate={{
          x: [0, 120, -80, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.3, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[-200px] top-[-150px] h-[700px] w-[700px] rounded-full bg-cyan-500/20 blur-[150px]"
      />

      {/* Purple Aurora */}
      <motion.div
        animate={{
          x: [0, -100, 120, 0],
          y: [0, 80, -50, 0],
          scale: [1.2, 1, 1.25, 1.2],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-250px] top-[50px] h-[750px] w-[750px] rounded-full bg-purple-500/20 blur-[180px]"
      />

      {/* Blue Glow */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-250px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[180px]"
      />

      {/* Floating Particles */}
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute h-2 w-2 rounded-full bg-cyan-300/50 shadow-[0_0_10px_#22d3ee]"
          style={{
            left: particle.x,
            top: particle.y,
          }}
          animate={{
            y: [0, -150],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}