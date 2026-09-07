"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Phone,
  PhoneCall,
  Sparkles,
  TrendingUp,
  Clock,
  Play,
  Pause,
  MessageSquare,
  Mail,
  CheckCircle2,
  Trash2,
  Activity,
  User,
  Building2,
} from "lucide-react";
import { playClickSound, playSuccessSound } from "@/app/utils/soundEffects";

export type CallRecord = {
  id: string;
  leadName: string;
  company: string;
  phone: string;
  duration: number;
  timestamp: string;
  sentimentScore: number;
  sentimentVerdict: string;
  keyTakeaways: string[];
  actionItem: string;
};

const DEFAULT_CALL_RECORDS: CallRecord[] = [
  {
    id: "call-demo-1",
    leadName: "Rahul Sharma",
    company: "Apex Technologies",
    phone: "7850051826",
    duration: 68,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    sentimentScore: 96,
    sentimentVerdict: "High Buying Intent (Positive)",
    keyTakeaways: [
      "Client confirmed urgent requirement for automating Salesforce lead qualification and approval workflows.",
      "Turnaround timeline accepted: 48 to 72 hours with zero operational disruption.",
      "10-minute live demonstration scheduled for Thursday at 2:00 PM.",
    ],
    actionItem: "Send calendar invite & WhatsApp workflow summary before Thursday.",
  },
  {
    id: "call-demo-2",
    leadName: "Amit Verma",
    company: "Verma Logistics",
    phone: "+91 98230 45678",
    duration: 54,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    sentimentScore: 89,
    sentimentVerdict: "Warm Prospect (Evaluating Budget)",
    keyTakeaways: [
      "Interested in auto-syncing WhatsApp messages directly into Salesforce Lead activities.",
      "Requested monthly subscription pricing tier for 15 sales executives.",
      "Agreed to review proposal document sent via email.",
    ],
    actionItem: "Dispatch tiered pricing breakdown via WhatsApp and email.",
  },
  {
    id: "call-demo-3",
    leadName: "Pooja Patel",
    company: "Zenith Digital",
    phone: "+91 98190 12345",
    duration: 49,
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    sentimentScore: 93,
    sentimentVerdict: "High Buying Intent (Positive)",
    keyTakeaways: [
      "Confirmed Salesforce Enterprise Edition compatibility questions.",
      "Validated native OAuth2 data security & 256-bit encryption assurances.",
      "Requested contract draft for Q4 rollout.",
    ],
    actionItem: "Prepare standard automation service agreement.",
  },
];

type CallHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onReDial?: (name: string, phone: string, company: string) => void;
};

