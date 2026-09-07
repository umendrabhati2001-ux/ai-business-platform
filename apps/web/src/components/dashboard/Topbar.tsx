"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  X,
  Check,
  User,
  Mail,
  Shield,
  LogOut,
  ChevronRight,
  Volume2,
  VolumeX,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { isSoundEnabled, toggleSound, playClickSound } from "@/app/utils/soundEffects";

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export default function Topbar() {
  const router = useRouter();

  const [fullName, setFullName] = useState("User");
  const [email, setEmail] = useState("");
  const [avatarLetter, setAvatarLetter] = useState("U");

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activePlanName, setActivePlanName] = useState("Growth Pro");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("active_subscription_plan");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.name) setActivePlanName(parsed.name);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    setSoundEnabled(isSoundEnabled());
    const handleSoundToggle = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setSoundEnabled(customEvent.detail);
    };
    window.addEventListener("ui-sound-toggle", handleSoundToggle);
    return () => {
      window.removeEventListener("ui-sound-toggle", handleSoundToggle);
    };
  }, []);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Welcome to AI Platform",
      message: "Your account is ready to use.",
      time: "Just now",
      read: false,
    },
    {
      id: 2,
      title: "Profile updated",
      message: "Your profile information is available.",
      time: "5 min ago",
      read: false,
    },
    {
      id: 3,
      title: "Salesforce data synced",
      message: "Your latest Salesforce records were loaded.",
      time: "15 min ago",
      read: true,
    },
  ]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .single();

        const name =
          profile?.full_name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.display_name ||
          user.email?.split("@")[0] ||
          "User";

        const userEmail = profile?.email || user.email || "";

        setFullName(name);
        setEmail(userEmail);
        setAvatarLetter(name.charAt(0).toUpperCase());
      } catch (error) {
        console.error("TOPBAR USER ERROR:", error);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const openProfile = () => {
    setShowNotifications(false);
    setShowProfile(true);
  };

  const openFullProfile = () => {
    setShowProfile(false);

    // IMPORTANT:
    // Tumhari actual file src/app/profile/page.tsx hai.
    // Isliye URL /profile hoga, /dashboard/profile nahi.
    router.push("/profile");
  };

  return (
    <>
      <header className="relative z-40 flex h-20 items-center justify-between border-b border-white/10 bg-slate-950 px-8">
        {/* SEARCH / COMMAND PALETTE TRIGGER */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            window.dispatchEvent(new CustomEvent("open-command-palette"));
          }}
          className="group flex w-72 md:w-96 items-center justify-between rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-left text-sm text-slate-400 transition hover:border-cyan-500/40 hover:bg-slate-800/80 hover:text-slate-200"
        >
          <div className="flex items-center gap-2.5">
            <Search size={17} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <span>Search or command...</span>
          </div>
          <kbd className="flex items-center gap-1 rounded border border-white/10 bg-slate-950 px-2 py-0.5 text-[11px] font-medium text-slate-400 group-hover:border-cyan-500/30 group-hover:text-cyan-300">
            <span>Ctrl</span>
            <span>K</span>
          </kbd>
        </button>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* ACTIVE SUBSCRIPTION PLAN BADGE */}
          <Link
            href="/dashboard/pricing"
            onClick={playClickSound}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-purple-500/15 px-3 py-2 text-xs font-bold text-cyan-300 shadow-sm shadow-cyan-500/15 transition hover:border-cyan-400 hover:shadow-cyan-500/30"
            title="Manage Subscription & Upgrades"
          >
            <Sparkles size={13} className="text-cyan-400 animate-pulse" />
            <span className="uppercase tracking-wider">
              {activePlanName}
            </span>
          </Link>

          {/* SOUND EFFECTS TOGGLE */}
          <button
            type="button"
            onClick={() => {
              const next = toggleSound();
              setSoundEnabled(next);
            }}
            className="group relative rounded-xl border border-white/5 bg-slate-900 p-3 text-slate-300 transition-all duration-200 hover:border-cyan-500/40 hover:bg-slate-800 hover:shadow-[0_0_12px_rgba(6,182,212,0.25)]"
            title={soundEnabled ? "Mute UI Sounds" : "Unmute UI Sounds"}
          >
            {soundEnabled ? (
              <Volume2 size={20} className="text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.7)]" />
            ) : (
              <VolumeX size={20} className="text-slate-500" />
            )}
            <span className="sr-only">Toggle UI Sounds</span>
          </button>

          {/* NOTIFICATION */}
          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications((value) => !value);
                setShowProfile(false);
              }}
              className="relative rounded-xl bg-slate-900 p-3 text-slate-300 transition hover:bg-cyan-500 hover:text-white"
            >
              <Bell size={20} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN */}
            {showNotifications && (
              <div className="absolute right-0 top-14 w-[380px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/50">
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div>
                    <h3 className="font-semibold text-white">
                      Notifications
                    </h3>

                    <p className="text-xs text-slate-500">
                      {unreadCount} unread notification
                      {unreadCount !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    Mark all read
                  </button>
                </div>

                {/* NOTIFICATIONS */}
                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                      <div className="mb-3 rounded-full bg-slate-900 p-4">
                        <Check className="text-green-400" size={25} />
                      </div>

                      <p className="font-medium text-white">
                        You&apos;re all caught up
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        No new notifications.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        className={`flex w-full gap-4 border-b border-white/5 px-5 py-4 text-left transition hover:bg-slate-900 ${
                          !notification.read ? "bg-cyan-500/5" : ""
                        }`}
                      >
                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                          <Bell
                            size={17}
                            className="text-cyan-400"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-white">
                              {notification.title}
                            </p>

                            {!notification.read && (
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                            )}
                          </div>

                          <p className="mt-1 text-xs leading-5 text-slate-400">
                            {notification.message}
                          </p>

                          <p className="mt-2 text-[11px] text-slate-600">
                            {notification.time}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* FOOTER */}
                {notifications.length > 0 && (
                  <div className="border-t border-white/10 px-5 py-3">
                    <button
                      type="button"
                      onClick={clearNotifications}
                      className="text-xs text-slate-500 transition hover:text-red-400"
                    >
                      Clear notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={openProfile}
              className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-900"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500 font-bold text-white">
                {avatarLetter}
              </div>

              <div className="text-left">
                <h4 className="font-semibold text-white">
                  {fullName}
                </h4>

                <p className="text-sm text-slate-400">
                  Admin
                </p>
              </div>
            </button>

            {/* PROFILE SIDE PANEL */}
            {showProfile && (
              <>
                {/* BACKDROP */}
                <div
                  className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowProfile(false)}
                />

                {/* PANEL */}
                <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-white/10 bg-[#020617] shadow-2xl">
                  {/* PANEL HEADER */}
                  <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        My Profile
                      </h2>

                      <p className="text-sm text-slate-400">
                        Account information
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowProfile(false)}
                      className="rounded-xl bg-slate-900 p-3 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* PROFILE CONTENT */}
                  <div className="flex-1 overflow-y-auto px-6 py-7">
                    {/* AVATAR */}
                    <div className="mb-7 flex flex-col items-center text-center">
                      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-cyan-500 text-5xl font-bold text-white shadow-xl shadow-cyan-500/20">
                        {avatarLetter}
                      </div>

                      <h2 className="mt-4 text-2xl font-bold text-white">
                        {fullName}
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        AI Business Platform User
                      </p>

                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                        <span className="h-2 w-2 rounded-full bg-green-400" />
                        Active
                      </div>
                    </div>

                    {/* FULL NAME */}
                    <div className="mb-4 rounded-2xl border border-white/10 bg-slate-900 p-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-cyan-500/10 p-3">
                          <User
                            size={20}
                            className="text-cyan-400"
                          />
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500">
                            Full Name
                          </p>

                          <p className="mt-1 font-semibold text-white">
                            {fullName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div className="mb-4 rounded-2xl border border-white/10 bg-slate-900 p-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-cyan-500/10 p-3">
                          <Mail
                            size={20}
                            className="text-cyan-400"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-wider text-slate-500">
                            Email Address
                          </p>

                          <p className="mt-1 break-all font-semibold text-white">
                            {email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ROLE */}
                    <div className="mb-4 rounded-2xl border border-white/10 bg-slate-900 p-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-purple-500/10 p-3">
                          <Shield
                            size={20}
                            className="text-purple-400"
                          />
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500">
                            Role
                          </p>

                          <p className="mt-1 font-semibold text-white">
                            Admin
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* STATUS */}
                    <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900 p-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-green-500/10 p-3">
                          <Shield
                            size={20}
                            className="text-green-400"
                          />
                        </div>

                        <div className="flex-1">
                          <p className="text-xs uppercase tracking-wider text-slate-500">
                            Account Status
                          </p>

                          <p className="mt-1 font-semibold text-green-400">
                            Active
                          </p>
                        </div>

                        <span className="h-3 w-3 rounded-full bg-green-400 shadow-lg shadow-green-400/40" />
                      </div>
                    </div>

                    {/* FULL PROFILE */}
                    <button
                      type="button"
                      onClick={openFullProfile}
                      className="group mb-4 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-900 p-4 text-left transition hover:border-cyan-500/50 hover:bg-cyan-500/5"
                    >
                      <div>
                        <p className="font-semibold text-white">
                          View Full Profile
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Manage your profile information
                        </p>
                      </div>

                      <ChevronRight
                        size={20}
                        className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                      />
                    </button>

                    {/* LOGOUT */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-4 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </div>
                </aside>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}