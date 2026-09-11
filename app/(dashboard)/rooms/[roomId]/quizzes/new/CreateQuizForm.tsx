"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuiz } from "../../quiz-actions";

export default function CreateQuizForm({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createQuiz(formData);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    // Redirect to quiz editor
    router.push(`/quiz/${res.quizId}`);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-2xl shadow-sm space-y-3"
    >
      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
      )}

      <input type="hidden" name="room_id" value={roomId} />

      <div>
        <label className="text-sm font-medium">Quiz Title *</label>
        <input
          name="title"
          required
          placeholder="e.g. Chapter 1 Quiz"
          className="w-full mt-1 px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          rows={2}
          placeholder="Optional"
          className="w-full mt-1 px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Time Limit (minutes, optional)
        </label>
        <input
          type="number"
          name="time_limit_minutes"
          min={1}
          placeholder="Leave blank for no limit"
          className="w-full mt-1 px-3 py-2 border rounded-lg"
        />
      </div>
      {/* Shuffle settings — DAPAT NANDITO, BEFORE SUBMIT */}
      <div className="space-y-2 pt-2">
        <label className="text-sm font-medium">Randomization</label>

        <label className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
          <input
            type="checkbox"
            name="shuffle_questions"
            value="true"
            className="w-4 h-4"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">Shuffle questions</p>
            <p className="text-xs text-muted-foreground">
              Bawat student ay may iba-ibang order ng questions
            </p>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
          <input
            type="checkbox"
            name="shuffle_options"
            value="true"
            className="w-4 h-4"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">Shuffle options</p>
            <p className="text-xs text-muted-foreground">
              Iba-ibang order ng A/B/C/D per student
            </p>
          </div>
        </label>
      </div>

      {/* Submit button — DAPAT ITO SA DULO */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Quiz"}
      </button>
    </form>
  );
}
