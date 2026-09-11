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
