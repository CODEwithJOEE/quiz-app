"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  DoorOpen,
  ClipboardList,
  GraduationCap,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

// Icon registry — maps string keys to actual components
const ICONS: Record<string, LucideIcon> = {
  home: Home,
  door: DoorOpen,
  clipboard: ClipboardList,
  graduation: GraduationCap,
  settings: Settings,
  user: User,
};

export type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof ICONS; // string key lang
};

export default function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-md border-t border-border">
      <ul className="flex justify-around max-w-2xl mx-auto px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const Icon = ICONS[item.icon] ?? Home;
          const active =
            pathname === item.href ||
            (item.href !== "/home" && pathname.startsWith(item.href));

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2.5 gap-0.5 text-[10px] font-medium transition-colors",
                  active
                    ? "text-brand"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform",
                    active && "scale-110",
                  )}
                  strokeWidth={active ? 2.5 : 2}
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
