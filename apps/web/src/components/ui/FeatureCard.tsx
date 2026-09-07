"use client";

import { motion } from "framer-motion";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.03,
      }}
      transition={{
        duration: 0.3,
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      {/* Glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl transition-all duration-500 group-hover:bg-cyan-500/20" />

      {/* Icon */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 transition-all duration-300 group-hover:bg-cyan-500 group-hover:text-white">
        {icon}
      </div>

      {/* Title */}
      <h3 className="mb-3 text-2xl font-bold text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="leading-7 text-slate-400">
        {description}
      </p>

      {/* Bottom Line */}
      <div className="mt-8 h-1 w-0 rounded-full bg-cyan-400 transition-all duration-500 group-hover:w-full" />
    </motion.div>
  );
}