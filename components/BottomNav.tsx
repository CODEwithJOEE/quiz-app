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
import { Camera } from "lucide-react";
import { cn } from "@/lib/cn";

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  door: DoorOpen,
  clipboard: ClipboardList,
  graduation: GraduationCap,
  settings: Settings,
  user: User,
  camera: Camera,
};

export type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
  badge?: number;
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
          const hasBadge = item.badge != null && item.badge > 0;

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center py-2.5 gap-0.5 text-[10px] font-medium transition-colors",
                  active
                    ? "text-brand"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {/* Icon wrapper with badge */}
                <div className="relative">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform",
                      active && "scale-110",
                    )}
                    strokeWidth={active ? 2.5 : 2}
                  />

                  {hasBadge && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-card">
                      {item.badge! > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>

                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
