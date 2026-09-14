"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock, RotateCcw, AlertTriangle, Loader2, Mail } from "lucide-react";
import { restoreStudent } from "./delete-actions";
import { Button } from "@/components/ui/Button";

export default function PendingDeletionCard({ student }: { student: any }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = student.full_name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Days remaining
  const now = new Date();
  const deleteDate = new Date(student.deletion_scheduled_for);
  const msLeft = deleteDate.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));

  // Urgency tiers
  const isUrgent = daysLeft <= 2;
  const isCritical = daysLeft <= 1;

  const deleteDateStr = deleteDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  function handleRestore() {
    setError(null);
    startTransition(async () => {
      const res = await restoreStudent(student.id);
      if (res?.error) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <li
      className={`p-3 rounded-2xl border shadow-sm space-y-2 ${
        isCritical
          ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-900 animate-warning-pulse"
          : isUrgent
            ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900"
            : "bg-card border-border"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
            isCritical || isUrgent
              ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
              : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
          }`}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{student.full_name}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="w-3 h-3" />
            <span className="truncate">{student.email}</span>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setConfirming(true)}
          disabled={pending}
          className="shrink-0"
        >
          {pending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RotateCcw className="w-3.5 h-3.5" />
          )}
          Restore
        </Button>
      </div>

      {/* Countdown */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
          isCritical
            ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
            : isUrgent
              ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
              : "bg-muted text-muted-foreground"
        }`}
      >
        <Clock className="w-3.5 h-3.5 shrink-0" />
        {isCritical ? (
          <>
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>
              <b>Deletes tomorrow!</b> ({deleteDateStr})
            </span>
          </>
        ) : (
          <span>
            Deletes in{" "}
            <b>
              {daysLeft} day{daysLeft !== 1 ? "s" : ""}
            </b>{" "}
            ({deleteDateStr})
          </span>
        )}
      </div>

      {/* Confirm restore */}
      {confirming && (
        <div className="bg-card rounded-xl p-3 space-y-2 border border-border">
          <p className="text-xs font-medium">
            I-restore si {student.full_name}?
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirming(false)}
              disabled={pending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleRestore}
              loading={pending}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {pending ? "Restoring..." : "Restore"}
            </Button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-2 rounded-lg text-xs">
          {error}
        </div>
      )}
    </li>
  );
}
