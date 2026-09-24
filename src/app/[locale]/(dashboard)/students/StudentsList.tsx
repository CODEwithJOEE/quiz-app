"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search, Filter, Mail, Users, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import Collapsible from "@/components/ui/Collapsible";
import ResetPasswordModal from "@/components/ResetPasswordModal";
import DeleteStudentModal from "./DeleteStudentModal";
import PendingDeletionCard from "./PendingDeletionCard";
import Avatar from "@/components/Avatar";

type Student = {
  id: string;
  email: string;
  full_name: string;
  grade_level?: string | null;
  section?: string | null;
  created_at: string;
  avatar_url?: string | null;
  avatar_pending?: boolean | null;
  signedAvatarUrl?: string | null;
  deletion_scheduled_for?: string | null;
};

export default function StudentsList({
  activeStudents,
  pendingDeletion,
}: {
  activeStudents: Student[];
  pendingDeletion: Student[];
}) {
  const t = useTranslations("StudentsList");
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState<string>("");
  const [showSectionFilter, setShowSectionFilter] = useState(false);

  const filtered = useMemo(() => {
    return activeStudents.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        s.full_name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q);

      if (!sectionFilter) return matchesSearch;

      const [filterGrade, filterSection] = sectionFilter
        .split(" - ")
        .map((p) => p.trim().toLowerCase());

      const studentGrade = (s.grade_level ?? "").trim().toLowerCase();
      const studentSection = (s.section ?? "").trim().toLowerCase();

      const matchesGrade = !filterGrade || studentGrade === filterGrade;
      const matchesSection = !filterSection || studentSection === filterSection;

      return matchesSearch && matchesGrade && matchesSection;
    });
  }, [activeStudents, search, sectionFilter]);

  const allSections = useMemo(() => {
    const set = new Set<string>();
    activeStudents.forEach((s) => {
      if (s.grade_level && s.section) {
        set.add(`${s.grade_level} - ${s.section}`);
      } else if (s.section) {
        set.add(s.section);
      } else if (s.grade_level) {
        set.add(s.grade_level);
      }
    });
    return Array.from(set).sort();
  }, [activeStudents]);

  const resetFilters = () => {
    setSearch("");
    setSectionFilter("");
  };

  const hasFilters = search || sectionFilter;

  return (
    <div className="space-y-4">
      {pendingDeletion.length > 0 && (
        <Collapsible
          title={t("pendingDeletionTitle")}
          icon={<Users className="w-4 h-4 text-red-600 dark:text-red-400" />}
          count={pendingDeletion.length}
          badge={<Badge variant="danger">{pendingDeletion.length}</Badge>}
          defaultOpen={false}
        >
          <p className="text-xs text-muted-foreground">
            {t("pendingDeletionDesc")}
          </p>
          <ul className="space-y-2">
            {pendingDeletion.map((s) => (
              <PendingDeletionCard key={s.id} student={s} />
            ))}
          </ul>
        </Collapsible>
      )}

      <Collapsible
        title={t("activeTitle")}
        icon={<GraduationCap className="w-4 h-4 text-brand" />}
        count={activeStudents.length}
        badge={<Badge>{activeStudents.length}</Badge>}
        defaultOpen={true}
      >
        {activeStudents.length === 0 ? (
          <EmptyState
            icon={Users}
            title={t("noStudents")}
            description={t("noStudentsDesc")}
          />
        ) : (
          <>
            <div className="space-y-2">
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
                    {sectionFilter ? t("filtered") : t("section")}
                  </button>
                )}
              </div>

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

              {hasFilters && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {t("showing")}{" "}
                    <b className="text-foreground">{filtered.length}</b>{" "}
                    {t("of")} {activeStudents.length}
                  </span>
                  <button
                    onClick={resetFilters}
                    className="text-brand hover:underline font-medium"
                  >
                    {t("resetFilters")}
                  </button>
                </div>
              )}
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={Search}
                title={t("noMatch")}
                description={t("noMatchDesc")}
              />
            ) : (
              <ul className="space-y-2">
                {filtered.map((s) => (
                  <StudentRow key={s.id} student={s} />
                ))}
              </ul>
            )}
          </>
        )}
      </Collapsible>
    </div>
  );
}

function StudentRow({ student }: { student: Student }) {
  if (!student) return null;
  const initials = student.full_name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <li className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border shadow-sm">
      <Avatar
        url={student.signedAvatarUrl}
        initials={initials}
        size="sm"
        pending={student.avatar_pending ?? false}
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{student.full_name}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Mail className="w-3 h-3" />
          <span className="truncate">{student.email}</span>
        </div>

        {(student.grade_level || student.section) && (
          <div className="flex flex-wrap gap-1 mt-1">
            {student.grade_level && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {student.grade_level}
              </span>
            )}
            {student.section && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {student.section}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <ResetPasswordModal
          studentId={student.id}
          studentName={student.full_name}
          studentEmail={student.email}
        />
        <DeleteStudentModal
          studentId={student.id}
          studentName={student.full_name}
          studentEmail={student.email}
        />
      </div>
    </li>
  );
}
