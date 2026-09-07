"use client";

export default function RevenueChart() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

      <h2 className="mb-2 text-2xl font-bold text-white">
        Revenue Overview
      </h2>

      <p className="mb-8 text-slate-400">
        Monthly revenue performance
      </p>

      <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-cyan-500 bg-slate-950">

        <h3 className="text-2xl font-bold text-cyan-400">
          📈 Revenue Chart
        </h3>

      </div>

    </div>
  );
}