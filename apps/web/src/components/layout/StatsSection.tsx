export default function StatsSection() {
  const stats = [
    {
      value: "25K+",
      title: "Active Users",
    },
    {
      value: "100+",
      title: "AI Tools",
    },
    {
      value: "99.99%",
      title: "Uptime",
    },
    {
      value: "24/7",
      title: "Support",
    },
  ];

  return (
    <section className="bg-slate-900 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-700 bg-slate-950 p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400"
          >
            <h2 className="mb-2 text-4xl font-bold text-cyan-400">
              {item.value}
            </h2>

            <p className="text-slate-300">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}