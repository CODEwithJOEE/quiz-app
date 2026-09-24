"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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
  icon: keyof typeof ICONS;
  badge?: number;
};

/* ---------- geometry ---------- */
const BAR_H = 64; // height ng bar
const FAB = 52; // diameter ng floating circle
const NOTCH_HALF = 38; // half-width ng notch opening
const NOTCH_DEPTH = 34; // gaano kalalim ang dip
const EDGE = 0.75; // half stroke-width offset para di ma-clip ang border

/** Pinapanatili lang ang notch sa loob ng bar — hindi na hinihila papasok
 *  nang malayo, kaya naka-align pa rin ito sa unang at huling item. */
function clampCx(cx: number, w: number) {
  return Math.min(Math.max(cx, 4), w - 4);
}

/**
 * Bumubuo ng top-edge path ng bar. Kapag may notch (cx != null),
 * dumidip ito gamit ang dalawang cubic bezier para smooth ang shoulders.
 */
function buildEdge(w: number, cx: number | null) {
  if (cx == null || w <= 0) return `M0,${EDGE} L${w},${EDGE}`;

  const c = clampCx(cx, w);
  const l = c - NOTCH_HALF;
  const r = c + NOTCH_HALF;

  return [
    `M0,${EDGE}`,
    `L${l},${EDGE}`,
    `C${l + 12},${EDGE} ${c - 30},${NOTCH_DEPTH} ${c},${NOTCH_DEPTH}`,
    `C${c + 30},${NOTCH_DEPTH} ${r - 12},${EDGE} ${r},${EDGE}`,
    `L${w},${EDGE}`,
  ].join(" ");
}

export default function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const cxRef = useRef(0);

  const [width, setWidth] = useState(0);
  const [cx, setCx] = useState(0);

  const activeIndex = useMemo(
    () =>
      items.findIndex(
        (item) =>
          pathname === item.href ||
          (item.href !== "/home" && pathname.startsWith(item.href)),
      ),
    [items, pathname],
  );

  /* Sukatin ang bar (responsive + orientation change) */
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* I-animate ang notch papunta sa bagong active item */
  useEffect(() => {
    if (!width || activeIndex < 0 || items.length === 0) return;

    const target = (width / items.length) * (activeIndex + 0.5);

    // first paint: walang animation, deretso na sa lugar
    if (cxRef.current === 0) {
      cxRef.current = target;
      setCx(target);
      return;
    }

    const from = cxRef.current;
    const start = performance.now();
    const duration = 340;
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const value = from + (target - from) * eased;
      cxRef.current = value;
      setCx(value);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeIndex, width, items.length]);

  const notchCx = activeIndex >= 0 ? cx : null;
  const edgePath = buildEdge(width, notchCx);
  const fillPath = `${edgePath} L${width},${BAR_H} L0,${BAR_H} Z`;

  const activeItem = activeIndex >= 0 ? items[activeIndex] : null;
  const ActiveIcon = activeItem ? (ICONS[activeItem.icon] ?? Home) : null;
  const activeBadge =
    activeItem?.badge != null && activeItem.badge > 0 ? activeItem.badge : null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-2xl">
        <div ref={barRef} className="relative" style={{ height: BAR_H }}>
          {/* Bar background + notch */}
          {width > 0 && (
            <svg
              width={width}
              height={BAR_H}
              viewBox={`0 0 ${width} ${BAR_H}`}
              className="absolute inset-0"
              style={{ filter: "drop-shadow(0 -4px 14px rgb(0 0 0 / 0.08))" }}
              aria-hidden="true"
            >
              <path d={fillPath} fill="var(--card)" />
              <path
                d={edgePath}
                fill="none"
                stroke="var(--border)"
                strokeWidth={1.5}
              />
            </svg>
          )}

          {/* Nav items */}
          <ul className="absolute inset-0 flex">
            {items.map((item, i) => {
              const Icon = ICONS[item.icon] ?? Home;
              const isActive = i === activeIndex;
              const hasBadge = item.badge != null && item.badge > 0;

              return (
                <li key={item.href} className="flex-1">
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex h-full w-full flex-col items-center justify-center gap-1 pb-1.5 transition-colors",
                      isActive
                        ? "text-brand"
                        : "text-muted-foreground hover:text-foreground active:scale-95",
                    )}
                  >
                    {/* Icon slot — nagiging invisible placeholder kapag active
                        (nasa floating circle na siya) */}
                    <span
                      className={cn(
                        "relative flex h-6 w-6 items-center justify-center transition-all duration-300",
                        isActive
                          ? "-translate-y-2 scale-50 opacity-0"
                          : "translate-y-0 scale-100 opacity-100",
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                      {hasBadge && !isActive && (
                        <span className="absolute -right-1.5 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-card">
                          {item.badge! > 99 ? "99+" : item.badge}
                        </span>
                      )}
                    </span>

                    {/* Label — laging nakikita para sa discoverability,
                        pero mas mabigat/makulay lang kapag active */}
                    <span
                      className={cn(
                        "text-[10px] leading-none transition-all duration-300",
                        isActive ? "font-semibold" : "font-medium opacity-80",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Floating active circle — sumusunod sa notch */}
          {ActiveIcon && width > 0 && (
            <div
              className="pointer-events-none absolute"
              style={{
                left: clampCx(cx, width),
                top: -FAB / 2,
                transform: "translateX(-50%)",
              }}
            >
              <div
                key={activeItem?.href}
                className="animate-fade-in relative flex items-center justify-center rounded-full bg-brand text-brand-foreground"
                style={{
                  width: FAB,
                  height: FAB,
                  boxShadow: "0 10px 22px -8px var(--brand)",
                }}
              >
                <ActiveIcon className="h-6 w-6" strokeWidth={2.4} />
                {activeBadge && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-card">
                    {activeBadge > 99 ? "99+" : activeBadge}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Safe-area filler (iPhone home indicator) */}
        <div
          className="bg-card"
          style={{ height: "env(safe-area-inset-bottom)" }}
        />
      </div>
    </nav>
  );
}
