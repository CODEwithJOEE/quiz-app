"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type BadgeCounts = {
  home: number;
  rooms: number;
  profile: number;
  dashboard: number;
};

export function useBadgeCounts(role: string) {
  const [counts, setCounts] = useState<BadgeCounts>({
    home: 0,
    rooms: 0,
    profile: 0,
    dashboard: 0,
  });

  const fetchCounts = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const newCounts: BadgeCounts = {
      home: 0,
      rooms: 0,
      profile: 0,
      dashboard: 0,
    };

    if (role === "student") {
      // Pending room invitations
      const { count } = await supabase
        .from("room_members")
        .select("*", { count: "exact", head: true })
        .eq("student_id", user.id)
        .eq("status", "pending");
      newCounts.home = count ?? 0;
    }

    if (role === "teacher") {
      // Pending room invitations (teacher's rooms)
      const { data: rooms } = await supabase
        .from("rooms")
        .select("id")
        .eq("teacher_id", user.id);

      if (rooms && rooms.length > 0) {
        const { count } = await supabase
          .from("room_members")
          .select("*", { count: "exact", head: true })
          .in(
            "room_id",
            rooms.map((r: any) => r.id),
          )
          .eq("status", "pending");
        newCounts.rooms = count ?? 0;
      }

      // Pending photos (teacher's own students)
      const { count: photoCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("avatar_pending", true)
        .not("avatar_url", "is", null)
        .eq("created_by", user.id);
      newCounts.profile = photoCount ?? 0;
    }

    if (role === "super_admin") {
      // All pending photos
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("avatar_pending", true)
        .not("avatar_url", "is", null);
      newCounts.dashboard = count ?? 0;
    }

    setCounts(newCounts);
  }, [role]);

  useEffect(() => {
    // Initial fetch
    fetchCounts();

    // ✅ Refresh on window focus (user returns to tab)
    const handleFocus = () => {
      fetchCounts();
    };

    // ✅ Refresh on visibility change (tab becomes visible)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchCounts();
      }
    };

    // ✅ Refresh on custom event (same-tab approve/reject)
    const handleRefresh = () => {
      fetchCounts();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("badge-refresh", handleRefresh);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("badge-refresh", handleRefresh);
    };
  }, [fetchCounts]);

  return counts;
}
