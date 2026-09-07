"use client";

import { Bell } from "lucide-react";

const notifications = [
  {
    title: "New user registered",
    time: "2 min ago",
  },
  {
    title: "AI generated monthly report",
    time: "15 min ago",
  },
  {
    title: "CRM synced successfully",
    time: "30 min ago",
  },
  {
    title: "Subscription renewed",
    time: "Today",
  },
];

export default function NotificationPanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

      <div className="mb-6 flex items-center gap-3">

        <Bell className="text-cyan-400" size={24} />

        <h2 className="text-2xl font-bold text-white">
          Notifications
        </h2>

      </div>

      <div className="space-y-4">

        {notifications.map((item) => (

          <div
            key={item.title}
            className="rounded-xl bg-slate-950 p-4 transition hover:border hover:border-cyan-500"
          >

            <h3 className="font-semibold text-white">
              {item.title}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {item.time}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}