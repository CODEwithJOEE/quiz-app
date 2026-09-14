"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Check, Search } from "lucide-react";
import { inviteStudents } from "../actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

type Student = { id: string; full_name: string; email: string };

export default function InviteStudentsPanel({
  roomId,
  availableStudents,
}: {
  roomId: string;
  availableStudents: Student[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleInvite() {
    if (selected.length === 0) return;
    startTransition(async () => {
      const res = await inviteStudents(roomId, selected);
      if (res?.error) {
        setMessage(`Error: ${res.error}`);
        return;
      }
      setMessage(`Invited ${selected.length} student(s).`);
      setSelected([]);
      router.refresh();
    });
  }

  const filtered = availableStudents.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.full_name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  });

  if (availableStudents.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <UserPlus className="w-4 h-4 text-brand" />
          <h2 className="font-semibold">Invite Students</h2>
        </div>
        <EmptyState
          icon={UserPlus}
          title="Wala nang available students"
          description="Lahat ng students mo ay nasa room na, o wala ka pang students."
        />
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <UserPlus className="w-4 h-4 text-brand" />
        <h2 className="font-semibold">Invite Students</h2>
      </div>

      {message && (
        <div className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 p-2 rounded-lg text-sm">
          {message}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
        />
      </div>

      {/* List */}
      <ul className="max-h-64 overflow-y-auto divide-y divide-border border border-border rounded-xl">
        {filtered.map((s) => {
          const isSelected = selected.includes(s.id);
          const initials = s.full_name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => toggle(s.id)}
                className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-950/40"
                    : "hover:bg-muted/50"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate transition-colors ${
                      isSelected
                        ? "text-blue-900 dark:text-blue-100"
                        : "text-foreground"
                    }`}
                  >
                    {s.full_name}
                  </p>
                  <p
                    className={`text-xs truncate transition-colors ${
                      isSelected
                        ? "text-blue-700 dark:text-blue-200"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s.email}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-border"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <Button
        onClick={handleInvite}
        disabled={selected.length === 0 || pending}
        loading={pending}
        className="w-full"
      >
        {pending ? "Inviting..." : `Invite Selected (${selected.length})`}
      </Button>
    </Card>
  );
}
