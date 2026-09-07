"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

const menuItems = [
  "Home",
  "Features",
  "Pricing",
  "Docs",
  "Contact",
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed left-0 right-0 top-0 z-50"
    >
      <div className="mx-auto mt-4 flex h-20 max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 backdrop-blur-xl">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-bold text-white shadow-lg shadow-cyan-500/30">
            AI
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              AI Business Platform
            </h1>

            <p className="text-xs text-slate-400">
              Enterprise SaaS
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="hidden items-center gap-8 md:flex">
          {menuItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-slate-300 transition-all duration-300 hover:text-cyan-400"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="secondary">
            Login
          </Button>

          <Button variant="primary">
            Get Started
          </Button>
        </div>

      </div>
    </motion.header>
  );
}