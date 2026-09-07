"use client";

const activities = [
  {
    title: "New Lead Added",
    time: "2 min ago",
  },
  {
    title: "AI Generated Report",
    time: "15 min ago",
  },
  {
    title: "Salesforce Synced",
    time: "1 hour ago",
  },
  {
    title: "New User Registered",
    time: "Today",
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Recent Activity
      </h2>

      <div className="space-y-5">
        {activities.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between rounded-xl bg-slate-950 p-4"
          >
            <div>
              <h4 className="font-semibold text-white">
                {item.title}
              </h4>

              <p className="text-sm text-slate-400">
                {item.time}
              </p>
            </div>

            <div className="h-3 w-3 rounded-full bg-cyan-400" />
          </div>
        ))}
      </div>
    </div>
  );
}