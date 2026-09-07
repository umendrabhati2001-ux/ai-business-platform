"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Users,
  Bot,
  BarChart3,
  Settings,
  User,
  Plus,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toggleSound, isSoundEnabled, playClickSound } from "@/app/utils/soundEffects";

type CommandItem = {
  id: string;
  title: string;
  subtitle: string;
  category: "Navigation" | "Actions";
  icon: React.ElementType;
  action: () => void;
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleNavigate = (path: string) => {
    playClickSound();
    setIsOpen(false);
    router.push(path);
  };

  const commands: CommandItem[] = [
    {
      id: "nav-dashboard",
      title: "Dashboard Overview",
      subtitle: "View main metrics and activity",
      category: "Navigation",
      icon: LayoutDashboard,
      action: () => handleNavigate("/dashboard"),
    },
    {
      id: "nav-crm",
      title: "CRM Leads & Pipeline",
      subtitle: "Manage live Salesforce customer records",
      category: "Navigation",
      icon: Users,
      action: () => handleNavigate("/dashboard/crm"),
    },
    {
      id: "nav-ai",
      title: "AI Business Assistant",
      subtitle: "Voice command, lead queries & email generator",
      category: "Navigation",
      icon: Bot,
      action: () => handleNavigate("/dashboard/ai-assistant"),
    },
    {
      id: "nav-analytics",
      title: "Analytics & Reports",
      subtitle: "Financial metrics and customer data",
      category: "Navigation",
      icon: BarChart3,
      action: () => handleNavigate("/dashboard/analytics"),
    },
    {
      id: "nav-settings",
      title: "Settings",
      subtitle: "Platform and account configuration",
      category: "Navigation",
      icon: Settings,
      action: () => handleNavigate("/dashboard/settings"),
    },
    {
      id: "nav-profile",
      title: "User Profile",
      subtitle: "Manage personal profile and credentials",
      category: "Navigation",
      icon: User,
      action: () => handleNavigate("/profile"),
    },
    {
      id: "action-add-lead",
      title: "Add New Salesforce Lead",
      subtitle: "Open lead creation dialog in CRM",
      category: "Actions",
      icon: Plus,
      action: () => handleNavigate("/dashboard/crm"),
    },
    {
      id: "action-toggle-sound",
      title: "Toggle UI Sound Effects",
      subtitle: isSoundEnabled() ? "Currently Sound ON" : "Currently Muted",
      category: "Actions",
      icon: isSoundEnabled() ? Volume2 : VolumeX,
      action: () => {
        toggleSound();
        setIsOpen(false);
      },
    },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpenEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDownNavigation = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCommands.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCommands.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center bg-black/75 p-4 pt-20 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-950 shadow-2xl shadow-cyan-500/20"
        onKeyDown={handleKeyDownNavigation}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
          <Search size={18} className="text-cyan-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, page or action..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
          <div className="flex items-center gap-1">
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-white/10">
              ESC
            </kbd>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-all ${
                    isSelected
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-300 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isSelected
                          ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                          : "bg-slate-900 text-slate-400 border border-white/5"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{cmd.title}</p>
                      <p className="text-xs text-slate-500">{cmd.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-400 border border-white/5">
                      {cmd.category}
                    </span>
                    {isSelected && <ArrowRight size={14} className="text-cyan-400" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-white/10 bg-slate-900/60 px-4 py-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded bg-slate-800 px-1 py-0.5 text-[10px] text-slate-300">↑</kbd>{" "}
              <kbd className="rounded bg-slate-800 px-1 py-0.5 text-[10px] text-slate-300">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="rounded bg-slate-800 px-1 py-0.5 text-[10px] text-slate-300">↵</kbd> to select
            </span>
          </div>
          <span className="flex items-center gap-1 text-cyan-400 font-medium">
            <Sparkles size={12} />
            Command Palette
          </span>
        </div>
      </div>
    </div>
  );
}
