"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export default function Collapsible({
  title,
  icon,
  count,
  badge,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon?: ReactNode;
  count?: number;
  badge?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header — clickable */}
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center gap-2 p-4 hover:bg-muted/30 transition-colors text-left"
      >
        {icon}
        <h2 className="font-semibold flex-1">{title}</h2>
        {count !== undefined && badge}
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform shrink-0",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Content */}
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}
