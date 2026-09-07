"use client";

import {
  Search,
  RefreshCw,
  X,
  Mail,
  Phone,
  Building2,
  User,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState } from "react";

type Lead = {
  id: string;
  name: string;
  company: string;
  status: string;
  email: string;
  phone: string;
};

type ApiLead = Record<string, unknown>;

function normalizeLead(lead: ApiLead, index: number): Lead {
  return {
    id: String(
      lead.id ??
        lead.Id ??
        lead.ID ??
        `salesforce-lead-${index}`,
    ),

    name: String(
      lead.name ??
        lead.Name ??
        "Unknown Lead",
    ),

    company: String(
      lead.company ??
        lead.Company ??
        "Unknown Company",
    ),

    status: String(
      lead.status ??
        lead.Status ??
        "Unknown",
    ),

    email: String(
      lead.email ??
        lead.Email ??
        "-",
    ),

    phone: String(
      lead.phone ??
        lead.Phone ??
        "-",
    ),
  };
}

export default function CRMTable() {
  const [leads, setLeads] = useState<Lead[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  // Selected lead for details modal
  const [selectedLead, setSelectedLead] =
    useState<Lead | null>(null);

  const loadLeads = async (
    isRefresh = false,
  ) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch(
        "/api/salesforce/leads",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Salesforce connection is missing or expired. Please connect Salesforce.",
        );
      }

      const rawLeads = Array.isArray(data)
        ? data
        : Array.isArray(data?.leads)
          ? data.leads
          : Array.isArray(data?.records)
            ? data.records
            : Array.isArray(data?.data)
              ? data.data
              : [];

      const normalizedLeads = rawLeads.map(
        (lead: ApiLead, index: number) =>
          normalizeLead(lead, index),
      );

      setLeads(normalizedLeads);
    } catch (err) {
      console.error(
        "CRM Salesforce Leads error:",
        err,
      );

      setLeads([]);

      setError(
        err instanceof Error
          ? err.message
          : "Salesforce connection is missing or expired. Please connect Salesforce.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchInitialLeads = async () => {
      await loadLeads(false);
    };

    void fetchInitialLeads();
  }, []);

  // -----------------------------------------
  // Search + Filter
  // -----------------------------------------

  const filteredLeads = leads.filter((lead) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      lead.name.toLowerCase().includes(query) ||
      lead.company.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.phone.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" ||
      lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // -----------------------------------------
  // Status options
  // -----------------------------------------

  const statuses = Array.from(
    new Set(
      leads
        .map((lead) => lead.status)
        .filter(Boolean),
    ),
  );

  // -----------------------------------------
  // Status styling
  // -----------------------------------------

  const getStatusClass = (status: string) => {
    const value = status.toLowerCase();

    if (
      value.includes("qualified") ||
      value.includes("working")
    ) {
      return "bg-green-500/10 text-green-400 border-green-500/20";
    }

    if (
      value.includes("contacted")
    ) {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }

    if (
      value.includes("open") ||
      value.includes("new")
    ) {
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    }

    return "bg-slate-500/10 text-slate-300 border-slate-500/20";
  };

  return (
    <>
      <section className="w-full rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-white shadow-xl">
        {/* ---------------------------------- */}
        {/* Header */}
        {/* ---------------------------------- */}

        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">
              CRM Leads
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Latest leads from Salesforce
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void loadLeads(true);
            }}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* ---------------------------------- */}
        {/* Search + Filter */}
        {/* ---------------------------------- */}

        <div className="mb-5 flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-slate-950 px-4 py-3">
            <Search
              size={17}
              className="shrink-0 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search name, company, email..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none md:w-48"
          >
            <option value="All">
              All
            </option>

            {statuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* ---------------------------------- */}
        {/* Count */}
        {/* ---------------------------------- */}

        <div className="mb-4 text-xs text-slate-500">
          Showing {filteredLeads.length} of{" "}
          {leads.length} leads
        </div>

        {/* ---------------------------------- */}
        {/* Error */}
        {/* ---------------------------------- */}

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="font-semibold text-red-400">
              Salesforce connection error
            </p>

            <p className="mt-1 text-sm text-slate-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/api/auth/salesforce";
              }}
              className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600"
            >
              Connect Salesforce
            </button>
          </div>
        )}

        {/* ---------------------------------- */}
        {/* Loading */}
        {/* ---------------------------------- */}

        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={24}
                className="mx-auto animate-spin text-cyan-400"
              />

              <p className="mt-3 text-sm text-slate-400">
                Loading Salesforce leads...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-500">
            No Salesforce leads available.
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-500">
            No leads found.
          </div>
        ) : (
          /* ---------------------------------- */
          /* Table */
          /* ---------------------------------- */

          <div className="overflow-x-auto rounded-xl border border-white/5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full min-w-[620px]">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3.5">
                    Name
                  </th>

                  <th className="px-4 py-3.5">
                    Company
                  </th>

                  <th className="px-4 py-3.5">
                    Status
                  </th>

                  <th className="px-4 py-3.5">
                    Contact
                  </th>

                  <th className="px-4 py-3.5 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="group border-b border-white/5 transition-all duration-200 hover:bg-cyan-500/[0.05]"
                  >
                    {/* Name */}

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-500 font-bold text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                          {lead.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {lead.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            Lead
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Company */}

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Building2
                          size={14}
                          className="text-cyan-400 group-hover:text-cyan-300 transition-colors"
                        />

                        {lead.company}
                      </div>
                    </td>

                    {/* Status */}

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(
                          lead.status,
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                        {lead.status}
                      </span>
                    </td>

                    {/* Contact */}

                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <Mail
                            size={13}
                            className="text-cyan-400"
                          />

                          <span>
                            {lead.email}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone
                            size={13}
                            className="text-cyan-400"
                          />

                          <span>
                            {lead.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Action */}

                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedLead(lead)
                        }
                        className="rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition hover:border-cyan-500/40 hover:bg-slate-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ================================================= */}
      {/* LEAD DETAILS MODAL */}
      {/* ================================================= */}

      {selectedLead && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedLead(null);
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Lead Details
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Salesforce Lead
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedLead(null)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}

            <div className="space-y-5 p-6">
              {/* Name */}

              <div>
                <p className="mb-1 text-xs text-slate-500">
                  Name
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-bold">
                    {selectedLead.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <p className="font-semibold text-white">
                    {selectedLead.name}
                  </p>
                </div>
              </div>

              {/* Company */}

              <div>
                <p className="mb-1 text-xs text-slate-500">
                  Company
                </p>

                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <Building2
                    size={16}
                    className="text-cyan-400"
                  />

                  {selectedLead.company}
                </div>
              </div>

              {/* Status */}

              <div>
                <p className="mb-1 text-xs text-slate-500">
                  Status
                </p>

                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                    selectedLead.status,
                  )}`}
                >
                  {selectedLead.status}
                </span>
              </div>

              {/* Email */}

              <div>
                <p className="mb-1 text-xs text-slate-500">
                  Email
                </p>

                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <Mail
                    size={16}
                    className="text-cyan-400"
                  />

                  {selectedLead.email}
                </div>
              </div>

              {/* Phone */}

              <div>
                <p className="mb-1 text-xs text-slate-500">
                  Phone
                </p>

                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <Phone
                    size={16}
                    className="text-cyan-400"
                  />

                  {selectedLead.phone}
                </div>
              </div>
            </div>

            {/* Modal Footer */}

            <div className="border-t border-white/10 px-6 py-4">
              <button
                type="button"
                onClick={() =>
                  setSelectedLead(null)
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-white transition hover:bg-cyan-600"
              >
                <X size={16} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}