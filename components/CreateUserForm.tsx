"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";

type AllowedRole = "teacher" | "student";

export default function CreateUserForm({
  allowedRoles,
}: {
  allowedRoles: AllowedRole[];
}) {
  const t = useTranslations("CreateUser");
  const tRoles = useTranslations("Roles");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<AllowedRole>(allowedRoles[0]);
  const [gradeLevel, setGradeLevel] = useState("");
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        role,
        grade_level: role === "student" ? gradeLevel : null,
        section: role === "student" ? section : null,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage({ type: "err", text: data.error ?? t("errorGeneric") });
      return;
    }

    setMessage({
      type: "ok",
      text: t("createdMessage", { role: tRoles(role), email }),
    });
    setEmail("");
    setPassword("");
    setFullName("");
    setGradeLevel("");
    setSection("");
    router.refresh();
  }

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-brand text-brand-foreground flex items-center justify-center">
          <UserPlus className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-semibold text-sm">{t("title")}</h2>
          <p className="text-xs text-muted-foreground">
            {allowedRoles.length > 1 ? t("subtitle") : t("subtitleStudent")}
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-start gap-2 p-3 rounded-xl text-sm ${
            message.type === "ok"
              ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
              : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
          }`}
        >
          {message.type === "ok" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none mt-[10px]" />
          <Input
            label={t("fullName")}
            placeholder={t("fullNamePlaceholder")}
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none mt-[10px]" />
          <Input
            label={t("email")}
            type="email"
            placeholder={t("emailPlaceholder")}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none mt-[10px]" />
          <Input
            label={t("password")}
            type="text"
            placeholder={t("passwordPlaceholder")}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
          />
        </div>

        {allowedRoles.length > 1 && (
          <div>
            <label className="text-sm font-medium text-foreground">
              {t("role")}
            </label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {allowedRoles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`h-11 rounded-xl border-2 text-sm font-medium transition-all ${
                    role === r
                      ? "border-brand bg-blue-50 dark:bg-blue-950 text-brand"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  {r === "teacher" ? t("teacher") : t("student")}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grade Level + Section — students only */}
        {role === "student" && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-brand" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("gradeSection")}
              </p>
            </div>

            <Input
              label={t("gradeLevel")}
              placeholder={t("gradeLevelPlaceholder")}
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
            />

            <Input
              label={t("section")}
              placeholder={t("sectionPlaceholder")}
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          {loading ? t("creating") : t("create")}
        </Button>
      </form>
    </Card>
  );
}
