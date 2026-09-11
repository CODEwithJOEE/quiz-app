import { getCurrentProfile } from "@/lib/auth";
import BottomNav, { type NavItem } from "./BottomNav";

export default async function BottomNavServer() {
  const me = await getCurrentProfile();
  if (!me) return null;

  const items: NavItem[] = [
    { href: "/home", label: "Home", icon: "home" },
    { href: "/rooms", label: "Rooms", icon: "door" },
  ];

  // Quiz only for teachers and students
  if (me.role === "teacher" || me.role === "student") {
    items.push({ href: "/quiz", label: "Quiz", icon: "clipboard" });
  }

  if (me.role === "teacher") {
    items.push({ href: "/students", label: "Students", icon: "graduation" });
  }

  if (me.role === "super_admin") {
    items.push({ href: "/admin/users", label: "Users", icon: "settings" });
  }

  items.push({ href: "/profile", label: "Profile", icon: "user" });

  return <BottomNav items={items} />;
}
