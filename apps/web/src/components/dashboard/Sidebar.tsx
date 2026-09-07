"use client";

import {
  LayoutDashboard,
  Bot,
  Users,
  BarChart3,
  Settings,
  User,
  LogOut,
  Workflow,
  CreditCard,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

const menuItems = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    path: "/dashboard/ai-assistant",
  },
  {
    icon: Workflow,
    title: "Workflows",
    path: "/dashboard/workflows",
  },
  {
    icon: Users,
    title: "CRM",
    path: "/dashboard/crm",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    path: "/dashboard/analytics",
  },
  {
    icon: CreditCard,
    title: "Pricing & Plans",
    path: "/dashboard/pricing",
  },
  {
    icon: User,
    title: "Profile",
    path: "/profile",
  },
  {
    icon: Settings,
    title: "Settings",
    path: "/dashboard/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-white/10 bg-[#020617]">
      
      {/* Logo */}
      <div className="border-b border-white/10 p-6">
        <h1 className="text-2xl font-bold text-cyan-400">
          AI Platform
        </h1>
      </div>

      {/* Menu */}
      <div className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.path ||
            (item.path !== "/dashboard" &&
              pathname.startsWith(`${item.path}/`));

          return (
            <Link
              key={item.title}
              href={item.path}
              className={`mb-2 flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? "bg-cyan-500 text-white"
                  : "text-slate-300 hover:bg-cyan-500 hover:text-white"
              }`}
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500 hover:text-white"
        >
          <LogOut size={20} />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}