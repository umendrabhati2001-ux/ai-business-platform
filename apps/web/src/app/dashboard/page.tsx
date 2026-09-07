import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import StatCards from "@/components/dashboard/StatCards";
import RevenueLineChart from "@/components/dashboard/RevenueLineChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AIWidget from "@/components/dashboard/AIWidget";
import CRMTable from "@/components/dashboard/CRMTable";
import NotificationPanel from "@/components/dashboard/NotificationPanel";
import TaskManager from "@/components/dashboard/TaskManager";
import CalendarWidget from "@/components/dashboard/CalendarWidget";
import QuickActions from "@/components/dashboard/QuickActions";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="relative flex min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <section className="flex flex-1 flex-col">
        {/* Topbar */}
        <Topbar />

        {/* Dashboard Content */}
        <div className="flex-1">
          <StatCards />

          <div className="grid gap-8 px-8 pb-8 lg:grid-cols-2">
            <RevenueLineChart />

            <RecentActivity />

            <AIWidget />

            <CRMTable />

            <NotificationPanel />

            <TaskManager />

            <CalendarWidget />

            <QuickActions />
          </div>
        </div>
      </section>
    </main>
  );
}