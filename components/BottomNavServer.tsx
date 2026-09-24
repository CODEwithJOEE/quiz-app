import { getCurrentProfile } from "@/lib/auth";
import {
  getStudentPendingInvitationsCount,
  getTeacherPendingCount,
} from "@/lib/notifications";
import { getTranslations } from "next-intl/server";
import BottomNav, { type NavItem } from "./BottomNav";

export default async function BottomNavServer() {
  const me = await getCurrentProfile();
  if (!me) return null;

  const t = await getTranslations("Nav");

  let homeBadge = 0;
  let roomsBadge = 0;

  if (me.role === "student") {
    homeBadge = await getStudentPendingInvitationsCount(me.id);
  }
  if (me.role === "teacher") {
    roomsBadge = await getTeacherPendingCount(me.id);
  }

  const items: NavItem[] = [
    { href: "/home", label: t("home"), icon: "home", badge: homeBadge },
  ];

  if (me.role === "teacher" || me.role === "student") {
    items.push({
      href: "/rooms",
      label: t("rooms"),
      icon: "door",
      badge: roomsBadge,
    });
    items.push({ href: "/quiz", label: t("quiz"), icon: "clipboard" });
  }

  if (me.role === "teacher") {
    items.push({ href: "/students", label: t("students"), icon: "graduation" });
  }

  if (me.role === "super_admin") {
    items.push({
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: "settings",
    });
  }

  items.push({ href: "/profile", label: t("profile"), icon: "user" });

  return <BottomNav items={items} />;
}
