"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserMinus, X, AlertCircle, Check, Loader2 } from "lucide-react";
import { removeStudentFromRoom } from "./manage-actions";
import { Button } from "@/components/ui/Button";

export default function RemoveStudentModal({
  roomId,
  studentId,
  studentName,
  studentEmail,
}: {
  roomId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
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
      const res = await removeStudentFromRoom(roomId, studentId);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setSuccess(true);
      router.refresh();
      setTimeout(handleClose, 1200);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors"
        aria-label="Remove student"
        title="Remove from room"
      >
        <UserMinus className="w-3.5 h-3.5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-xl border border-border p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 flex items-center justify-center shrink-0">
              <UserMinus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Remove Student</h2>
              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                {studentName}
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
            <span>Removed from room</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Content */}
        {!success && (
          <>
            <div className="bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-300 p-3 rounded-xl text-xs space-y-1">
              <p className="font-medium">
                I-remove si {studentName} sa room na ito?
              </p>
              <ul className="list-disc list-inside space-y-0.5 ml-1">
                <li>Hindi na siya makikita sa room</li>
                <li>Hindi siya makaka-access sa quizzes dito</li>
                <li>
                  <b>Naka-save pa ang attempts niya</b>
                </li>
                <li>Pwedeng i-invite ulit anytime</li>
              </ul>
              <p className="text-[10px] text-red-700 dark:text-red-400 mt-1.5">
                Email: {studentEmail}
              </p>
            </div>

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
                {pending ? "Removing..." : "Remove"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
