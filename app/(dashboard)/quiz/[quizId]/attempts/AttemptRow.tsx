"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Hourglass,
  Ban,
  Clock,
  Calendar,
  ShieldAlert,
  Save,
} from "lucide-react";
import {
  teacherTerminateAttempt,
  teacherOverrideScore,
} from "../attempt-actions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function AttemptRow({ attempt }: { attempt: any }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [overrideValue, setOverrideValue] = useState<string>(
    String(attempt.score),
  );
  const [error, setError] = useState<string | null>(null);

  const percentage =
    attempt.total_points > 0
      ? Math.round((attempt.score / attempt.total_points) * 100)
      : 0;

  const statusConfig = {
    submitted: {
      label: "Submitted",
      icon: CheckCircle2,
      className:
        "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300",
    },
    terminated: {
      label: "Terminated",
      icon: XCircle,
      className: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300",
    },
    in_progress: {
      label: "In Progress",
      icon: Hourglass,
      className:
        "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    },
  }[attempt.status as "submitted" | "terminated" | "in_progress"];

  const StatusIcon = statusConfig.icon;

  const initials = (attempt.profiles?.full_name ?? "??")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleTerminate() {
    if (
      !confirm(
        "Force-terminate this attempt? Zero ang score at hindi na makakapag-submit ang student.",
      )
    )
      return;
    startTransition(async () => {
      const res = await teacherTerminateAttempt(attempt.id, "manual");
      if (res?.error) setError(res.error);
      router.refresh();
    });
  }

  function handleOverride() {
    const num = Number(overrideValue);
    if (isNaN(num)) {
      setError("Invalid score");
      return;
    }
    startTransition(async () => {
      const res = await teacherOverrideScore(attempt.id, num);
      if (res?.error) setError(res.error);
      else {
        setError(null);
        router.refresh();
      }
    });
  }

  return (
    <li className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Row header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {attempt.profiles?.full_name ?? "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {attempt.profiles?.email}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-2">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${statusConfig.className}`}
              >
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </span>
              {attempt.integrity_count > 0 && (
                <Badge variant="warning">
                  <AlertTriangle className="w-3 h-3" />
                  {attempt.integrity_count}
                </Badge>
              )}
            </div>
          </div>

          {/* Score */}
          <div className="text-right shrink-0">
            <p className="text-lg font-bold leading-none">
              {attempt.score}
              <span className="text-muted-foreground text-sm">
                /{attempt.total_points}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {percentage}%
            </p>
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-brand font-medium py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Hide details
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              Show details
            </>
          )}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border p-4 space-y-4 bg-muted/30">
          {/* Timing */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <div>
                <p className="text-[10px]">Started</p>
                <p className="font-medium text-foreground">
                  {attempt.started_at
                    ? new Date(attempt.started_at).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <div>
                <p className="text-[10px]">Submitted</p>
                <p className="font-medium text-foreground">
                  {attempt.submitted_at
                    ? new Date(attempt.submitted_at).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Termination reason */}
          {attempt.termination_reason && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300">
              <Ban className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold">Terminated</p>
                <p className="text-xs mt-0.5">
                  Reason: {attempt.termination_reason}
                </p>
              </div>
            </div>
          )}

          {/* Integrity events */}
          {attempt.integrity_events?.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <p className="font-semibold text-xs">
                  Integrity Events ({attempt.integrity_events.length})
                </p>
              </div>
              <ul className="space-y-1 max-h-40 overflow-y-auto">
                {attempt.integrity_events.map((ev: any) => (
                  <li
                    key={ev.id}
                    className="flex justify-between items-center px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-xs"
                  >
                    <span className="font-medium text-amber-800 dark:text-amber-300">
                      {ev.event_type}
                    </span>
                    <span className="text-amber-600 dark:text-amber-400">
                      {new Date(ev.occurred_at).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            {attempt.status === "in_progress" && (
              <Button
                variant="danger"
                onClick={handleTerminate}
                disabled={pending}
                loading={pending}
                className="w-full"
              >
                {!pending && <Ban className="w-4 h-4" />}
                {pending ? "Terminating..." : "Force Terminate"}
              </Button>
            )}

            {attempt.status !== "in_progress" && (
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium">
                  Override Score
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    max={attempt.total_points}
                    value={overrideValue}
                    onChange={(e) => setOverrideValue(e.target.value)}
                    className="w-20 h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                  <Button
                    onClick={handleOverride}
                    disabled={pending}
                    loading={pending}
                    className="flex-1"
                  >
                    {!pending && <Save className="w-3.5 h-3.5" />}
                    {pending ? "Saving..." : "Save Score"}
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-2 rounded-lg text-xs">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
