"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Sparkles } from "lucide-react";
import { createQuiz } from "../../quiz-actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default function CreateQuizForm({ roomId }: { roomId: string }) {
  const t = useTranslations("QuizCreate");
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

    router.push(`/quiz/${res.quizId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <Card className="p-4 space-y-4">
        <input type="hidden" name="room_id" value={roomId} />

        <Input
          name="title"
          label={t("quizTitle")}
          placeholder={t("quizTitlePlaceholder")}
          required
          autoFocus
        />

        <Textarea
          name="description"
          label={t("description")}
          rows={2}
          placeholder={t("descriptionPlaceholder")}
        />

        <Input
          type="number"
          name="time_limit_minutes"
          label={t("timeLimit")}
          min={1}
          placeholder={t("timeLimitPlaceholder")}
        />
      </Card>

      {/* Shuffle settings */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-brand" />
          <h3 className="font-semibold text-sm">{t("randomization")}</h3>
        </div>

        <label className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
          <input
            type="checkbox"
            name="shuffle_questions"
            value="true"
            className="w-4 h-4 mt-0.5 accent-blue-600"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              {t("shuffleQuestions")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("shuffleQuestionsDesc")}
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
          <input
            type="checkbox"
            name="shuffle_options"
            value="true"
            className="w-4 h-4 mt-0.5 accent-blue-600"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              {t("shuffleOptions")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("shuffleOptionsDesc")}
            </p>
          </div>
        </label>
      </Card>

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        {loading ? t("creating") : t("create")}
      </Button>
    </form>
  );
}
