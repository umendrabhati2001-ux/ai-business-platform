"use client";

import { useState, useRef } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import {
  Workflow,
  Play,
  CheckCircle2,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Sparkles,
  GitBranch,
  ArrowDown,
  Layers,
  Zap,
  Sliders,
  RotateCcw,
  Plus,
  Save,
  Check,
  Calendar,
  Building2,
  User,
} from "lucide-react";
import {
  playClickSound,
  playSuccessSound,
  playAiChime,
} from "@/app/utils/soundEffects";

type ExecutionStep =
  | "idle"
  | "trigger"
  | "ai_dial"
  | "decision"
  | "schedule_demo"
  | "whatsapp_confirm"
  | "crm_update"
  | "completed";

export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState<"canvas" | "logs" | "settings">("canvas");
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState<ExecutionStep>("idle");
  const [executionLogs, setExecutionLogs] = useState<
    { time: string; text: string; type: "info" | "success" | "warning" }[]
  >([]);
  const [isSaved, setIsSaved] = useState(false);

  // Workflow Config state
  const [workflowConfig, setWorkflowConfig] = useState({
    dialDelay: "30",
    voiceAccent: "indian",
    autoUpdateCrm: true,
    sendWhatsapp: true,
    sendEmailFallback: true,
  });

  const logTimerRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = (
    text: string,
    type: "info" | "success" | "warning" = "info"
  ) => {
    const time = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setExecutionLogs((prev) => [{ time, text, type }, ...prev]);
  };

  const runTestExecution = () => {
    if (isSimulating) return;
    playClickSound();
    setIsSimulating(true);
    setCurrentStep("trigger");
    setExecutionLogs([]);

    addLog("🚀 Workflow Execution Initiated...", "info");
    addLog("⚡ Event Trigger: New Lead Form submitted by Rahul Sharma (Apex Technologies)", "info");

    // Step 1: Trigger -> AI Dial (after 1.2s)
    setTimeout(() => {
      playAiChime();
      setCurrentStep("ai_dial");
      addLog("📞 AI Voice Assistant activated. Dialing Rahul Sharma (+91 7850051826)...", "info");

      // Step 2: AI Dial -> Decision Fork (after 2.5s)
      setTimeout(() => {
        setCurrentStep("decision");
        addLog("🤝 Call Connected! AI executing autonomous qualification script...", "info");

        // Step 3: Decision -> Schedule Demo (after 3.8s)
        setTimeout(() => {
          setCurrentStep("schedule_demo");
          addLog("📅 High Buying Intent detected (96%)! AI confirmed 15-min Demo for Thursday 2:00 PM", "success");

          // Step 4: Schedule Demo -> WhatsApp Confirm (after 5.0s)
          setTimeout(() => {
            setCurrentStep("whatsapp_confirm");
            addLog("📱 WhatsApp summary package & calendar link dispatched to 7850051826", "success");

            // Step 5: WhatsApp -> CRM Update (after 6.2s)
            setTimeout(() => {
              setCurrentStep("crm_update");
              addLog("☁️ Salesforce CRM updated: Lead status advanced to 'Working - Contacted'", "success");

              // Step 6: Complete (after 7.4s)
              setTimeout(() => {
                playSuccessSound();
                setCurrentStep("completed");
                setIsSimulating(false);
                addLog("🏆 Workflow completed with 100% success in 7.4 seconds!", "success");
              }, 1200);
            }, 1200);
          }, 1200);
        }, 1300);
      }, 1300);
    }, 1200);
  };

  const handleResetSimulation = () => {
    playClickSound();
    setCurrentStep("idle");
    setIsSimulating(false);
  };

  const handleSave = () => {
    playSuccessSound();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <main className="relative flex min-h-screen bg-[#020617] text-white">
      <AnimatedBackground />
      <Sidebar />

      <div className="relative z-10 flex flex-1 flex-col overflow-x-hidden">
        <Topbar />

        <div className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400">
                <Workflow size={24} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Automation Flow Engine
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mt-1">
                Autonomous Lead Workflows
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Visual pipeline orchestrating AI voice calls, WhatsApp confirmations, and Salesforce sync.
              </p>
            </div>

            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/90 p-1">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveTab("canvas");
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === "canvas"
                      ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Flow Canvas
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveTab("logs");
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === "logs"
                      ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Live Logs ({executionLogs.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveTab("settings");
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === "settings"
                      ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Config
                </button>
              </div>

              {/* Reset Button */}
              {currentStep !== "idle" && (
                <button
                  type="button"
                  onClick={handleResetSimulation}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
              )}

              {/* TEST RUN BUTTON */}
              <button
                type="button"
                onClick={runTestExecution}
                disabled={isSimulating}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                <Play size={14} className={isSimulating ? "animate-spin" : "fill-white"} />
                {isSimulating ? "Running Simulation..." : "▶️ Test Run Workflow"}
              </button>

              {/* Save Workflow Button */}
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
              >
                {isSaved ? <Check size={14} /> : <Save size={14} />}
                {isSaved ? "Saved!" : "Save Workflow"}
              </button>
            </div>
          </div>

          {/* Workflow Status Strip */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Flow Active: &ldquo;Speed-to-Lead Instant AI Conversion&rdquo;
                </p>
                <p className="text-xs text-slate-400">
                  Trigger: <span className="text-cyan-400 font-mono">Lead.Created (Salesforce CRM)</span> • Target: High-Value Pipeline
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-cyan-400" />
                Response Time: <span className="text-emerald-400 font-bold">&lt; 60 seconds</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-purple-400" />
                Conversion Rate: <span className="text-purple-300 font-bold">78.4%</span>
              </div>
            </div>
          </div>

          {/* TAB 1: FLOW CANVAS */}
          {activeTab === "canvas" && (
            <div className="relative rounded-3xl border border-white/10 bg-slate-950/70 p-6 sm:p-10 backdrop-blur-md overflow-x-auto">
              <div className="min-w-[700px] flex flex-col items-center space-y-4">
                
                {/* 1. TRIGGER NODE */}
                <div
                  className={`w-full max-w-md rounded-2xl border p-5 transition-all duration-300 ${
                    currentStep === "trigger"
                      ? "border-emerald-400 bg-emerald-500/15 shadow-[0_0_30px_rgba(52,211,153,0.3)] scale-105"
                      : "border-white/10 bg-slate-900/90 shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                      <Zap size={13} />
                      1. Trigger Event
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Real-time Webhook
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-white">
                    New Lead Created in Salesforce CRM
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Captures prospect details (Rahul Sharma, +91 7850051826, Apex Technologies).
                  </p>
                </div>

                {/* Arrow Connector */}
                <div className="flex flex-col items-center">
                  <div
                    className={`h-8 w-0.5 transition-colors duration-300 ${
                      currentStep !== "idle" ? "bg-cyan-400 animate-pulse" : "bg-white/20"
                    }`}
                  />
                  <ArrowDown
                    size={16}
                    className={
                      currentStep !== "idle"
                        ? "text-cyan-400 animate-bounce"
                        : "text-slate-600"
                    }
                  />
                </div>

                {/* 2. AI ACTION NODE */}
                <div
                  className={`w-full max-w-md rounded-2xl border p-5 transition-all duration-300 ${
                    currentStep === "ai_dial"
                      ? "border-cyan-400 bg-cyan-500/15 shadow-[0_0_30px_rgba(34,211,238,0.35)] scale-105"
                      : "border-white/10 bg-slate-900/90 shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                      <Phone size={13} />
                      2. AI Voice Action
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      Voice: Indian (Neha/Rohan)
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-white">
                    Autonomous Outbound Call Dispatched
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    AI bridges live cellular telephone connection, introduces Umendra Bhati&apos;s agency, and pitches CRM automations.
                  </p>
                </div>

                {/* Arrow Connector */}
                <div className="flex flex-col items-center">
                  <div
                    className={`h-8 w-0.5 transition-colors duration-300 ${
                      ["decision", "schedule_demo", "whatsapp_confirm", "crm_update", "completed"].includes(
                        currentStep
                      )
                        ? "bg-purple-400 animate-pulse"
                        : "bg-white/20"
                    }`}
                  />
                  <ArrowDown
                    size={16}
                    className={
                      ["decision", "schedule_demo", "whatsapp_confirm", "crm_update", "completed"].includes(
                        currentStep
                      )
                        ? "text-purple-400 animate-bounce"
                        : "text-slate-600"
                    }
                  />
                </div>

                {/* 3. DECISION FORK */}
                <div
                  className={`w-full max-w-md rounded-2xl border p-5 transition-all duration-300 ${
                    currentStep === "decision"
                      ? "border-purple-400 bg-purple-500/15 shadow-[0_0_30px_rgba(192,132,252,0.35)] scale-105"
                      : "border-white/10 bg-slate-900/90 shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-300">
                      <GitBranch size={13} />
                      3. Intent & Decision Branch
                    </span>
                    <span className="text-[10px] text-purple-400 font-mono">
                      Sentiment Analysis
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-white">
                    Did Lead Engage & Agree to Demo?
                  </h3>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <div className="flex-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2 text-center text-emerald-300 font-semibold">
                      ✅ Yes (Interested - 74%)
                    </div>
                    <div className="flex-1 rounded-xl border border-slate-700 bg-slate-800/80 p-2 text-center text-slate-400">
                      ❌ No / Voicemail (26%)
                    </div>
                  </div>
                </div>

                {/* Branch Connectors */}
                <div className="w-full max-w-2xl flex justify-between px-16">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-8 w-0.5 ${
                        ["schedule_demo", "whatsapp_confirm", "crm_update", "completed"].includes(currentStep)
                          ? "bg-emerald-400 animate-pulse"
                          : "bg-white/20"
                      }`}
                    />
                    <ArrowDown
                      size={16}
                      className={
                        ["schedule_demo", "whatsapp_confirm", "crm_update", "completed"].includes(currentStep)
                          ? "text-emerald-400"
                          : "text-slate-600"
                      }
                    />
                  </div>
                  <div className="flex flex-col items-center opacity-50">
                    <div className="h-8 w-0.5 bg-white/20" />
                    <ArrowDown size={16} className="text-slate-600" />
                  </div>
                </div>

                {/* 4. PARALLEL OUTCOME NODES */}
                <div className="w-full max-w-2xl grid grid-cols-2 gap-6">
                  {/* Left Column: SUCCESS OUTCOME */}
                  <div className="space-y-4">
                    {/* Node 4A: Schedule Demo */}
                    <div
                      className={`rounded-2xl border p-4 transition-all duration-300 ${
                        currentStep === "schedule_demo"
                          ? "border-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.3)] scale-105"
                          : "border-emerald-500/30 bg-slate-900/90"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                        <Calendar size={14} />
                        4A. Book Live Demo
                      </div>
                      <p className="mt-1.5 text-xs text-white font-medium">
                        Lock in calendar meeting for Thursday 2:00 PM.
                      </p>
                    </div>

                    {/* Node 5A: WhatsApp Confirmation */}
                    <div
                      className={`rounded-2xl border p-4 transition-all duration-300 ${
                        currentStep === "whatsapp_confirm"
                          ? "border-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.3)] scale-105"
                          : "border-emerald-500/30 bg-slate-900/90"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                        <MessageSquare size={14} />
                        5A. WhatsApp Confirmation
                      </div>
                      <p className="mt-1.5 text-xs text-white font-medium">
                        Instant WhatsApp summary + PDF deck link sent.
                      </p>
                    </div>

                    {/* Node 6A: CRM Stage Advance */}
                    <div
                      className={`rounded-2xl border p-4 transition-all duration-300 ${
                        currentStep === "crm_update" || currentStep === "completed"
                          ? "border-cyan-400 bg-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.3)] scale-105"
                          : "border-cyan-500/30 bg-slate-900/90"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
                        <CheckCircle2 size={14} />
                        6A. Update Salesforce Stage
                      </div>
                      <p className="mt-1.5 text-xs text-white font-medium">
                        Status advances to &ldquo;Working - Contacted&rdquo;.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: FALLBACK OUTCOME */}
                  <div className="space-y-4 opacity-70">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                      <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                        <Mail size={14} />
                        4B. Fallback Outreach Email
                      </div>
                      <p className="mt-1.5 text-xs text-slate-300 font-medium">
                        1-Click AI email dispatched with proposal overview.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                      <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                        <Clock size={14} />
                        5B. Schedule Smart Re-dial
                      </div>
                      <p className="mt-1.5 text-xs text-slate-300 font-medium">
                        Queues secondary AI outbound call in 4 hours.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                        <CheckCircle2 size={14} />
                        6B. Salesforce Task Logged
                      </div>
                      <p className="mt-1.5 text-xs text-slate-300 font-medium">
                        Task created: &ldquo;Outbound Call Attempt 1 (No Answer)&rdquo;.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: LIVE EXECUTION LOGS */}
          {activeTab === "logs" && (
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Workflow Telemetry Logs</h3>
                  <p className="text-xs text-slate-400">Real-time audit trail of all triggered automation events</p>
                </div>
                <button
                  type="button"
                  onClick={() => setExecutionLogs([])}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Clear Logs
                </button>
              </div>

              {executionLogs.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center text-center text-slate-500">
                  <Workflow size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">No execution logs yet.</p>
                  <p className="text-xs mt-1">Click &ldquo;▶️ Test Run Workflow&rdquo; to simulate live execution.</p>
                </div>
              ) : (
                <div className="space-y-2.5 font-mono text-xs">
                  {executionLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 rounded-xl border p-3 ${
                        log.type === "success"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                          : log.type === "warning"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                          : "border-white/10 bg-slate-900/80 text-slate-300"
                      }`}
                    >
                      <span className="text-slate-500 shrink-0">[{log.time}]</span>
                      <span className="flex-1">{log.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WORKFLOW CONFIGURATION */}
          {activeTab === "settings" && (
            <div className="max-w-2xl rounded-3xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-md space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Workflow Tuning & Triggers</h3>
                <p className="text-xs text-slate-400">Configure timing, default voice, and sync options</p>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Auto-Dial Delay After Lead Creation
                  </label>
                  <select
                    value={workflowConfig.dialDelay}
                    onChange={(e) =>
                      setWorkflowConfig({ ...workflowConfig, dialDelay: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white focus:border-cyan-500"
                  >
                    <option value="0">Instant (Within 10 seconds)</option>
                    <option value="30">30 seconds (Recommended)</option>
                    <option value="60">60 seconds</option>
                    <option value="300">5 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Primary AI Voice Accent
                  </label>
                  <select
                    value={workflowConfig.voiceAccent}
                    onChange={(e) =>
                      setWorkflowConfig({ ...workflowConfig, voiceAccent: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white focus:border-cyan-500"
                  >
                    <option value="indian">🇮🇳 Indian English (Neha / Rohan)</option>
                    <option value="jarvis">🤖 Deep British AI (JARVIS tone)</option>
                    <option value="us">🇺🇸 US Executive Corporate</option>
                  </select>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workflowConfig.autoUpdateCrm}
                      onChange={(e) =>
                        setWorkflowConfig({
                          ...workflowConfig,
                          autoUpdateCrm: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-slate-300 text-xs">
                      Automatically advance Salesforce Lead status to &ldquo;Working - Contacted&rdquo; upon completed call
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workflowConfig.sendWhatsapp}
                      onChange={(e) =>
                        setWorkflowConfig({
                          ...workflowConfig,
                          sendWhatsapp: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-slate-300 text-xs">
                      Send WhatsApp summary message when prospect agrees to demo
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workflowConfig.sendEmailFallback}
                      onChange={(e) =>
                        setWorkflowConfig({
                          ...workflowConfig,
                          sendEmailFallback: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-slate-300 text-xs">
                      Send fallback AI outreach email if customer call is unanswered
                    </span>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-600"
                  >
                    {isSaved ? "Configuration Saved!" : "Save Automation Parameters"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
