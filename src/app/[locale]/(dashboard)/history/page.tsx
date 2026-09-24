export const dynamic = "force-dynamic";

import { redirect, Link } from "@/i18n/navigation";
import {
  History,
  CheckCircle2,
  TrendingUp,
  Award,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { getStudentHistory, getStudentStats } from "./actions";
import HistoryList from "./HistoryList";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("History");

  const me = await getCurrentProfile();
  if (!me) {
    redirect({ href: "/login", locale });
    return null;
  }
  if (me.role !== "student") {
    redirect({ href: "/home", locale });
    return null;
  }

  const [historyRes, statsRes] = await Promise.all([
    getStudentHistory(),
    getStudentStats(),
  ]);

  const attempts =
    historyRes && "attempts" in historyRes ? (historyRes.attempts ?? []) : [];
  const stats =
    statsRes && "stats" in statsRes && statsRes.stats
      ? statsRes.stats
      : { taken: 0, avg: 0, best: 0, terminated: 0 };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          locale={locale}
          className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-border transition-colors shrink-0"
          aria-label={t("title")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold">{t("title")}</h1>
          <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatBox
          icon={<History className="w-4 h-4" />}
          label={t("quizzesTaken")}
          value={stats.taken}
          tone="blue"
        />
        <StatBox
          icon={<TrendingUp className="w-4 h-4" />}
          label={t("averageScore")}
          value={`${stats.avg}%`}
          tone={stats.avg >= 60 ? "green" : "amber"}
        />
        <StatBox
          icon={<Award className="w-4 h-4" />}
          label={t("bestScore")}
          value={`${stats.best}%`}
          tone="purple"
        />
        <StatBox
          icon={<XCircle className="w-4 h-4" />}
          label={t("terminated")}
          value={stats.terminated}
          tone={stats.terminated > 0 ? "red" : "gray"}
        />
      </div>

      <HistoryList attempts={attempts} />
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  tone: "blue" | "green" | "amber" | "red" | "purple" | "gray";
}) {
  const tones = {
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
    green: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300",
    amber: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    red: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
    purple:
      "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300",
    gray: "bg-muted text-muted-foreground",
  };

  return (
    <div className={`p-3 rounded-2xl ${tones[tone]}`}>
      <div className="flex items-center gap-1.5 opacity-80">
        {icon}
        <p className="text-[10px] font-medium uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
