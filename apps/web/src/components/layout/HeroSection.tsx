"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import StatsSection from "@/components/layout/StatsSection";
import FeaturesSection from "@/components/layout/FeaturesSection";
import DashboardPreview from "@/components/layout/DashboardPreview";
import TestimonialsSection from "@/components/layout/TestimonialsSection";
import FAQSection from "@/components/layout/FAQSection";
import Footer from "@/components/layout/Footer";
import PricingSection from "@/components/layout/PricingSection";
import Button from "@/components/ui/Button";
// Provide a local fallback for AnimatedBackground to avoid module not found during development
// Replace with the real import when the component exists at '@/components/ui/AnimatedBackground'
const AnimatedBackground = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-950 to-black opacity-60" />
);
import HowItWorks from "@/components/layout/HowItWorks";

export default function HeroSection() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 pt-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-4 inline-block rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            🚀 AI Business Platform
          </p>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight md:text-7xl">
            Build Your Business
            <br />
            <span className="text-cyan-400">Powered by AI</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300">
            One platform for Web, Android, iOS and Salesforce integration.
            CRM, AI Assistant, Dashboard, Automation and much more — all in one
            place.
          </p>

          <div className="flex justify-center gap-4">
            <Button variant="primary">
              Get Started
            </Button>

            <Button variant="secondary">
              Learn More
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <StatsSection />

      {/* Features */}
      <FeaturesSection />

      {/* Dashboard */}
      <DashboardPreview />
      {/* How It Works */}
      <HowItWorks />
      {/* Pricing */}
    <PricingSection />
    <TestimonialsSection />
    <FAQSection />
    <Footer />
    </main>
  );
}