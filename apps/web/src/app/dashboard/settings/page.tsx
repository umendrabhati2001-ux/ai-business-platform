"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

import {
  User,
  Bell,
  Lock,
  Palette,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

export default function SettingsPage() {
  // =========================
  // PROFILE
  // =========================
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // =========================
  // SETTINGS
  // =========================
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // =========================
  // LOADING
  // =========================
  const [saving, setSaving] = useState(false);

  // =========================
  // PASSWORD
  // =========================
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);

  // =========================
  // MESSAGES
  // =========================
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // =========================
  // 2FA
  // =========================
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // =========================
  // SUPABASE
  // =========================
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );

  // =========================
  // LOAD USER + THEME
  // =========================
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setEmail(user.email ?? "");

      setName(
        user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          ""
      );
    };

    loadUser();

    // =========================
    // LOAD SAVED THEME
    // =========================
    const savedTheme = localStorage.getItem("theme");

    const isDark = savedTheme !== "light";

    setDarkMode(isDark);

    document.documentElement.classList.toggle(
      "dark",
      isDark
    );

    document.documentElement.classList.toggle(
      "light",
      !isDark
    );
  }, [supabase]);

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: name.trim(),
      },
    });

    setSaving(false);

    if (error) {
      console.error(error);
      setErrorMessage(error.message);
      return;
    }

    setMessage("Profile updated successfully!");
  };

  // =========================
  // CHANGE PASSWORD
  // =========================
  const handleChangePassword = async () => {
    setMessage("");
    setErrorMessage("");

    if (newPassword.length < 6) {
      setErrorMessage(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(
        "New password and confirm password do not match."
      );
      return;
    }

    setChangingPassword(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setChangingPassword(false);

    if (error) {
      console.error(error);
      setErrorMessage(error.message);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordModal(false);

    setMessage("Password changed successfully!");
  };

  // =========================
  // NOTIFICATIONS
  // =========================
  const toggleNotifications = () => {
    setNotifications((current) => !current);

    setMessage(
      notifications
        ? "Notifications turned off."
        : "Notifications turned on."
    );
  };

  // =========================
  // GLOBAL DARK MODE
  // =========================
  const toggleDarkMode = () => {
    setDarkMode((current) => {
      const newMode = !current;

      // Save preference
      localStorage.setItem(
        "theme",
        newMode ? "dark" : "light"
      );

      // Apply globally
      document.documentElement.classList.toggle(
        "dark",
        newMode
      );

      document.documentElement.classList.toggle(
        "light",
        !newMode
      );

      return newMode;
    });
  };

  return (
    <main
      className={`flex min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <section className="relative z-10 flex flex-1 flex-col">
        {/* Topbar */}
        <Topbar />

        {/* Content */}
        <div className="flex-1 p-8">
          {/* =========================
              HEADER
          ========================= */}
          <div className="mb-8">
            <h1
              className={`text-3xl font-bold ${
                darkMode
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              Settings
            </h1>

            <p
              className={`mt-2 ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-600"
              }`}
            >
              Manage your account and application
              preferences.
            </p>
          </div>

          {/* =========================
              SUCCESS MESSAGE
          ========================= */}
          {message && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">
              <CheckCircle size={20} />
              <span>{message}</span>
            </div>
          )}

          {/* =========================
              ERROR MESSAGE
          ========================= */}
          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
              {errorMessage}
            </div>
          )}

          {/* =========================
              SETTINGS GRID
          ========================= */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* =========================
                PROFILE
            ========================= */}
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 lg:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500">
                  <User size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white">
                    Profile
                  </h2>

                  <p className="text-sm text-slate-400">
                    Update your personal information.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setMessage("");
                      setErrorMessage("");
                    }}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-slate-400 outline-none"
                  />
                </div>

                {/* Save */}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={18} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>

            {/* =========================
                ACCOUNT
            ========================= */}
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500">
                  <Lock size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white">
                    Account
                  </h2>

                  <p className="text-sm text-slate-400">
                    Account security.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Change Password */}
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(true);
                    setMessage("");
                    setErrorMessage("");
                  }}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-left text-sm font-semibold text-white transition hover:border-cyan-500"
                >
                  Change Password
                </button>

                {/* 2FA */}
                <button
                  type="button"
                  onClick={() => {
                    setTwoFactorEnabled(
                      (current) => !current
                    );

                    setMessage(
                      twoFactorEnabled
                        ? "Two-factor authentication disabled."
                        : "Two-factor authentication enabled for this session."
                    );
                  }}
                  className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-left text-sm font-semibold text-white transition hover:border-cyan-500"
                >
                  <ShieldCheck size={18} />

                  {twoFactorEnabled
                    ? "2FA Enabled"
                    : "Enable Two-Factor Authentication"}
                </button>
              </div>
            </div>

            {/* =========================
                NOTIFICATIONS
            ========================= */}
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500">
                  <Bell size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white">
                    Notifications
                  </h2>

                  <p className="text-sm text-slate-400">
                    Control notification preferences.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-950 p-4">
                <div>
                  <p className="font-semibold text-white">
                    Push Notifications
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Receive important updates.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleNotifications}
                  className={`relative h-7 w-12 rounded-full transition ${
                    notifications
                      ? "bg-cyan-500"
                      : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      notifications
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* =========================
                APPEARANCE
            ========================= */}
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500">
                  <Palette size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white">
                    Appearance
                  </h2>

                  <p className="text-sm text-slate-400">
                    Customize your dashboard.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-950 p-4">
                <div>
                  <p className="font-semibold text-white">
                    Dark Mode
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Use the dark dashboard theme.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className={`relative h-7 w-12 rounded-full transition ${
                    darkMode
                      ? "bg-cyan-500"
                      : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      darkMode
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* =========================
                SYSTEM STATUS
            ========================= */}
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h2 className="mb-5 text-xl font-bold text-white">
                System Status
              </h2>

              <div className="space-y-4">
                {/* Authentication */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Authentication
                  </span>

                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">
                    Active
                  </span>
                </div>

                {/* Database */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Database
                  </span>

                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">
                    Connected
                  </span>
                </div>

                {/* Dashboard */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Dashboard
                  </span>

                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CHANGE PASSWORD MODAL
      ========================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                Change Password
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Enter your new password below.
              </p>
            </div>

            <div className="space-y-5">
              {/* New Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showNewPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-slate-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={
                    changingPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {changingPassword
                    ? "Updating..."
                    : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}