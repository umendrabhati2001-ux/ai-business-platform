"use client";

export default function CalendarWidget() {
  const events = [
    {
      title: "Team Meeting",
      date: "2026-08-12",
    },
    {
      title: "Project Deadline",
      date: "2026-08-15",
    },
    {
      title: "Client Presentation",
      date: "2026-08-20",
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Upcoming Events
      </h2>

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.title}
            className="flex items-center justify-between rounded-xl bg-slate-950 p-4 transition hover:bg-slate-800"
          >
            <span className="text-white">{event.title}</span>

            <span className="text-sm text-slate-400">
              {event.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}