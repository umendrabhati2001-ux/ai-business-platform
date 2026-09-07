"use client";

import { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Mail,
  Phone,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Zap,
} from "lucide-react";
import { playClickSound, playSuccessSound } from "@/app/utils/soundEffects";

type FormattedAiMessageProps = {
  text: string;
  onPromptClick: (prompt: string) => void;
  onStartAiCall?: (leadName: string, phone: string, company: string) => void;
};

export default function FormattedAiMessage({
  text,
  onPromptClick,
  onStartAiCall,
}: FormattedAiMessageProps) {
  const [copied, setCopied] = useState(false);

  // Check if message contains an email draft
  const isEmailDraft = text.includes("**Subject:**") || text.includes("Subject:");

  // Extract phone number from text if present
  const phoneMatch = text.match(/(\+?\d[\d\s().-]{7,}\d)/);
  const detectedPhone = phoneMatch ? phoneMatch[0].trim() : "";
  const cleanPhone = detectedPhone.replace(/[^\d+]/g, "");

  // Extract lead name from text if present
  let detectedLeadName = "Priority Lead";
  const nameMatch =
    text.match(/for\s+\*\*([^*]+)\*\*/i) ||
    text.match(/for\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i) ||
    text.match(/Target Lead:\s*\*\*([^*]+)\*\*/i) ||
    text.match(/Profile:\s*\*\*([^*]+)\*\*/i);
  if (nameMatch) {
    detectedLeadName = nameMatch[1].trim();
  }

  // Extract pitch text if in quotes
  const quoteMatch = text.match(/"([^"]{20,})"/);
  const pitchMessage = quoteMatch
    ? quoteMatch[1]
    : `Hi ${detectedLeadName}! Umendra Bhati here. Reaching out regarding Salesforce CRM automations for your team.`;

  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  const handleShootEmail = async () => {
    playClickSound();
    setIsSendingEmail(true);

    try {
      // Extract subject line if possible
      const subjMatch = text.match(/Subject:\s*([^\n]+)/i);
      const subject = subjMatch ? subjMatch[1].replace(/\*\*/g, "").trim() : "Salesforce CRM Automation & Growth";

      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "rahul.sharma@apextech.com",
          name: detectedLeadName,
          subject,
          content: text.replace(/\*\*/g, ""),
        }),
      });

      if (res.ok) {
        setEmailSentSuccess(true);
        playSuccessSound();
        setTimeout(() => setEmailSentSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Email shoot error:", err);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleCopy = (contentToCopy: string) => {
    playClickSound();
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    playSuccessSound();
    setTimeout(() => setCopied(false), 2500);
  };

  // Helper to parse inline markdown (bold & italic)
  const renderFormattedText = (lineText: string) => {
    const parts = lineText.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Extract lines
  const lines = text.split("\n");

  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-200">
      {/* 1. If it's an email draft, show 1-click Shoot, Copy & Gmail buttons */}
      {isEmailDraft && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3">
          <span className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
            <Mail size={15} />
            Ready-to-Send Outreach Email
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {/* 1-Click Instant AI Shooter */}
            <button
              type="button"
              onClick={handleShootEmail}
              disabled={isSendingEmail || emailSentSuccess}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition shadow-md ${
                emailSentSuccess
                  ? "bg-emerald-600 border border-emerald-400 text-white shadow-emerald-500/30"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/30"
              } disabled:opacity-80`}
              title="Dispatches email through server & logs Task activity in Salesforce"
            >
              <Zap size={13} className={isSendingEmail ? "animate-spin" : ""} />
              {isSendingEmail
                ? "Shooting AI Email..."
                : emailSentSuccess
                ? "Dispatched & Logged!"
                : "⚡ Shoot AI Email Instantly"}
            </button>

            <button
              type="button"
              onClick={() => handleCopy(text.replace(/\*\*/g, ""))}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <a
              href={`mailto:?subject=${encodeURIComponent(
                "Quick question regarding CRM workflows"
              )}&body=${encodeURIComponent(text.replace(/\*\*/g, ""))}`}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
            >
              <Mail size={14} />
              Open in Gmail
            </a>
          </div>
        </div>
      )}

      {/* 2. Render Text Lines */}
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Section Headers (Do NOT match phone lines as headers!)
        const isHeader =
          (trimmed.startsWith("📊") ||
            trimmed.startsWith("✉️") ||
            trimmed.startsWith("🚀") ||
            trimmed.startsWith("📋") ||
            trimmed.startsWith("📈") ||
            trimmed.startsWith("💬") ||
            trimmed.startsWith("👤") ||
            (trimmed.startsWith("📞") &&
              !trimmed.toLowerCase().includes("phone:") &&
              !trimmed.toLowerCase().includes("phone"))) &&
          trimmed.includes("**");

        if (isHeader) {
          return (
            <div
              key={idx}
              className="mt-2 mb-2 flex items-center gap-2 text-base font-bold text-white border-b border-white/10 pb-1.5"
            >
              {renderFormattedText(trimmed)}
            </div>
          );
        }

        // Action Prompt Suggestions (e.g. • **Who should I call first?**)
        // Only match true executable action prompts, NOT regular bullet lists or facts!
        const isActionPrompt =
          trimmed.startsWith("•") &&
          trimmed.includes("**") &&
          (trimmed.includes("?") ||
            trimmed.toLowerCase().includes("who should") ||
            trimmed.toLowerCase().includes("send whatsapp") ||
            trimmed.toLowerCase().includes("draft an email") ||
            trimmed.toLowerCase().includes("analyze my leads") ||
            trimmed.toLowerCase().includes("growth strategy") ||
            trimmed.toLowerCase().includes("who to call") ||
            trimmed.toLowerCase().includes("save to salesforce"));

        if (isActionPrompt) {
          const promptMatch = trimmed.match(/\*\*([^*]+)\*\*/);
          const promptQuery = promptMatch
            ? promptMatch[1].replace(/["']/g, "").trim()
            : trimmed.replace(/^[•\s*"]+/, "").replace(/[*"]+$/, "").trim();

          return (
            <div key={idx} className="py-1">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onPromptClick(promptQuery);
                }}
                className="group flex w-full sm:w-auto items-center justify-between gap-3 rounded-xl border border-cyan-500/30 bg-slate-900/90 px-4 py-2 text-left text-xs font-medium text-cyan-300 transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-500/15 hover:text-white hover:shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              >
                <span className="flex items-center gap-2">
                  <Sparkles
                    size={13}
                    className="text-cyan-400 shrink-0 group-hover:scale-110 transition-transform"
                  />
                  <span>{promptQuery}</span>
                </span>
                <ArrowRight
                  size={13}
                  className="text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                />
              </button>
            </div>
          );
        }

        // Contact phone line with Inline Quick Dial buttons
        if (
          trimmed.toLowerCase().includes("phone:") ||
          (trimmed.includes("📞") && trimmed.match(/([+\d\s().-]{7,})/))
        ) {
          const linePhoneMatch = trimmed.match(/([+\d\s().-]{7,})/);
          const lineRawPhone = linePhoneMatch ? linePhoneMatch[0].trim() : "";
          const lineCleanPhone = lineRawPhone.replace(/[^\d+]/g, "");

          return (
            <div
              key={idx}
              className="flex flex-wrap items-center gap-2 text-slate-300 py-1.5"
            >
              <span>{renderFormattedText(trimmed)}</span>
              {lineCleanPhone && (
                <div className="flex flex-wrap items-center gap-1.5 ml-2">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      if (onStartAiCall) {
                        onStartAiCall(
                          detectedLeadName,
                          lineCleanPhone,
                          "Salesforce Lead"
                        );
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm transition hover:from-cyan-400 hover:to-blue-500"
                  >
                    <Sparkles size={11} /> 🤖 Auto-Call
                  </button>
                  <a
                    href={`tel:${lineCleanPhone}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 px-2 py-1 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-500 hover:text-white transition"
                  >
                    <Phone size={11} /> Call (SIM)
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${
                      lineCleanPhone.length === 10
                        ? `91${lineCleanPhone}`
                        : lineCleanPhone
                    }&text=${encodeURIComponent(pitchMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2 py-1 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-white transition"
                  >
                    <MessageSquare size={11} /> WhatsApp
                  </a>
                </div>
              )}
            </div>
          );
        }

        // Normal Bullet item
        if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
              <div className="flex-1">
                {renderFormattedText(trimmed.replace(/^[•-]\s*/, ""))}
              </div>
            </div>
          );
        }

        // Numbered list (e.g. 1. **Lead**)
        if (/^\d+\./.test(trimmed)) {
          const match = trimmed.match(/^(\d+\.)\s*(.*)/);
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span className="shrink-0 font-bold text-cyan-400">
                {match ? match[1] : "•"}
              </span>
              <div className="flex-1">
                {renderFormattedText(match ? match[2] : trimmed)}
              </div>
            </div>
          );
        }

        // Default Paragraph
        return (
          <p key={idx} className="text-slate-200">
            {renderFormattedText(trimmed)}
          </p>
        );
      })}

      {/* 3. DEDICATED OUTREACH ACTION BAR (Shown when message has a phone number or pitch!) */}
      {cleanPhone && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 shadow-xl shadow-cyan-500/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30">
              <PhoneCall size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Outreach Hub: {detectedLeadName}
              </p>
              <p className="text-[11px] font-mono text-cyan-400">
                {detectedPhone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* AI Call */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                if (onStartAiCall) {
                  onStartAiCall(
                    detectedLeadName,
                    cleanPhone,
                    "Salesforce CRM Lead"
                  );
                }
              }}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-blue-500 active:scale-95"
            >
              <Sparkles size={13} />
              <span>🤖 AI Auto-Call</span>
            </button>

            {/* Real SIM Call */}
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-slate-900 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white"
            >
              <Phone size={13} />
              <span>Real SIM Call</span>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?phone=${
                cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone
              }&text=${encodeURIComponent(pitchMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-3.5 py-2 text-xs font-bold text-emerald-300 shadow-md shadow-emerald-500/20 transition hover:bg-emerald-500/30 hover:text-white"
            >
              <MessageSquare size={13} />
              <span>Open WhatsApp</span>
              <ExternalLink size={11} className="opacity-70" />
            </a>

            {/* Copy Pitch */}
            <button
              type="button"
              onClick={() => handleCopy(pitchMessage)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? "Copied!" : "Copy Pitch"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
