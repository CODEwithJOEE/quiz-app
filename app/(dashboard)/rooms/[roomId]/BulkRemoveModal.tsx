"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Users, X, AlertCircle, Check, UserMinus } from "lucide-react";
import { bulkRemoveStudentsFromRoom } from "./manage-actions";
import { Button } from "@/components/ui/Button";

export default function BulkRemoveModal({
  roomId,
  selectedIds,
  selectedNames,
  onComplete,
}: {
  roomId: string;
  selectedIds: string[];
  selectedNames: string[];
  onComplete: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleOpen() {
    setError(null);
    setSuccess(false);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setError(null);
      setSuccess(false);
    }, 200);
  }

  function handleRemove() {
    setError(null);
    startTransition(async () => {
      const res = await bulkRemoveStudentsFromRoom(roomId, selectedIds);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setSuccess(true);
      router.refresh();
      setTimeout(() => {
        handleClose();
        onComplete();
      }, 1200);
    });
  }

  const count = selectedIds.length;

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        disabled={count === 0}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <UserMinus className="w-3.5 h-3.5" />
        Remove ({count})
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-card rounded-2xl shadow-xl border border-border p-5 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-semibold text-sm">
                    Remove {count} Student{count !== 1 ? "s" : ""}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    From this room
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={pending}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success */}
            {success && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm">
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Removed {count} student(s)</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!success && (
              <>
                {/* Warning */}
                <div className="bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300 p-3 rounded-xl text-xs space-y-1">
                  <p className="font-medium">
                    I-remove ang {count} student{count !== 1 ? "s" : ""} sa room
                    na ito?
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 ml-1">
                    <li>Hindi na sila makikita sa room</li>
                    <li>
                      <b>Naka-save pa ang attempts nila</b>
                    </li>
                    <li>Pwedeng i-invite ulit anytime</li>
                  </ul>
                </div>

                {/* Selected names preview */}
                <div className="bg-muted rounded-xl p-3 max-h-32 overflow-y-auto">
                  <p className="text-xs font-medium mb-1.5">Mga tatanggalin:</p>
                  <ul className="text-xs space-y-0.5 text-muted-foreground">
                    {selectedNames.slice(0, 5).map((name, i) => (
                      <li key={i} className="truncate">
                        • {name}
                      </li>
                    ))}
                    {selectedNames.length > 5 && (
                      <li className="italic">
                        ...at {selectedNames.length - 5} pang iba
                      </li>
                    )}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={pending}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRemove}
                    loading={pending}
                    variant="danger"
                    className="flex-1"
                  >
                    {!pending && <UserMinus className="w-4 h-4" />}
                    {pending ? "Removing..." : `Remove ${count}`}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
