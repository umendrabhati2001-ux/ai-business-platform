"use client";

import {
  Plus,
  Search,
  Users,
  Phone,
  Mail,
  MoreHorizontal,
  UserPlus,
  X,
  Trash2,
  Pencil,
  Eye,
  Building2,
  RefreshCw,
  CheckCircle2,
  Cloud,
  Download,
  LayoutGrid,
  List,
  ArrowRight,
  Sparkles,
  Check,
} from "lucide-react";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { playSuccessSound, playClickSound } from "@/app/utils/soundEffects";

type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  created_at?: string;
  source?: "salesforce" | "supabase";
};

type LeadForm = {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
};

type ApiLead = Record<string, unknown>;

function normalizeLead(lead: ApiLead, index: number): Lead {
  return {
    id: String(
      lead.id ?? lead.Id ?? lead.ID ?? `lead-${index}`
    ),
    name: String(
      lead.name ?? lead.Name ?? "Unknown Lead"
    ),
    company: String(
      lead.company ?? lead.Company ?? "Unknown Company"
    ),
    status: String(
      lead.status ?? lead.Status ?? "Open - Not Contacted"
    ),
    email: String(
      lead.email ?? lead.Email ?? "-"
    ),
    phone: String(
      lead.phone ?? lead.Phone ?? "-"
    ),
    source: "salesforce",
  };
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [isSalesforceConnected, setIsSalesforceConnected] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [openAction, setOpenAction] = useState<string | null>(null);

  const [form, setForm] = useState<LeadForm>({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "Open - Not Contacted",
  });

  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // =========================================================
  // LOAD LEADS (Salesforce Priority + Supabase Fallback)
  // =========================================================

  const loadLeads = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      // 1. Fetch from live Salesforce API endpoint
      const sfResponse = await fetch("/api/salesforce/leads", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (sfResponse.ok) {
        const data = await sfResponse.json();
        const rawLeads = Array.isArray(data)
          ? data
          : Array.isArray(data?.leads)
          ? data.leads
          : Array.isArray(data?.records)
          ? data.records
          : [];

        if (rawLeads.length > 0) {
          const sfLeads = rawLeads.map((item: ApiLead, idx: number) =>
            normalizeLead(item, idx)
          );
          setLeads(sfLeads);
          setIsSalesforceConnected(true);
          setLoading(false);
          setRefreshing(false);
          return;
        }
      }

      // 2. Fallback to Supabase if Salesforce leads are empty
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: supaLeads, error: supaError } = await supabase
          .from("leads")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!supaError && supaLeads) {
          setLeads(
            supaLeads.map((l) => ({
              ...l,
              source: "supabase",
            }))
          );
        }
      }
    } catch (err) {
      console.error("CRM Leads load error:", err);
      setError("Failed to load leads. Please verify connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

useEffect(() => {
  const timer = setTimeout(() => {
    void loadLeads();
  }, 0);
  return () => clearTimeout(timer);
}, []);
  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "Open - Not Contacted",
    });
  };

  // =========================================================
  // ADD LEAD
  // =========================================================

  const handleAddLead = async () => {
    setError("");

    if (
      !form.name.trim() ||
      !form.company.trim() ||
      !form.email.trim() ||
      !form.phone.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    try {
      let createdId = `lead-local-${Date.now()}`;
      let createdSource: "salesforce" | "supabase" = isSalesforceConnected
        ? "salesforce"
        : "supabase";

      // 1. Sync directly to Salesforce
      try {
        const sfRes = await fetch("/api/salesforce/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const sfData = await sfRes.json();
        if (sfData.success && sfData.id) {
          createdId = sfData.id;
          createdSource = "salesforce";
          showToast("✨ Lead successfully created in Salesforce CRM!");
        } else {
          showToast("Lead saved in local CRM");
        }
      } catch (sfErr) {
        console.warn("Direct Salesforce sync failed:", sfErr);
      }

      // 2. Backup to Supabase
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("leads").insert({
          user_id: user.id,
          name: form.name.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          status: form.status,
        });
      }

      const newLead: Lead = {
        id: createdId,
        name: form.name.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        status: form.status,
        source: createdSource,
      };

      setLeads((prev) => [newLead, ...prev]);
      playSuccessSound();
      resetForm();
      setShowAddModal(false);
    } catch (err) {
      console.error("Add lead error:", err);
      setError("Unable to add lead.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // ACTIONS
  // =========================================================

  const handleOpenEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setForm({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
    });
    setOpenAction(null);
    setShowEditModal(true);
  };

  const handleUpdateLead = async () => {
    if (!selectedLead) return;
    setError("");
    setSaving(true);

    try {
      // Sync to Salesforce
      try {
        await fetch("/api/salesforce/leads", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedLead.id, status: form.status }),
        });
      } catch (err) {
        console.warn("Salesforce status update error", err);
      }

      setLeads((prev) =>
        prev.map((l) =>
          l.id === selectedLead.id
            ? {
                ...l,
                name: form.name.trim(),
                company: form.company.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                status: form.status,
              }
            : l
        )
      );

      playSuccessSound();
      showToast("Updated lead details!");
      setShowEditModal(false);
      setSelectedLead(null);
      resetForm();
    } catch (err) {
      console.error("Update lead error:", err);
      setError("Unable to update lead.");
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatusChange = async (leadId: string, newStatus: string) => {
    playClickSound();
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    showToast(`Status updated to: ${newStatus}`);

    try {
      await fetch("/api/salesforce/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      playSuccessSound();
    } catch (e) {
      console.warn("Status update error", e);
    }
  };

  const exportToCsv = () => {
    playClickSound();
    if (leads.length === 0) {
      showToast("No leads to export!");
      return;
    }
    const headers = ["ID", "Name", "Company", "Email", "Phone", "Status", "Source"];
    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.company.replace(/"/g, '""')}"`,
      `"${(l.email || "").replace(/"/g, '""')}"`,
      `"${(l.phone || "").replace(/"/g, '""')}"`,
      `"${l.status.replace(/"/g, '""')}"`,
      `"${l.source || "salesforce"}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `salesforce_leads_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    playSuccessSound();
    showToast("📁 Leads CSV exported successfully!");
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setOpenAction(null);
    setShowViewModal(true);
  };

  const handleDeleteLead = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this lead?"
    );
    if (!confirmed) return;

    setLeads((prev) => prev.filter((l) => l.id !== id));
    setOpenAction(null);
  };

  // =========================================================
  // SEARCH & FILTER
  // =========================================================

  const filteredLeads = leads.filter((lead) => {
    const query = search.toLowerCase().trim();

    const matchesSearch =
      lead.name.toLowerCase().includes(query) ||
      lead.company.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.phone.toLowerCase().includes(query) ||
      lead.status.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" ||
      lead.status.toLowerCase().includes(statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  // =========================================================
  // STATS
  // =========================================================

  const totalLeads = leads.length;

  const openLeads = leads.filter((lead) =>
    lead.status.toLowerCase().includes("open") ||
    lead.status.toLowerCase().includes("new")
  ).length;

const contactedLeads = leads.filter((lead) =>
  lead.status.toLowerCase().includes("working")
).length;


  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusClass = (status: string) => {
    const lower = status.toLowerCase();

    if (lower.includes("qualified") || lower.includes("converted")) {
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
    }

    if (lower.includes("working") || lower.includes("contacted")) {
      return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
    }

    if (lower.includes("open") || lower.includes("new")) {
      return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
    }

    return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30";
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="flex min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />
      <Sidebar />
      <section className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Topbar />
        <div className="flex-1 px-6 py-8 md:px-8">
          {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">CRM Leads</h1>
            {isSalesforceConnected && (
              <span className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                <Cloud size={13} className="text-cyan-400" />
                Salesforce Live
              </span>
            )}
          </div>
          <p className="mt-1 text-slate-400">
            Real-time customer relationship & business lead management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* VIEW MODE TOGGLE */}
          <div className="flex items-center rounded-xl border border-white/10 bg-slate-900 p-1">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setViewMode("table");
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                viewMode === "table"
                  ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <List size={14} />
              Table
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setViewMode("kanban");
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                viewMode === "kanban"
                  ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid size={14} />
              Pipeline
            </button>
          </div>

          {/* EXPORT CSV */}
          <button
            type="button"
            onClick={exportToCsv}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-cyan-400"
            title="Download CSV export"
          >
            <Download size={16} className="text-cyan-400" />
            Export
          </button>

          {/* REFRESH */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              loadLeads(true);
            }}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin text-cyan-400" : ""}
            />
            Refresh
          </button>

          {/* ADD LEAD */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              resetForm();
              setError("");
              setShowAddModal(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-600 shadow-lg shadow-cyan-500/20"
          >
            <Plus size={20} />
            Add Lead
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500 shadow-lg shadow-cyan-500/30">
            <Users size={22} />
          </div>
          <p className="text-sm text-slate-400">Total Leads</p>
          <h2 className="mt-1 text-3xl font-bold">{totalLeads}</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 shadow-lg shadow-amber-500/30">
            <UserPlus size={22} />
          </div>
          <p className="text-sm text-slate-400">Open / Uncontacted</p>
          <h2 className="mt-1 text-3xl font-bold">{openLeads}</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/30">
            <CheckCircle2 size={22} />
          </div>
          <p className="text-sm text-slate-400">Working / In Progress</p>
          <h2 className="mt-1 text-3xl font-bold">{contactedLeads}</h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">Recent Leads</h2>
            <p className="text-sm text-slate-400">
              Showing live records from Salesforce CRM.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Working">Working / Contacted</option>
              <option value="Qualified">Qualified</option>
            </select>

            <div className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 md:w-72">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400">
            <RefreshCw size={28} className="animate-spin text-cyan-400 mb-3" />
            <p>Loading Salesforce leads...</p>
          </div>
        ) : viewMode === "kanban" ? (
          /* KANBAN PIPELINE BOARD */
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* STAGE 1: OPEN */}
              <div className="rounded-2xl border border-amber-500/20 bg-slate-950/60 p-4">
                <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <h3 className="font-semibold text-slate-200">Open Leads</h3>
                  </div>
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
                    {filteredLeads.filter((l) => l.status.toLowerCase().includes("open") || l.status.toLowerCase().includes("new")).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {filteredLeads
                    .filter((l) => l.status.toLowerCase().includes("open") || l.status.toLowerCase().includes("new"))
                    .map((lead) => (
                      <div key={lead.id} className="rounded-xl border border-white/10 bg-slate-900/90 p-4 transition hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-100">{lead.name}</h4>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                              <Building2 size={13} className="text-slate-500" />
                              {lead.company}
                            </p>
                          </div>
                          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                            New
                          </span>
                        </div>
                        <div className="mt-3 space-y-1 text-xs text-slate-400">
                          {lead.email && <p className="truncate">✉️ {lead.email}</p>}
                          {lead.phone && <p>📞 {lead.phone}</p>}
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                          <button
                            type="button"
                            onClick={() => handleViewLead(lead)}
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickStatusChange(lead.id, "Working - Contacted")}
                            className="flex items-center gap-1 rounded-lg bg-blue-500/15 px-2.5 py-1 text-xs font-medium text-blue-400 transition hover:bg-blue-500/30 hover:text-blue-300"
                          >
                            Contact ➡️
                          </button>
                        </div>
                      </div>
                    ))}
                  {filteredLeads.filter((l) => l.status.toLowerCase().includes("open") || l.status.toLowerCase().includes("new")).length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-500">
                      No open leads
                    </div>
                  )}
                </div>
              </div>

              {/* STAGE 2: WORKING / CONTACTED */}
              <div className="rounded-2xl border border-blue-500/20 bg-slate-950/60 p-4">
                <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-400 animate-pulse" />
                    <h3 className="font-semibold text-slate-200">In Progress / Working</h3>
                  </div>
                  <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-400 border border-blue-500/30">
                    {filteredLeads.filter((l) => l.status.toLowerCase().includes("working") || l.status.toLowerCase().includes("contacted")).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {filteredLeads
                    .filter((l) => l.status.toLowerCase().includes("working") || l.status.toLowerCase().includes("contacted"))
                    .map((lead) => (
                      <div key={lead.id} className="rounded-xl border border-white/10 bg-slate-900/90 p-4 transition hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-100">{lead.name}</h4>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                              <Building2 size={13} className="text-slate-500" />
                              {lead.company}
                            </p>
                          </div>
                          <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                            Active
                          </span>
                        </div>
                        <div className="mt-3 space-y-1 text-xs text-slate-400">
                          {lead.email && <p className="truncate">✉️ {lead.email}</p>}
                          {lead.phone && <p>📞 {lead.phone}</p>}
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                          <button
                            type="button"
                            onClick={() => handleViewLead(lead)}
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickStatusChange(lead.id, "Closed - Converted")}
                            className="flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/30 hover:text-emerald-300"
                          >
                            Close Won 🏆
                          </button>
                        </div>
                      </div>
                    ))}
                  {filteredLeads.filter((l) => l.status.toLowerCase().includes("working") || l.status.toLowerCase().includes("contacted")).length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-500">
                      No active leads
                    </div>
                  )}
                </div>
              </div>

              {/* STAGE 3: CLOSED / QUALIFIED */}
              <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/60 p-4">
                <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="font-semibold text-slate-200">Closed / Converted</h3>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                    {filteredLeads.filter((l) => l.status.toLowerCase().includes("closed") || l.status.toLowerCase().includes("converted") || l.status.toLowerCase().includes("qualified")).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {filteredLeads
                    .filter((l) => l.status.toLowerCase().includes("closed") || l.status.toLowerCase().includes("converted") || l.status.toLowerCase().includes("qualified"))
                    .map((lead) => (
                      <div key={lead.id} className="rounded-xl border border-white/10 bg-slate-900/90 p-4 transition hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-100">{lead.name}</h4>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                              <Building2 size={13} className="text-slate-500" />
                              {lead.company}
                            </p>
                          </div>
                          <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                            Won 🎉
                          </span>
                        </div>
                        <div className="mt-3 space-y-1 text-xs text-slate-400">
                          {lead.email && <p className="truncate">✉️ {lead.email}</p>}
                          {lead.phone && <p>📞 {lead.phone}</p>}
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                          <button
                            type="button"
                            onClick={() => handleViewLead(lead)}
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            Details
                          </button>
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <Check size={13} /> Converted
                          </span>
                        </div>
                      </div>
                    ))}
                  {filteredLeads.filter((l) => l.status.toLowerCase().includes("closed") || l.status.toLowerCase().includes("converted") || l.status.toLowerCase().includes("qualified")).length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-500">
                      No converted leads yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-4">Lead Name</th>
                  <th className="px-5 py-4">Company</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="group transition-all duration-200 hover:bg-cyan-500/[0.05]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 font-bold text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                            {lead.name}
                          </p>
                          <span className="text-xs text-slate-500">
                            Salesforce Lead
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Building2 size={15} className="text-slate-500 shrink-0 group-hover:text-cyan-400 transition-colors" />
                        <span>{lead.company}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Mail size={14} className="text-cyan-400 shrink-0" />
                          <span className="truncate max-w-[180px]">
                            {lead.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Phone size={14} className="text-cyan-400 shrink-0" />
                          <span>{lead.phone}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          lead.status
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                        {lead.status}
                      </span>
                    </td>

                    <td className="relative px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenAction(
                            openAction === lead.id ? null : lead.id
                          )
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openAction === lead.id && (
                        <div className="absolute right-6 top-12 z-30 w-36 rounded-xl border border-white/10 bg-slate-800 p-1.5 text-left shadow-2xl">
                          <button
                            type="button"
                            onClick={() => handleViewLead(lead)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
                          >
                            <Eye size={15} />
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(lead)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-cyan-400 transition hover:bg-cyan-500/10"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLeads.length === 0 && (
              <div className="p-16 text-center">
                <Users size={40} className="mx-auto mb-3 text-slate-600" />
                <p className="font-semibold text-slate-300">No leads match your filter</p>
                <p className="mt-1 text-sm text-slate-500">
                  Try another keyword or status filter.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD LEAD MODAL */}
      {showAddModal && (
        <LeadFormModal
          title="Add New Lead"
          subtitle="Add a customer or prospect to your CRM."
          form={form}
          setForm={setForm}
          saving={saving}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddLead}
          buttonText={saving ? "Saving..." : "Save Lead"}
        />
      )}

      {/* EDIT LEAD MODAL */}
      {showEditModal && (
        <LeadFormModal
          title="Edit Lead"
          subtitle="Update lead information."
          form={form}
          setForm={setForm}
          saving={saving}
          onClose={() => {
            setShowEditModal(false);
            setSelectedLead(null);
          }}
          onSubmit={handleUpdateLead}
          buttonText={saving ? "Updating..." : "Update Lead"}
        />
      )}

      {/* VIEW LEAD MODAL */}
      {showViewModal && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div>
                <h2 className="text-xl font-bold">Lead Details</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Salesforce CRM record.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedLead(null);
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 font-bold text-lg">
                  {selectedLead.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-bold">{selectedLead.name}</p>
                  <p className="text-xs text-slate-400">Salesforce Contact</p>
                </div>
              </div>

              <div className="grid gap-3 pt-2">
                <div className="rounded-xl border border-white/10 bg-slate-950 p-3.5">
                  <span className="text-xs text-slate-500">Company</span>
                  <p className="text-sm font-medium text-slate-200 mt-0.5">
                    {selectedLead.company}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950 p-3.5">
                  <span className="text-xs text-slate-500">Email</span>
                  <p className="text-sm font-medium text-slate-200 mt-0.5 break-all">
                    {selectedLead.email}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950 p-3.5">
                  <span className="text-xs text-slate-500">Phone</span>
                  <p className="text-sm font-medium text-slate-200 mt-0.5">
                    {selectedLead.phone}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950 p-3.5">
                  <span className="text-xs text-slate-500">Status</span>
                  <div className="mt-1">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(
                        selectedLead.status
                      )}`}
                    >
                      {selectedLead.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-5">
              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedLead(null);
                }}
                className="w-full rounded-xl bg-cyan-500 py-2.5 font-semibold text-sm transition hover:bg-cyan-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
        {/* FLOATING TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-cyan-500/40 bg-slate-900/95 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl shadow-cyan-500/25 backdrop-blur-md transition-all duration-300">
            <Sparkles size={18} className="text-cyan-400 shrink-0 animate-pulse" />
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="ml-2 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}
        </div>
      </section>
    </main>
  );
}

// =============================================================
// REUSABLE LEAD FORM MODAL
// =============================================================

type LeadFormModalProps = {
  title: string;
  subtitle: string;
  form: LeadForm;
  setForm: React.Dispatch<React.SetStateAction<LeadForm>>;
  saving: boolean;
  onClose: () => void;
  onSubmit: () => void;
  buttonText: string;
};

function LeadFormModal({
  title,
  subtitle,
  form,
  setForm,
  saving,
  onClose,
  onSubmit,
  buttonText,
}: LeadFormModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter full name"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Company</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Enter company name"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter email address"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Enter phone number"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
            >
              <option value="Open - Not Contacted">Open - Not Contacted</option>
              <option value="Working - Contacted">Working - Contacted</option>
              <option value="Closed - Converted">Closed - Converted</option>
              <option value="Qualified">Qualified</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-slate-300 transition hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold transition hover:bg-cyan-600 disabled:opacity-50"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}