"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is AI Business Platform?",
    answer:
      "AI Business Platform is an all-in-one SaaS solution that combines AI, Salesforce CRM, Analytics, Automation, Dashboard, Mobile Apps and Enterprise tools in one platform.",
  },
  {
    question: "Can I use it on Android, iOS and Web?",
    answer:
      "Yes. The same platform supports Web, Android and iOS. Everything works from a single backend and unified dashboard.",
  },
  {
    question: "Does it support Salesforce CRM?",
    answer:
      "Absolutely. Salesforce integration is one of the core modules. You can manage Leads, Accounts, Contacts, Opportunities and Automation.",
  },
  {
    question: "Can I upgrade my plan anytime?",
    answer:
      "Yes. You can switch between Starter, Pro and Enterprise plans whenever you want without losing your data.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative bg-slate-950 py-28 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-blue-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 font-semibold uppercase tracking-[6px] text-cyan-400">
            FAQ
          </p>

          <h2 className="text-5xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                layout
                transition={{ duration: 0.35 }}
                className={`overflow-hidden rounded-3xl border transition-all duration-300 ${
                  isOpen
                    ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_35px_rgba(34,211,238,0.18)]"
                    : "border-white/10 bg-white/5 hover:border-cyan-400/50"
                }`}
              >
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between px-8 py-6 text-left"
                >
                  <h3 className="text-xl font-bold text-white">
                    {faq.question}
                  </h3>

                  <motion.div
                    animate={{
                      rotate: isOpen ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown
                      size={28}
                      className="text-cyan-400"
                    />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.35,
                      }}
                    >
                      <div className="border-t border-white/10 px-8 pb-8 pt-5">
                        <p className="leading-8 text-slate-300">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}