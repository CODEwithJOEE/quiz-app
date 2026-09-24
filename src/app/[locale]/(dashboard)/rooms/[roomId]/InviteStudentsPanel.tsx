"use client";

import { useState, useTransition, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { UserPlus, Check, Search, Filter } from "lucide-react";
import { inviteStudents } from "../actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import Avatar from "@/components/Avatar";

type Student = {
  id: string;
  full_name: string;
  email: string;
  grade_level?: string | null;
  section?: string | null;
  created_by?: string;
  avatar_url?: string | null;
  avatar_pending?: boolean | null;
  signedAvatarUrl?: string | null;
};

export default function InviteStudentsPanel({
  roomId,
  availableStudents,
  allStudents,
  currentUserId,
}: {
  roomId: string;
  availableStudents: Student[];
  allStudents: Student[];
  currentUserId: string;
}) {
  const t = useTranslations("InvitePanel");
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState<string>("");
  const [showSectionFilter, setShowSectionFilter] = useState(false);
  const [tab, setTab] = useState<"my" | "all">("my");

  const filtered = useMemo(() => {
    const source = tab === "my" ? availableStudents : allStudents;

    return source.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        s.full_name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q);

      let matchesSection = true;
      if (sectionFilter) {
        const [filterGrade, filterSection] = sectionFilter
          .split(" - ")
          .map((p) => p.trim().toLowerCase());

        const studentGrade = (s.grade_level ?? "").trim().toLowerCase();
        const studentSection = (s.section ?? "").trim().toLowerCase();

        const matchesGrade = !filterGrade || studentGrade === filterGrade;
        const sectionMatch = !filterSection || studentSection === filterSection;

        matchesSection = matchesGrade && sectionMatch;
      }

      return matchesSearch && matchesSection;
    });
  }, [availableStudents, allStudents, tab, search, sectionFilter]);

  const allSections = useMemo(() => {
    const set = new Set<string>();
    allStudents.forEach((s) => {
      if (s.grade_level && s.section) {
        set.add(`${s.grade_level} - ${s.section}`);
      } else if (s.section) {
        set.add(s.section);
      } else if (s.grade_level) {
        set.add(s.grade_level);
      }
    });
    return Array.from(set).sort();
  }, [allStudents]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleAll() {
    const filteredIds = filtered.map((s) => s.id);
    const allSelected = filteredIds.every((id) => selected.includes(id));

    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelected((prev) => {
        const set = new Set([...prev, ...filteredIds]);
        return Array.from(set);
      });
    }
  }

  function handleInvite() {
    if (selected.length === 0) return;
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const res = await inviteStudents(roomId, selected);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setMessage(t("invited", { count: res.invited ?? 0 }));
      setSelected([]);
      router.refresh();
    });
  }

  const totalAvailable =
    tab === "my" ? availableStudents.length : allStudents.length;

  return (
    <Card className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <UserPlus className="w-4 h-4 text-brand" />
        <h2 className="font-semibold">{t("title")}</h2>
        <Badge>{totalAvailable}</Badge>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 p-2 rounded-lg text-sm">
          {message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl">
        <button
          onClick={() => setTab("my")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            tab === "my"
              ? "bg-card shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("myStudents", { count: availableStudents.length })}
        </button>
        <button
          onClick={() => setTab("all")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            tab === "all"
              ? "bg-card shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("allStudents", { count: allStudents.length })}
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>
        {allSections.length > 0 && (
          <button
            onClick={() => setShowSectionFilter((s) => !s)}
            className={`h-10 px-3 rounded-xl border transition-colors flex items-center gap-1.5 text-sm font-medium shrink-0 ${
              sectionFilter
                ? "border-brand bg-blue-50 dark:bg-blue-950 text-brand"
                : "border-border bg-background hover:bg-muted"
            }`}
          >
            <Filter className="w-4 h-4" />
            {sectionFilter || t("section")}
          </button>
        )}
      </div>

      {/* Section filter dropdown */}
      {showSectionFilter && allSections.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-2 space-y-1">
          <button
            onClick={() => {
              setSectionFilter("");
              setShowSectionFilter(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !sectionFilter
                ? "bg-brand text-brand-foreground"
                : "hover:bg-muted"
            }`}
          >
            {t("allSections")}
          </button>
          {allSections.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSectionFilter(s);
                setShowSectionFilter(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                sectionFilter === s
                  ? "bg-brand text-brand-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Toolbar */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={toggleAll}
            className="text-brand hover:underline font-medium"
          >
            {filtered.every((s) => selected.includes(s.id))
              ? t("deselectAll")
              : t("selectAll", { count: filtered.length })}
          </button>
          <p className="text-muted-foreground">
            {filtered.length} {t("of")} {totalAvailable}
          </p>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title={
            totalAvailable === 0
              ? tab === "my"
                ? t("noOwnStudents")
                : t("noSystemStudents")
              : t("noMatch")
          }
          description={
            totalAvailable === 0
              ? tab === "my"
                ? t("noOwnStudentsDesc")
                : t("noSystemStudentsDesc")
              : t("noMatchDesc")
          }
        />
      ) : (
        <ul className="max-h-64 overflow-y-auto divide-y divide-border border border-border rounded-xl">
          {filtered.map((s) => {
            const isSelected = selected.includes(s.id);
            const isOwn = s.created_by === currentUserId;
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
                  <div className="relative shrink-0">
                    <Avatar
                      url={s.signedAvatarUrl}
                      initials={initials}
                      size="sm"
                      pending={s.avatar_pending ?? false}
                    />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-card">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
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
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      {s.grade_level && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {s.grade_level}
                        </span>
                      )}
                      {s.section && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          {s.section}
                        </span>
                      )}
                      {!isOwn && tab === "all" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                          {t("fromOtherTeacher")}
                        </span>
                      )}
                    </div>
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
      )}

      {/* Invite button */}
      <Button
        onClick={handleInvite}
        disabled={selected.length === 0 || pending}
        loading={pending}
        className="w-full"
      >
        {pending
          ? t("inviting")
          : t("inviteSelected", { count: selected.length })}
      </Button>
    </Card>
  );
}
