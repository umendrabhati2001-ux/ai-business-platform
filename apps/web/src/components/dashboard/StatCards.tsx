"use client";

import {
  DollarSign,
  Users,
  Bot,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Revenue",
    value: "₹12.5L",
    icon: <DollarSign size={28} />,
  },
  {
    title: "Users",
    value: "12,845",
    icon: <Users size={28} />,
  },
  {
    title: "AI Requests",
    value: "85K",
    icon: <Bot size={28} />,
  },
  {
    title: "Growth",
    value: "+32%",
    icon: <TrendingUp size={28} />,
  },
];

export default function StatCards() {
  return (
    <div className="grid gap-6 p-8 md:grid-cols-2 xl:grid-cols-2">

      {stats.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-white/10 bg-slate-900 p-6 min-h-[180px] transition-all duration-300 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20"
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500 text-white">
            {item.icon}
          </div>

          <h4 className="text-slate-400">
            {item.title}
          </h4>

          <h2 className="mt-2 text-3xl font-bold text-white">
            {item.value}
          </h2>

        </div>
      ))}

    </div>
  );
}