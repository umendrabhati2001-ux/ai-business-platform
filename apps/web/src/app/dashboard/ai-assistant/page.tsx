"use client";

import {
  Bot,
  Send,
  Sparkles,
  BarChart3,
  Lightbulb,
  MessageSquare,
  Mic,
  MicOff,
  Phone,
  PhoneCall,
  Mail,
  X,
  User,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import FormattedAiMessage from "@/components/dashboard/FormattedAiMessage";
import AiCallModal from "@/components/dashboard/AiCallModal";
import CallHistoryModal from "@/components/dashboard/CallHistoryModal";
import { playAiChime, playSuccessSound, playClickSound } from "@/app/utils/soundEffects";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function AIAssistantPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Custom Outbound Dial Modal state
  const [isCustomDialOpen, setIsCustomDialOpen] = useState(false);
  const [customDial, setCustomDial] = useState({
    name: "Rahul",
    phone: "7850051826",
    company: "Enterprise Operations",
  });
  const [isSavingLead, setIsSavingLead] = useState(false);
  const [customDialSuccess, setCustomDialSuccess] = useState("");
  const [isCallHistoryOpen, setIsCallHistoryOpen] = useState(false);

  const [callModalData, setCallModalData] = useState<{
    isOpen: boolean;
    leadName: string;
    company: string;
    phone: string;
    leadId?: string;
  }>({
    isOpen: false,
    leadName: "Rahul Sharma",
    company: "Apex Technologies",
    phone: "7850051826",
  });
  const autoCallTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartAiCall = (
    leadName = "Rahul Sharma",
    phone = "7850051826",
    company = "Apex Technologies",
    leadId?: string
  ) => {
    if (autoCallTimerRef.current) {
      clearTimeout(autoCallTimerRef.current);
      autoCallTimerRef.current = null;
    }
    playClickSound();
    setCallModalData({
      isOpen: true,
      leadName,
      company,
      phone,
      leadId,
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
        (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            setMessage(transcript);
            setIsListening(false);
            playSuccessSound();
            setTimeout(() => {
              sendMessage(transcript);
            }, 300);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert("Speech recognition is not available in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      playClickSound();
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Speech recognition error:", err);
      }
    }
  };

  const sendMessage = async (text?: string) => {
    const userMessage = (text ?? message).trim();

    if (!userMessage || loading) {
      return;
    }

    setError("");

    const newUserMessage: Message = {
      role: "user",
      text: userMessage,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "AI request failed");
      }

      const assistantMessage: Message = {
        role: "assistant",
        text: data.message || "I didn't receive a response.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      playAiChime();

      // Check if user asked to call or mentioned dialing someone
      const lower = userMessage.toLowerCase();
      const phoneMatch = userMessage.match(/(\+?\d[\d\s-]{8,}\d)/);

      if (
        phoneMatch ||
        lower.includes("call") ||
        lower.includes("dial") ||
        lower.includes("phone") ||
        lower.includes("baat")
      ) {
        const detectedPhone = phoneMatch ? phoneMatch[0].trim() : "7850051826";

        // Dynamically extract ANY person's name mentioned:
        // Example: "Aman ko call karo", "Pooja ko call lagao", "Rahul se baat karo"
        let targetName = "Rahul Sharma";

        const koMatch = userMessage.match(
          /([A-Za-z\u0900-\u097F]+)\s+(?:ko|se)\s+(?:call|dial|phone|baat)/i
        );
        const callMatch = userMessage.match(
          /(?:call|dial|phone)\s+([A-Za-z\u0900-\u097F]+(?:\s+[A-Za-z\u0900-\u097F]+)?)/i
        );

        if (koMatch && koMatch[1]) {
          const cand = koMatch[1].trim();
          const ignored = ["kisi", "kisko", "mujhe", "mera", "meri", "ai", "lead", "dost", "samne"];
          if (!ignored.includes(cand.toLowerCase())) {
            targetName = cand.charAt(0).toUpperCase() + cand.slice(1);
          }
        } else if (callMatch && callMatch[1]) {
          const cand = callMatch[1]
            .trim()
            .replace(/\s+(?:ko|kar|karo|do|lagao|now|please|lead)$/i, "");
          const ignored = [
            "lead",
            "priority",
            "me",
            "him",
            "her",
            "them",
            "first",
            "now",
            "please",
            "karo",
            "kar",
            "kisi",
            "samne",
          ];
          if (!ignored.includes(cand.toLowerCase()) && cand.length >= 2) {
            targetName = cand.charAt(0).toUpperCase() + cand.slice(1);
          }
        } else if (lower.includes("mera") || lower.includes("meri") || lower.includes("my")) {
          targetName = "Umendra Bhati";
        }

        if (autoCallTimerRef.current) clearTimeout(autoCallTimerRef.current);
        autoCallTimerRef.current = setTimeout(() => {
          handleStartAiCall(targetName, detectedPhone, "Apex Technologies");
        }, 1200);
      }
    } catch (error) {
      console.error("AI REQUEST ERROR:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Sorry, I couldn't process your request right now.";

      setError(errorMessage);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I couldn't process your request right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    sendMessage();
  };

  const handleSaveCustomToSalesforce = async () => {
    if (!customDial.name.trim() || !customDial.phone.trim()) {
      alert("Please enter Name and Phone Number");
      return;
    }

    setIsSavingLead(true);
    try {
      const res = await fetch("/api/salesforce/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customDial.name,
          company: customDial.company || "Personal Lead",
          phone: customDial.phone,
          status: "Open - Not Contacted",
        }),
      });

      const data = await res.json();
      if (data.success) {
        playSuccessSound();
        setCustomDialSuccess("Lead successfully saved to Salesforce CRM!");
        setTimeout(() => {
          setCustomDialSuccess("");
          setIsCustomDialOpen(false);
        }, 1800);
      } else {
        alert(data.error || "Failed to save lead to Salesforce");
      }
    } catch {
      alert("Error connecting to Salesforce API");
    } finally {
      setIsSavingLead(false);
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === "custom_dial") {
      playClickSound();
      setIsCustomDialOpen(true);
      return;
    }
    sendMessage(action);
  };

  const clearChat = () => {
    setMessages([]);
    setError("");
    playSuccessSound();
  };

  const quickActions = [
    {
      icon: Phone,
      title: "Call Priority Lead",
      description: "Get highest priority lead phone number & 30-sec script.",
      action: "Who should I call first?",
    },
    {
      icon: PhoneCall,
      title: "⚡ Test Custom Number",
      description: "Directly test AI calling engine with your own or friend's number.",
      action: "custom_dial",
    },
    {
      icon: MessageSquare,
      title: "Send WhatsApp Pitch",
      description: "Generate 1-click WhatsApp message ready to send.",
      action: "Draft a WhatsApp message for my top lead",
    },
    {
      icon: Mail,
      title: "Draft Outreach Email",
      description: "Create professional Salesforce pitch with 1-click Gmail launch.",
      action: "Draft an outreach email for my top lead",
    },
  ];

  return (
    <main className="flex min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />
      <Sidebar />
      <section className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Topbar />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500">
            <Bot size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              AI Assistant
            </h1>

            <p className="text-sm text-slate-400">
              Your intelligent business assistant
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsCustomDialOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400 hover:bg-cyan-500/20"
          >
            <PhoneCall size={14} />
            ⚡ Test Custom Number
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsCallHistoryOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-300 transition hover:border-purple-400 hover:bg-purple-500/20"
            title="View AI sentiment analysis, audio waveform recordings, and action items"
          >
            <BarChart3 size={14} />
            📊 Call Intelligence
          </button>

          <div className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-300">
            OpenAI
          </div>

          <button
            type="button"
            onClick={clearChat}
            disabled={messages.length === 0}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => handleQuickAction(item.action)}
              disabled={loading}
              className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 text-left transition-all duration-300 hover:border-cyan-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <Icon size={22} />
              </div>

              <h3 className="mb-1 font-semibold text-white">
                {item.title}
              </h3>

              <p className="text-sm text-slate-400">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Chat Box */}
      <div className="flex min-h-[550px] flex-col rounded-2xl border border-white/10 bg-slate-900/70">
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b border-white/10 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500">
            <Sparkles size={20} />
          </div>

          <div>
            <h2 className="font-semibold">
              AI Business Assistant
            </h2>

            <p className="text-xs text-green-400">
              ● {loading ? "Thinking..." : "Online • OpenAI"}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                <Bot size={40} />
              </div>

              <h2 className="mb-2 text-2xl font-bold">
                How can I help you?
              </h2>

              <p className="max-w-md text-slate-400">
                Ask me about your business, sales, customers,
                analytics, reports, growth, or business ideas.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-lg transition-all ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20 font-medium"
                      : "border border-white/10 bg-slate-900/95 text-slate-200 backdrop-blur-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <FormattedAiMessage
                      text={msg.text}
                      onPromptClick={(prompt) => sendMessage(prompt)}
                      onStartAiCall={(name, ph, comp) =>
                        handleStartAiCall(name, ph, comp)
                      }
                    />
                  ) : (
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-cyan-400 font-bold border border-white/10 shadow-sm">
                    U
                  </div>
                )}
              </div>
            ))
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 animate-pulse">
                <Bot size={18} />
              </div>
              <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/90 px-5 py-3.5 text-slate-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-sm font-medium text-slate-300">
                  Analyzing Salesforce records...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="border-t border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Listening Banner */}
        {isListening && (
          <div className="flex items-center justify-between border-t border-red-500/20 bg-red-500/10 px-5 py-2 text-xs font-semibold text-red-400 animate-pulse">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              JARVIS Voice Active • Speak now (e.g. &ldquo;Analyze my open leads&rdquo;)...
            </span>
            <button
              type="button"
              onClick={toggleVoiceInput}
              className="text-xs text-red-300 underline hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-white/10 p-4 sm:p-5">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 focus-within:border-cyan-500">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              disabled={loading}
              placeholder={
                isListening
                  ? "Listening to your voice..."
                  : "Ask your AI assistant..."
              }
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500 disabled:opacity-50"
            />

            {speechSupported && (
              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={loading}
                title={
                  isListening
                    ? "Listening... Click to stop"
                    : "Voice Command (JARVIS Mode)"
                }
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                  isListening
                    ? "animate-pulse border border-red-500/50 bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                    : "border border-white/10 bg-slate-900 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-cyan-400"
                }`}
              >
                {isListening ? (
                  <MicOff size={18} className="text-red-400" />
                ) : (
                  <Mic size={18} />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500 text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </div>

          <p className="mt-2 text-center text-[10px] text-slate-600">
            Business-focused AI assistance • Do not share passwords,
            API keys, or sensitive credentials.
          </p>
        </div>
      </div>
        </div>
      </section>

      {/* CUSTOM TEST DIAL & LEAD CREATOR MODAL */}
      {isCustomDialOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-cyan-500/30 bg-slate-950 p-6 shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <PhoneCall size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    AI Outbound Voice Caller
                  </h3>
                  <p className="text-xs text-slate-400">
                    Autonomous phone outreach for Salesforce CRM leads
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomDialOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Client / Lead Name
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 focus-within:border-cyan-500">
                  <User size={16} className="text-slate-500" />
                  <input
                    type="text"
                    value={customDial.name}
                    onChange={(e) =>
                      setCustomDial((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Rahul"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mobile / Phone Number
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 focus-within:border-cyan-500">
                  <Phone size={16} className="text-slate-500" />
                  <input
                    type="text"
                    value={customDial.phone}
                    onChange={(e) =>
                      setCustomDial((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="e.g. 7850051826"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Company Name (Optional)
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 focus-within:border-cyan-500">
                  <Building2 size={16} className="text-slate-500" />
                  <input
                    type="text"
                    value={customDial.company}
                    onChange={(e) =>
                      setCustomDial((prev) => ({ ...prev, company: e.target.value }))
                    }
                    placeholder="e.g. Enterprise Client"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              {customDialSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 font-medium">
                  <CheckCircle2 size={16} />
                  {customDialSuccess}
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2.5">
                {/* 1. AI VOICE CALL */}
                <button
                  type="button"
                  onClick={() => {
                    if (!customDial.phone.trim()) {
                      alert("Please enter a phone number!");
                      return;
                    }
                    setIsCustomDialOpen(false);
                    handleStartAiCall(
                      customDial.name || "Rahul",
                      customDial.phone,
                      customDial.company || "Enterprise Lead"
                    );
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-blue-500"
                >
                  <PhoneCall size={16} />
                  🤖 Start AI Outbound Call
                </button>

                {/* 2. REAL TELECOM SHORTCUTS */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${customDial.phone.replace(/[^\d+]/g, "")}`}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                    title="Real Cellular Call directly from SIM / Phone Link"
                  >
                    <Phone size={13} />
                    Real SIM Call
                  </a>

                  <a
                    href={`https://wa.me/${customDial.phone.replace(/[^\d]/g, "").length === 10 ? `91${customDial.phone.replace(/[^\d]/g, "")}` : customDial.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(`Hi ${customDial.name || "there"}! Umendra Bhati here regarding your business operations and CRM automations. Would you have 2 minutes for a quick chat?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                    title="Real WhatsApp Call / Chat"
                  >
                    <MessageSquare size={13} />
                    WhatsApp Call
                  </a>
                </div>

                {/* 3. SAVE TO SALESFORCE */}
                <button
                  type="button"
                  onClick={handleSaveCustomToSalesforce}
                  disabled={isSavingLead}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                >
                  <Building2 size={14} />
                  {isSavingLead ? "Saving to Salesforce..." : "☁️ Save to Salesforce CRM"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUTONOMOUS AI OUTBOUND CALL MODAL */}
      <AiCallModal
        isOpen={callModalData.isOpen}
        leadName={callModalData.leadName}
        company={callModalData.company}
        phone={callModalData.phone}
        leadId={callModalData.leadId}
        onClose={() => {
          if (autoCallTimerRef.current) {
            clearTimeout(autoCallTimerRef.current);
            autoCallTimerRef.current = null;
          }
          setCallModalData((prev) => ({ ...prev, isOpen: false }));
        }}
        onCallLogged={(_id, summary) => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: `✅ **Autonomous Call Successfully Logged to Salesforce!**\n\n${summary}`,
            },
          ]);
        }}
      />

      {/* CALL INTELLIGENCE & AUDIO AUDIT MODAL */}
      <CallHistoryModal
        isOpen={isCallHistoryOpen}
        onClose={() => setIsCallHistoryOpen(false)}
        onReDial={(name, ph, comp) => {
          setIsCallHistoryOpen(false);
          handleStartAiCall(name, ph, comp);
        }}
      />
    </main>
  );
}