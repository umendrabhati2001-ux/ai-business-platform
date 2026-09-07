"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", revenue: 400 },
  { month: "Feb", revenue: 520 },
  { month: "Mar", revenue: 610 },
  { month: "Apr", revenue: 720 },
  { month: "May", revenue: 850 },
  { month: "Jun", revenue: 800 },
  { month: "Jul", revenue: 950 },
  { month: "Aug", revenue: 1100 },
  { month: "Sep", revenue: 1200 },
  { month: "Oct", revenue: 1300 },
  { month: "Nov", revenue: 1400 },
  { month: "Dec", revenue: 1500 },
  
];

export default function RevenueLineChart() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold text-white">
        Revenue Analytics
      </h2>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis dataKey="month" stroke="#94a3b8" />

            <YAxis stroke="#94a3b8" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#06b6d4"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}