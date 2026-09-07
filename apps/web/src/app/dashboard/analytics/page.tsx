import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase-server";

import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  ShoppingCart,
  Activity,
} from "lucide-react";

const revenueData = [
  { month: "Jan", value: 45 },
  { month: "Feb", value: 52 },
  { month: "Mar", value: 48 },
  { month: "Apr", value: 68 },
  { month: "May", value: 74 },
  { month: "Jun", value: 82 },
  { month: "Jul", value: 96 },
  { month: "Aug", value: 110 },
];

const performanceData = [
  {
    label: "New Leads",
    value: 42,
    color: "bg-cyan-500",
  },
  {
    label: "Qualified Leads",
    value: 68,
    color: "bg-blue-500",
  },
  {
    label: "Converted",
    value: 84,
    color: "bg-emerald-500",
  },
  {
    label: "Customer Retention",
    value: 76,
    color: "bg-violet-500",
  },
];

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const maxRevenue = Math.max(...revenueData.map((item) => item.value));

  return (
    <main className="flex min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />

      <Sidebar />

      <section className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Topbar />

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-cyan-400">
                BUSINESS INTELLIGENCE
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Analytics
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                Track your business performance, revenue, customers and growth
                from one place.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3">
              <p className="text-xs text-slate-500">Reporting period</p>
              <p className="mt-1 text-sm font-semibold text-white">
                January - August 2026
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {/* Revenue */}
            <div className="group rounded-2xl border border-white/10 bg-slate-900/80 p-5 transition hover:-translate-y-1 hover:border-cyan-500/40">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                  <DollarSign size={24} />
                </div>

                <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                  <ArrowUpRight size={14} />
                  18.4%
                </div>
              </div>

              <p className="mt-5 text-sm text-slate-400">
                Total Revenue
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight">
                ₹12.5L
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Compared with previous month
              </p>
            </div>

            {/* Users */}
            <div className="group rounded-2xl border border-white/10 bg-slate-900/80 p-5 transition hover:-translate-y-1 hover:border-blue-500/40">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                  <Users size={24} />
                </div>

                <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                  <ArrowUpRight size={14} />
                  12.8%
                </div>
              </div>

              <p className="mt-5 text-sm text-slate-400">
                Total Customers
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight">
                12,845
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Active customers this month
              </p>
            </div>

            {/* Conversion */}
            <div className="group rounded-2xl border border-white/10 bg-slate-900/80 p-5 transition hover:-translate-y-1 hover:border-violet-500/40">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                  <Target size={24} />
                </div>

                <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                  <ArrowUpRight size={14} />
                  8.2%
                </div>
              </div>

              <p className="mt-5 text-sm text-slate-400">
                Conversion Rate
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight">
                68.4%
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Lead to customer conversion
              </p>
            </div>

            {/* Growth */}
            <div className="group rounded-2xl border border-white/10 bg-slate-900/80 p-5 transition hover:-translate-y-1 hover:border-emerald-500/40">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                  <TrendingUp size={24} />
                </div>

                <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                  <ArrowUpRight size={14} />
                  32%
                </div>
              </div>

              <p className="mt-5 text-sm text-slate-400">
                Business Growth
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight">
                +32%
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                Growth compared with last month
              </p>
            </div>
          </div>

          {/* Revenue Analytics */}
          <div className="mb-8 rounded-2xl border border-white/10 bg-slate-900/80 p-5 sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Revenue Analytics
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Monthly revenue performance
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="text-xs text-slate-400">
                  Revenue trend
                </span>
              </div>
            </div>

            {/* Chart */}
            <div className="relative h-[330px] w-full overflow-hidden rounded-xl bg-slate-950 p-4 sm:p-6">
              {/* Horizontal grid */}
              <div className="pointer-events-none absolute inset-x-6 top-6 bottom-12 flex flex-col justify-between">
                <div className="border-t border-white/5" />
                <div className="border-t border-white/5" />
                <div className="border-t border-white/5" />
                <div className="border-t border-white/5" />
                <div className="border-t border-white/5" />
              </div>

              {/* SVG Line */}
              <svg
                viewBox="0 0 800 250"
                className="absolute inset-x-5 top-5 h-[250px] w-[calc(100%-40px)]"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="rgb(6,182,212)"
                      stopOpacity="0.35"
                    />

                    <stop
                      offset="100%"
                      stopColor="rgb(6,182,212)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {/* Area */}
                <path
                  d={`
                    M 0 220
                    ${revenueData
                      .map((item, index) => {
                        const x =
                          (index / (revenueData.length - 1)) * 800;

                        const y =
                          220 -
                          (item.value / maxRevenue) * 180;

                        return `L ${x} ${y}`;
                      })
                      .join(" ")}
                    L 800 220
                    Z
                  `}
                  fill="url(#revenueGradient)"
                />

                {/* Line */}
                <path
                  d={`
                    M 0 ${
                      220 -
                      (revenueData[0].value / maxRevenue) * 180
                    }
                    ${revenueData
                      .slice(1)
                      .map((item, index) => {
                        const actualIndex = index + 1;

                        const x =
                          (actualIndex /
                            (revenueData.length - 1)) *
                          800;

                        const y =
                          220 -
                          (item.value / maxRevenue) * 180;

                        return `L ${x} ${y}`;
                      })
                      .join(" ")}
                  `}
                  fill="none"
                  stroke="rgb(6,182,212)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points */}
                {revenueData.map((item, index) => {
                  const x =
                    (index / (revenueData.length - 1)) * 800;

                  const y =
                    220 -
                    (item.value / maxRevenue) * 180;

                  return (
                    <circle
                      key={item.month}
                      cx={x}
                      cy={y}
                      r="5"
                      fill="rgb(6,182,212)"
                      stroke="rgb(2,6,23)"
                      strokeWidth="3"
                    />
                  );
                })}
              </svg>

              {/* Month labels */}
              <div className="absolute bottom-3 left-6 right-6 flex justify-between">
                {revenueData.map((item) => (
                  <span
                    key={item.month}
                    className="text-xs text-slate-500"
                  >
                    {item.month}
                  </span>
                ))}
              </div>
            </div>

            {/* Chart bottom stats */}
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  Current Revenue
                </p>

                <p className="mt-1 text-lg font-semibold">
                  ₹12.5L
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  Highest Month
                </p>

                <p className="mt-1 text-lg font-semibold">
                  August
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  Overall Growth
                </p>

                <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-emerald-400">
                  <TrendingUp size={18} />
                  +32%
                </p>
              </div>
            </div>
          </div>

          {/* Lower Analytics */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Lead Performance */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 sm:p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold">
                  Lead Performance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track your sales funnel performance.
                </p>
              </div>

              <div className="space-y-6">
                {performanceData.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-slate-300">
                        {item.label}
                      </span>

                      <span className="text-sm font-semibold text-white">
                        {item.value}%
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all`}
                        style={{
                          width: `${item.value}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4">
                <div className="flex gap-3">
                  <Activity
                    size={20}
                    className="mt-0.5 shrink-0 text-cyan-400"
                  />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Performance insight
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Your conversion performance is strong. Focus on
                      improving lead qualification to increase overall
                      sales efficiency.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Summary */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 sm:p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold">
                  Monthly Summary
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Key business metrics for this month.
                </p>
              </div>

              <div className="space-y-3">
                {/* Revenue */}
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                      <DollarSign size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Revenue
                      </p>

                      <p className="text-xs text-slate-500">
                        Total monthly revenue
                      </p>
                    </div>
                  </div>

                  <span className="font-semibold text-white">
                    ₹12.5L
                  </span>
                </div>

                {/* Customers */}
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      <UserPlus size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        New Customers
                      </p>

                      <p className="text-xs text-slate-500">
                        Newly acquired customers
                      </p>
                    </div>
                  </div>

                  <span className="font-semibold text-white">
                    248
                  </span>
                </div>

                {/* Leads */}
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                      <Target size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Qualified Leads
                      </p>

                      <p className="text-xs text-slate-500">
                        High-quality sales opportunities
                      </p>
                    </div>
                  </div>

                  <span className="font-semibold text-white">
                    126
                  </span>
                </div>

                {/* Orders */}
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <ShoppingCart size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Completed Sales
                      </p>

                      <p className="text-xs text-slate-500">
                        Successfully closed deals
                      </p>
                    </div>
                  </div>

                  <span className="font-semibold text-white">
                    184
                  </span>
                </div>
              </div>

              {/* Growth box */}
              <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                <div>
                  <p className="text-sm font-semibold">
                    Monthly Growth
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Business performance is improving
                  </p>
                </div>

                <div className="flex items-center gap-1 text-lg font-bold text-emerald-400">
                  <TrendingUp size={20} />
                  +32%
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Insight */}
          <div className="mt-8 rounded-2xl border border-cyan-500/10 bg-gradient-to-r from-cyan-500/10 via-slate-900 to-slate-900 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  AI Business Insight
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  Revenue and customer growth are trending positively.
                </h3>

                <p className="mt-1 max-w-2xl text-sm text-slate-400">
                  Continue focusing on qualified leads and customer
                  retention to maintain the current growth trajectory.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400">
                <TrendingUp size={18} />
                Positive Trend
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}