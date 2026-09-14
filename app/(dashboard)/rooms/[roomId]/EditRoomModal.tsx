"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X, Check, AlertCircle } from "lucide-react";
import { updateRoom } from "./manage-actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default function EditRoomModal({
  roomId,
  initialName,
  initialSubject,
  initialDescription,
}: {
  roomId: string;
  initialName: string;
  initialSubject: string | null;
  initialDescription: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [subject, setSubject] = useState(initialSubject ?? "");
  const [description, setDescription] = useState(initialDescription ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleOpen() {
    setName(initialName);
    setSubject(initialSubject ?? "");
    setDescription(initialDescription ?? "");
    setError(null);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setError(null);
  }

  function handleSubmit() {
    setError(null);

    if (name.trim().length < 2) {
      setError("Room name is required");
      return;
    }

    startTransition(async () => {
      const res = await updateRoom(roomId, {
        name,
        subject: subject || null,
        description: description || null,
      });

      if (res?.error) {
        setError(res.error);
        return;
      }

      setOpen(false);
      router.refresh();
    });
  }

  const hasChanges =
    name !== initialName ||
    subject !== (initialSubject ?? "") ||
    description !== (initialDescription ?? "");

  if (!open) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:bg-blue-50 dark:hover:bg-blue-950 px-2.5 py-1.5 rounded-lg transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-xl border border-border p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
              <Pencil className="w-4 h-4" />
            </div>
            <h2 className="font-semibold text-sm">Edit Room</h2>
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

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Inputs */}
        <Input
          label="Room Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Math 101 - Section A"
          autoFocus
          maxLength={80}
        />

        <Input
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Mathematics"
          maxLength={60}
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional notes for students"
          rows={3}
        />

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
            onClick={handleSubmit}
            loading={pending}
            disabled={pending || !hasChanges || name.trim().length < 2}
            className="flex-1"
          >
            {!pending && <Check className="w-4 h-4" />}
            {pending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
