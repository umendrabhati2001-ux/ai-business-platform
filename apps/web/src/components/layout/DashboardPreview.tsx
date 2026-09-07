export default function DashboardPreview() {
  return (
    <section className="bg-slate-900 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">
          <p className="mb-3 font-semibold uppercase tracking-widest text-cyan-400">
            DASHBOARD
          </p>

          <h2 className="text-4xl font-extrabold text-white md:text-5xl">
            Powerful Business Dashboard
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            Manage your CRM, AI Assistant, analytics and automation from one
            beautiful dashboard.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-950 p-8 shadow-2xl">

          <div className="mb-8 grid gap-6 md:grid-cols-4">

            <div className="rounded-2xl bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Revenue</p>
              <h3 className="mt-2 text-3xl font-bold text-cyan-400">$54K</h3>
            </div>

            <div className="rounded-2xl bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Users</p>
              <h3 className="mt-2 text-3xl font-bold text-cyan-400">25K</h3>
            </div>

            <div className="rounded-2xl bg-slate-900 p-6">
              <p className="text-sm text-slate-400">AI Requests</p>
              <h3 className="mt-2 text-3xl font-bold text-cyan-400">18K</h3>
            </div>

            <div className="rounded-2xl bg-slate-900 p-6">
              <p className="text-sm text-slate-400">CRM Leads</p>
              <h3 className="mt-2 text-3xl font-bold text-cyan-400">345</h3>
            </div>

          </div>

          <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-cyan-500 bg-slate-900">
            <h3 className="text-3xl font-bold text-cyan-400">
              📈 Dashboard Chart Preview
            </h3>
          </div>

        </div>

      </div>
    </section>
  );
}