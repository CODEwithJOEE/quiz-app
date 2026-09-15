"use client";

import { useState, useMemo } from "react";
import { Users, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import Collapsible from "@/components/ui/Collapsible";
import Avatar from "@/components/Avatar";

type Classmate = {
  id: string;
  full_name: string;
  email: string;
  grade_level?: string | null;
  section?: string | null;
  avatar_url?: string | null;
  avatar_pending?: boolean | null;
  signedAvatarUrl?: string | null;
};

export default function ClassmatesSection({
  classmates,
}: {
  classmates: Classmate[];
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return classmates;
    const q = search.toLowerCase();
    return classmates.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }, [classmates, search]);

  if (classmates.length === 0) return null;

  return (
    <Collapsible
      title="Classmates"
      icon={<Users className="w-4 h-4 text-brand" />}
      count={classmates.length}
      badge={<Badge>{classmates.length}</Badge>}
      defaultOpen={true}
    >
      {/* Search box */}
      {classmates.length > 3 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search classmate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>
      )}

      {/* Search result count */}
      {search && (
        <p className="text-xs text-muted-foreground">
          Showing <b className="text-foreground">{filtered.length}</b> of{" "}
          {classmates.length}
        </p>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Walang tumutugma"
          description="Subukan i-reset ang search."
        />
      ) : (
        <ul className="space-y-2">
          {filtered.map((c) => (
            <ClassmateRow key={c.id} classmate={c} />
          ))}
        </ul>
      )}
    </Collapsible>
  );
}

// =====================================================
// Classmate Row
// =====================================================
function ClassmateRow({ classmate }: { classmate: Classmate }) {
  const initials = classmate.full_name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <li className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border shadow-sm">
      <Avatar
        url={classmate.signedAvatarUrl}
        initials={initials}
        size="sm"
        pending={false}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{classmate.full_name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {classmate.email}
        </p>
        {(classmate.grade_level || classmate.section) && (
          <div className="flex flex-wrap gap-1 mt-1">
            {classmate.grade_level && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {classmate.grade_level}
              </span>
            )}
            {classmate.section && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {classmate.section}
              </span>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
