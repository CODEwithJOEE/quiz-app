"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  ArrowUpDown,
  Users,
  Download,
  CheckSquare,
  Square,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import AttemptRow from "./AttemptRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { teacherBulkTerminate } from "../attempt-actions";

type Filter = "all" | "in_progress" | "submitted" | "terminated";
type Sort = "name" | "score_desc" | "score_asc" | "recent" | "oldest";

export default function AttemptsList({ attempts }: { attempts: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  // Compute filtered + sorted list
  const processed = useMemo(() => {
    let result = [...attempts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) => {
        const name = (a.profiles?.full_name ?? "").toLowerCase();
        const email = (a.profiles?.email ?? "").toLowerCase();
        return name.includes(q) || email.includes(q);
      });
    }

    if (filter !== "all") {
      result = result.filter((a) => a.status === filter);
    }

    result.sort((a, b) => {
      switch (sort) {
        case "name":
          return (a.profiles?.full_name ?? "").localeCompare(
            b.profiles?.full_name ?? "",
          );
        case "score_desc":
          return (b.score ?? 0) - (a.score ?? 0);
        case "score_asc":
          return (a.score ?? 0) - (b.score ?? 0);
        case "oldest":
          return (
            new Date(a.started_at ?? 0).getTime() -
            new Date(b.started_at ?? 0).getTime()
          );
        case "recent":
        default:
          return (
            new Date(b.started_at ?? 0).getTime() -
            new Date(a.started_at ?? 0).getTime()
          );
      }
    });

    return result;
  }, [attempts, search, filter, sort]);

  const counts = useMemo(
    () => ({
      all: attempts.length,
      in_progress: attempts.filter((a) => a.status === "in_progress").length,
      submitted: attempts.filter((a) => a.status === "submitted").length,
      terminated: attempts.filter((a) => a.status === "terminated").length,
    }),
    [attempts],
  );

  // Filtered in-progress only (bulk terminate eligible)
  const filteredInProgress = processed.filter(
    (a) => a.status === "in_progress",
  );

  // Selection helpers
  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(processed.map((a) => a.id)));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function selectAllInProgress() {
    setSelected(new Set(filteredInProgress.map((a) => a.id)));
  }

  // Checkbox state
  const allSelected =
    processed.length > 0 && processed.every((a) => selected.has(a.id));
  const someSelected = selected.size > 0 && !allSelected;

  // Bulk terminate
  function handleBulkTerminate() {
    const count = selected.size;
    if (count === 0) return;

    // Filter only in-progress from selection
    const inProgressIds = processed
      .filter((a) => selected.has(a.id) && a.status === "in_progress")
      .map((a) => a.id);

    if (inProgressIds.length === 0) {
      alert(
        "Walang in_progress attempts sa selection. Yung submitted at terminated ay hindi na pwedeng i-terminate.",
      );
      return;
    }

    if (
      !confirm(
        `Terminate ${inProgressIds.length} in-progress attempt(s)?\n\nZero ang score at hindi na makakapag-submit ang mga students.`,
      )
    )
      return;

    startTransition(async () => {
      const res = await teacherBulkTerminate(inProgressIds);
      if (res?.error) {
        alert(res.error);
        return;
      }
      clearSelection();
      router.refresh();
    });
  }

  // Export CSV
  function handleExport() {
    const toExport =
      selected.size > 0
        ? processed.filter((a) => selected.has(a.id))
        : processed;

    const rows = toExport.map((a) => ({
      Student: a.profiles?.full_name ?? "",
      Email: a.profiles?.email ?? "",
      Status: a.status,
      Score: `${a.score} / ${a.total_points}`,
      Percentage:
        a.total_points > 0
          ? `${Math.round((a.score / a.total_points) * 100)}%`
          : "0%",
      Violations: a.integrity_count ?? 0,
      "Started At": a.started_at ? new Date(a.started_at).toLocaleString() : "",
      "Submitted At": a.submitted_at
        ? new Date(a.submitted_at).toLocaleString()
        : "",
      "Termination Reason": a.termination_reason ?? "",
    }));

    if (rows.length === 0) return;

    const headers = Object.keys(rows[0]);
    const csvLines = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const val = String((r as any)[h] ?? "");
            if (val.includes(",") || val.includes('"') || val.includes("\n")) {
              return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
          })
          .join(","),
      ),
    ];

    const blob = new Blob([csvLines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attempts-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-3">
      {/* Selection toolbar (sticky) */}
      {selected.size > 0 && (
        <div className="sticky top-2 z-20 bg-brand text-brand-foreground rounded-2xl p-3 shadow-lg flex items-center gap-2 animate-fade-in">
          <button
            onClick={clearSelection}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center shrink-0"
            aria-label="Clear selection"
          >
            <XCircle className="w-4 h-4" />
          </button>
          <p className="flex-1 text-sm font-medium">{selected.size} selected</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBulkTerminate}
            disabled={pending}
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            {pending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            {pending ? "Processing..." : "Bulk Terminate"}
          </Button>
        </div>
      )}

      {/* Toolbar */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search student name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`h-10 px-3 rounded-xl border transition-colors flex items-center gap-1.5 text-sm font-medium shrink-0 ${
              showFilters
                ? "border-brand bg-blue-50 dark:bg-blue-950 text-brand"
                : "border-border bg-background hover:bg-muted"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {showFilters && (
          <div className="bg-card rounded-2xl border border-border p-3 space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Status
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { value: "all", label: "All" },
                    { value: "in_progress", label: "In Progress" },
                    { value: "submitted", label: "Submitted" },
                    { value: "terminated", label: "Terminated" },
                  ] as { value: Filter; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filter === opt.value
                        ? "bg-brand text-brand-foreground"
                        : "bg-muted text-muted-foreground hover:bg-border"
                    }`}
                  >
                    {opt.label} ({counts[opt.value]})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Sort by
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { value: "recent", label: "Most Recent" },
                    { value: "oldest", label: "Oldest" },
                    { value: "name", label: "Name (A-Z)" },
                    { value: "score_desc", label: "Score (High→Low)" },
                    { value: "score_asc", label: "Score (Low→High)" },
                  ] as { value: Sort; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      sort === opt.value
                        ? "bg-brand text-brand-foreground"
                        : "bg-muted text-muted-foreground hover:bg-border"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSearch("");
                setFilter("all");
                setSort("recent");
              }}
              className="text-xs text-brand font-medium hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Selection + bulk actions */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            {processed.length > 0 && (
              <>
                <button
                  onClick={allSelected ? clearSelection : selectAll}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium"
                >
                  {allSelected ? (
                    <CheckSquare className="w-3.5 h-3.5" />
                  ) : (
                    <Square className="w-3.5 h-3.5" />
                  )}
                  {allSelected ? "Deselect all" : "Select all"}
                </button>
                {filteredInProgress.length > 0 && (
                  <>
                    <span className="text-border">|</span>
                    <button
                      onClick={selectAllInProgress}
                      className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
                    >
                      Select {filteredInProgress.length} in-progress
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">
              <b className="text-foreground">{processed.length}</b> of{" "}
              {attempts.length}
            </p>
            {processed.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="text-brand hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <Download className="w-3.5 h-3.5" />
                {selected.size > 0 ? `Export (${selected.size})` : "Export CSV"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      {processed.length === 0 ? (
        <EmptyState
          icon={Users}
          title={
            attempts.length === 0
              ? "Wala pang attempts"
              : "Walang tumutugma sa filter"
          }
          description={
            attempts.length === 0
              ? "Hintayin ang students na mag-take ng quiz."
              : "Subukan i-reset ang filters o palitan ang search."
          }
        />
      ) : (
        <ul className="space-y-3">
          {processed.map((a: any) => (
            <AttemptRow
              key={a.id}
              attempt={a}
              selected={selected.has(a.id)}
              onToggle={() => toggleOne(a.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