export default function CallHistoryModal({
  isOpen,
  onClose,
  onReDial,
}: CallHistoryModalProps) {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load call records from localStorage + defaults
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("ai_call_intelligence_history");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCalls(parsed);
            return;
          }
        }
      } catch {
        // ignore
      }
      setCalls(DEFAULT_CALL_RECORDS);
    }
  }, [isOpen]);

  const clearHistory = () => {
    playClickSound();
    if (confirm("Clear call intelligence history?")) {
      localStorage.removeItem("ai_call_intelligence_history");
      setCalls([]);
      playSuccessSound();
    }
  };

  const toggleAudioSimulation = (callId: string) => {
    playClickSound();
    if (playingId === callId) {
      if (audioPlayTimerRef.current) clearTimeout(audioPlayTimerRef.current);
      setPlayingId(null);
    } else {
      setPlayingId(callId);
      // Auto-stop simulation after 10s
      if (audioPlayTimerRef.current) clearTimeout(audioPlayTimerRef.current);
      audioPlayTimerRef.current = setTimeout(() => {
        setPlayingId(null);
      }, 10000);
    }
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem.toString().padStart(2, "0")}s`;
  };

  const formatRelativeTime = (iso: string) => {
    try {
      const diffSecs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
      if (diffSecs < 60) return "Just now";
      if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
      if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
      return new Date(iso).toLocaleDateString();
    } catch {
      return "Recently";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950 shadow-2xl shadow-cyan-500/15">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 shadow-md shadow-cyan-500/20">
              <Activity size={22} />
            </div>
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <span>Call Intelligence & Audio History</span>
                <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                  {calls.length} Logged
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                AI Sentiment analysis, waveforms & automated Salesforce deal summaries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {calls.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-slate-400 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                title="Clear History"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* CALL RECORDS LIST */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {calls.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 py-12">
              <PhoneCall size={36} className="mb-3 text-slate-600 animate-pulse" />
              <p className="font-semibold text-slate-400">No Call Records Found</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Completed AI Outbound calls automatically generate sentiment telemetry and audio transcripts here.
              </p>
            </div>
          ) : (
            calls.map((call) => {
              const isPlaying = playingId === call.id;

              return (
                <div
                  key={call.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-cyan-500/40 hover:bg-slate-900"
                >
                  {/* Top Bar: Contact + Sentiment + Duration */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-base font-bold text-white shadow-md shadow-cyan-500/20">
                        {call.leadName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base">
                            {call.leadName}
                          </h3>
                          <span className="text-xs text-slate-500 font-mono">
                            • {call.phone}
                          </span>
                        </div>
                        <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <Building2 size={12} className="text-cyan-400" />
                          <span>{call.company}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* Sentiment Badge */}
                      <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 shadow-sm shadow-emerald-500/10">
                        <TrendingUp size={13} />
                        <span>{call.sentimentScore}% Intent</span>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                        <Clock size={12} />
                        <span>{formatDuration(call.duration)}</span>
                      </div>

                      <span className="text-[11px] text-slate-500">
                        ({formatRelativeTime(call.timestamp)})
                      </span>
                    </div>
                  </div>

                  {/* Waveform Audio Player Simulation */}
                  <div className="mt-4 rounded-xl border border-cyan-500/20 bg-slate-950/70 p-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleAudioSimulation(call.id)}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                        isPlaying
                          ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                          : "bg-cyan-500 text-white shadow-md shadow-cyan-500/20 hover:bg-cyan-400"
                      }`}
                      title={isPlaying ? "Pause audio" : "Play call replay"}
                    >
                      {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                    </button>

                    {/* Animated Bouncing Waveform Bars */}
                    <div className="flex flex-1 items-center gap-1 h-7">
                      {[40, 75, 55, 90, 30, 85, 60, 100, 45, 80, 65, 95, 35, 70, 50, 85, 60, 90, 40, 75, 55, 85, 30, 95, 50].map((h, bIdx) => (
                        <div
                          key={bIdx}
                          style={{
                            height: isPlaying ? `${Math.max(20, Math.round(h * Math.random()))}%` : `${h * 0.4}%`,
                            transition: "height 0.15s ease",
                          }}
                          className={`flex-1 rounded-full transition-all duration-150 ${
                            isPlaying
                              ? "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                              : "bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>

                    <span className="text-[11px] font-mono text-cyan-400 shrink-0">
                      {isPlaying ? "Replaying..." : "Audio Ready"}
                    </span>
                  </div>

                  {/* Executive Key Takeaways */}
                  <div className="mt-4 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Sparkles size={12} className="text-cyan-400" />
                      AI Executive Summary & Insights:
                    </p>
                    <ul className="space-y-1 pl-1 text-xs text-slate-300">
                      {call.keyTakeaways.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Item & Quick Follow-up Buttons */}
                  <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
                      <CheckCircle2 size={14} className="shrink-0" />
                      <span>Next Action: {call.actionItem}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {onReDial && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onReDial(call.leadName, call.phone, call.company);
                          }}
                          className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
                        >
                          <PhoneCall size={12} />
                          Re-Dial
                        </button>
                      )}

                      <a
                        href={`https://wa.me/${call.phone.replace(/[^\d]/g, "").length === 10 ? `91${call.phone.replace(/[^\d]/g, "")}` : call.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(`Hi ${call.leadName}! Umendra Bhati here. Following up on our call regarding your Salesforce CRM automations.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/25"
                      >
                        <MessageSquare size={12} />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
