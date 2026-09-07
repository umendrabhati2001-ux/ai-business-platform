"use client";

import { Bot, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AIWidget() {
  const router = useRouter();

  const handleOpenAssistant = () => {
    router.push("/dashboard/ai-assistant");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">

        <div className="rounded-xl bg-cyan-500 p-3">
          <Bot className="text-white" size={24} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            AI Assistant
          </h2>

          <p className="text-slate-400">
            Smart business insights
          </p>
        </div>

      </div>

      {/* Suggestion */}
      <div className="rounded-xl bg-slate-950 p-5">

        <div className="mb-4 flex items-center gap-2 text-cyan-400">

          <Sparkles size={18} />

          <span className="font-semibold">
            Today&apos;s Suggestion
          </span>

        </div>

        <p className="leading-7 text-slate-300">
          Revenue increased by 18% this month.
          AI recommends following up with 12 high-value CRM leads.
        </p>

      </div>

      {/* Open Assistant */}
      <button
        type="button"
        onClick={handleOpenAssistant}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-400"
      >
        Open AI Assistant
        <ArrowRight size={18} />
      </button>

    </div>
  );
}