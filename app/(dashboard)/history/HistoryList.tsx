"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  FileText,
  DoorOpen,
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

type Filter = "all" | "submitted" | "terminated";
type Sort = "recent" | "oldest" | "score_high" | "score_low";

export default function HistoryList({ attempts }: { attempts: any[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("recent");
  const [showFilters, setShowFilters] = useState(false);

  const processed = useMemo(() => {
    let result = [...attempts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) => {
        const title = (a.quizzes?.title ?? "").toLowerCase();
        const room = (a.quizzes?.rooms?.name ?? "").toLowerCase();
        return title.includes(q) || room.includes(q);
      });
    }

    if (filter !== "all") {
      result = result.filter((a) => a.status === filter);
    }

    result.sort((a, b) => {
      const getPct = (x: any) =>
        x.total_points > 0 ? Math.round((x.score / x.total_points) * 100) : 0;

      switch (sort) {
        case "score_high":
          return getPct(b) - getPct(a);
        case "score_low":
          return getPct(a) - getPct(b);
        case "oldest":
          return (
            new Date(a.submitted_at ?? 0).getTime() -
            new Date(b.submitted_at ?? 0).getTime()
          );
        case "recent":
        default:
          return (
            new Date(b.submitted_at ?? 0).getTime() -
            new Date(a.submitted_at ?? 0).getTime()
          );
      }
    });

    return result;
  }, [attempts, search, filter, sort]);

  const counts = useMemo(
    () => ({
      all: attempts.length,
      submitted: attempts.filter((a) => a.status === "submitted").length,
      terminated: attempts.filter((a) => a.status === "terminated").length,
    }),
    [attempts],
  );

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search quiz or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
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
          <Card className="p-3 space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Status
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { value: "all", label: "All" },
                    { value: "submitted", label: "Passed/Taken" },
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
                    { value: "score_high", label: "Score (High→Low)" },
                    { value: "score_low", label: "Score (Low→High)" },
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
              Reset filters
            </button>
          </Card>
        )}

        <p className="text-xs text-muted-foreground">
          Showing <b className="text-foreground">{processed.length}</b> of{" "}
          {attempts.length}
        </p>
      </div>

      {/* List */}
      {processed.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={
            attempts.length === 0
              ? "Wala ka pang quiz attempts"
              : "Walang tumutugma sa filter"
          }
          description={
            attempts.length === 0
              ? "Kapag nag-take ka ng quiz, lalabas dito ang resulta."
              : "Subukan i-reset ang filters o palitan ang search."
          }
        />
      ) : (
        <ul className="space-y-3">
          {processed.map((a: any) => (
            <HistoryCard key={a.id} attempt={a} />
          ))}
        </ul>
      )}
    </div>
  );
}

// =====================================================
// History Card
// =====================================================
function HistoryCard({ attempt }: { attempt: any }) {
  const quiz = attempt.quizzes;
  const room = quiz?.rooms;

  const percentage =
    attempt.total_points > 0
      ? Math.round((attempt.score / attempt.total_points) * 100)
      : 0;

  const isTerminated = attempt.status === "terminated";
  const passed = !isTerminated && percentage >= 60;

  return (
    <li>
      <Link
        href={`/quiz/${quiz.id}/result?from=history`}
        className="block bg-card rounded-2xl border border-border shadow-sm hover:border-brand/40 hover:shadow-md transition-all active:scale-[0.99]"
      >
        <div className="p-4 flex items-start gap-3">
          {/* Icon */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isTerminated
                ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
                : passed
                  ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300"
                  : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
            }`}
          >
            {isTerminated ? (
              <XCircle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{quiz.title}</p>
            {room?.name && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <DoorOpen className="w-3 h-3" />
                {room.name}
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <Badge variant={isTerminated ? "danger" : "success"}>
                {isTerminated ? "Terminated" : "Submitted"}
              </Badge>
              {attempt.submitted_at && (
                <Badge variant="default">
                  <Calendar className="w-3 h-3" />
                  {new Date(attempt.submitted_at).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>

          {/* Score */}
          <div className="text-right shrink-0">
            {isTerminated ? (
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                0
              </p>
            ) : (
              <>
                <p className="text-lg font-bold leading-none">
                  {attempt.score}
                  <span className="text-muted-foreground text-sm">
                    /{attempt.total_points}
                  </span>
                </p>
                <p
                  className={`text-xs mt-0.5 ${
                    passed
                      ? "text-green-600 dark:text-green-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {percentage}%
                </p>
              </>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}
