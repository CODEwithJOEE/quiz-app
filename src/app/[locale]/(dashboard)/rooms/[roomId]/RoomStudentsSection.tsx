"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { UserCheck, Clock, Users, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import RemoveStudentModal from "./RemoveStudentModal";
import BulkRemoveModal from "./BulkRemoveModal";
import Collapsible from "@/components/ui/Collapsible";
import Avatar from "@/components/Avatar";

export default function RoomStudentsSection({
  roomId,
  accepted,
  pending,
  currentUserId,
}: {
  roomId: string;
  accepted: any[];
  pending: any[];
  currentUserId: string;
}) {
  const t = useTranslations("RoomDetail");
  const tRemove = useTranslations("RemoveStudent");

  const [selectedJoined, setSelectedJoined] = useState<string[]>([]);
  const [selectedPending, setSelectedPending] = useState<string[]>([]);

  function toggleJoined(id: string) {
    setSelectedJoined((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function togglePending(id: string) {
    setSelectedPending((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function selectAllJoined() {
    if (selectedJoined.length === accepted.length) {
      setSelectedJoined([]);
    } else {
      setSelectedJoined(
        accepted.map((m) => m.profiles?.id).filter(Boolean) as string[],
      );
    }
  }

  function selectAllPending() {
    if (selectedPending.length === pending.length) {
      setSelectedPending([]);
    } else {
      setSelectedPending(
        pending.map((m) => m.profiles?.id).filter(Boolean) as string[],
      );
    }
  }

  const selectedJoinedNames = accepted
    .filter((m) => m.profiles && selectedJoined.includes(m.profiles.id))
    .map((m) => m.profiles!.full_name);

  const selectedPendingNames = pending
    .filter((m) => m.profiles && selectedPending.includes(m.profiles.id))
    .map((m) => m.profiles!.full_name);

  return (
    <div className="space-y-3">
      {/* JOINED STUDENTS */}
      <Collapsible
        title={t("joinedStudents")}
        icon={<UserCheck className="w-4 h-4 text-green-600" />}
        count={accepted.length}
        badge={<Badge variant="success">{accepted.length}</Badge>}
      >
        {accepted.length === 0 ? (
          <EmptyState
            icon={Users}
            title={t("noJoined")}
            description={t("noJoinedDesc")}
          />
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <button
                onClick={selectAllJoined}
                className="text-xs text-brand hover:underline font-medium flex items-center gap-1.5"
              >
                {selectedJoined.length === accepted.length ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    {t("deselectAll")}
                  </>
                ) : (
                  <>{t("selectAll", { count: accepted.length })}</>
                )}
              </button>

              {selectedJoined.length > 0 && (
                <BulkRemoveModal
                  roomId={roomId}
                  selectedIds={selectedJoined}
                  selectedNames={selectedJoinedNames}
                  onComplete={() => setSelectedJoined([])}
                />
              )}
            </div>

            <ul className="space-y-2">
              {accepted.map((m) => {
                const student = m.profiles;
                if (!student) return null;
                const isSelected = selectedJoined.includes(student.id);
                const initials = student.full_name
                  .split(" ")
                  .map((w: string) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <li key={m.id}>
                    <div
                      className={`flex items-center gap-3 p-3 rounded-2xl border shadow-sm transition-colors ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/40 border-brand"
                          : "bg-card border-border"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleJoined(student.id)}
                        className="w-5 h-5 shrink-0 flex items-center justify-center"
                      >
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-md bg-brand text-brand-foreground flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-md border-2 border-border" />
                        )}
                      </button>

                      <Avatar
                        url={student.signedAvatarUrl}
                        initials={initials}
                        size="sm"
                        pending={false}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {student.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {student.email}
                        </p>
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

                      <RemoveStudentModal
                        roomId={roomId}
                        studentId={student.id}
                        studentName={student.full_name}
                        studentEmail={student.email}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Collapsible>

      {/* PENDING INVITATIONS */}
      {pending.length > 0 && (
        <Collapsible
          title={t("pendingInvitations")}
          icon={<Clock className="w-4 h-4 text-amber-600" />}
          count={pending.length}
          badge={<Badge variant="warning">{pending.length}</Badge>}
          defaultOpen={false}
        >
          <>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <button
                onClick={selectAllPending}
                className="text-xs text-brand hover:underline font-medium flex items-center gap-1.5"
              >
                {selectedPending.length === pending.length
                  ? t("deselectAll")
                  : t("selectAll", { count: pending.length })}
              </button>

              {selectedPending.length > 0 && (
                <BulkRemoveModal
                  roomId={roomId}
                  selectedIds={selectedPending}
                  selectedNames={selectedPendingNames}
                  onComplete={() => setSelectedPending([])}
                />
              )}
            </div>

            <ul className="space-y-2">
              {pending.map((m) => {
                const student = m.profiles;
                if (!student) return null;
                const isSelected = selectedPending.includes(student.id);
                const initials = student.full_name
                  .split(" ")
                  .map((w: string) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <li key={m.id}>
                    <div
                      className={`flex items-center gap-3 p-3 rounded-2xl border shadow-sm transition-colors ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/40 border-brand"
                          : "bg-card border-border"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => togglePending(student.id)}
                        className="w-5 h-5 shrink-0 flex items-center justify-center"
                      >
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-md bg-brand text-brand-foreground flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-md border-2 border-border" />
                        )}
                      </button>

                      <Avatar
                        url={student.signedAvatarUrl}
                        initials={initials}
                        size="sm"
                        pending={true}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {student.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {student.email}
                        </p>
                      </div>

                      <RemoveStudentModal
                        roomId={roomId}
                        studentId={student.id}
                        studentName={student.full_name}
                        studentEmail={student.email}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        </Collapsible>
      )}
    </div>
  );
}
