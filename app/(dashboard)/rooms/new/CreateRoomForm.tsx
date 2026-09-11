"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DoorOpen } from "lucide-react";
import { createRoom } from "../actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";

export default function CreateRoomForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createRoom(formData);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    router.push("/rooms");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Icon banner */}
      <div className="flex flex-col items-center py-4">
        <div className="w-16 h-16 rounded-3xl bg-brand text-brand-foreground flex items-center justify-center shadow-lg shadow-brand/20 mb-2">
          <DoorOpen className="w-8 h-8" />
        </div>
        <p className="text-xs text-muted-foreground">
          A room can hold multiple quizzes
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <Card className="p-4 space-y-4">
        <Input
          name="name"
          label="Room Name *"
          placeholder="e.g. Math 101 - Section A"
          required
          autoFocus
        />

        <Input name="subject" label="Subject" placeholder="e.g. Mathematics" />

        <Textarea
          name="description"
          label="Description"
          rows={3}
          placeholder="Optional notes for students"
        />
      </Card>

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        {loading ? "Creating..." : "Create Room"}
      </Button>
    </form>
  );
}
