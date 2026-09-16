import { getCurrentProfile } from "@/lib/auth";
import {
  getStudentPendingInvitationsCount,
  getTeacherPendingCount,
} from "@/lib/notifications";
import BottomNav, { type NavItem } from "./BottomNav";

export default async function BottomNavServer() {
  const me = await getCurrentProfile();
  if (!me) return null;

  // Fetch badge counts
  let homeBadge = 0;
  let roomsBadge = 0;

  if (me.role === "student") {
    homeBadge = await getStudentPendingInvitationsCount(me.id);
  }

  if (me.role === "teacher") {
    roomsBadge = await getTeacherPendingCount(me.id);
  }

  const items: NavItem[] = [
    { href: "/home", label: "Home", icon: "home", badge: homeBadge },
  ];

  // Rooms — for teachers and students only
  if (me.role === "teacher" || me.role === "student") {
    items.push({
      href: "/rooms",
      label: "Rooms",
      icon: "door",
      badge: roomsBadge,
    });
    items.push({ href: "/quiz", label: "Quiz", icon: "clipboard" });
  }

  if (me.role === "teacher") {
    items.push({ href: "/students", label: "Students", icon: "graduation" });
    items.push({ href: "/pending-photos", label: "Photos", icon: "camera" });
  }

  if (me.role === "super_admin") {
    items.push({
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: "settings",
    });
  }

  items.push({ href: "/profile", label: "Profile", icon: "user" });

  return <BottomNav items={items} />;
}
