"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/cn";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("Theme");

  const options = [
    { value: "light" as const, icon: Sun, labelKey: "light" },
    { value: "dark" as const, icon: Moon, labelKey: "dark" },
    { value: "system" as const, icon: Monitor, labelKey: "system" },
  ];

  return (
    <div className="p-1 bg-muted rounded-2xl flex gap-1">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-xs font-medium transition-all",
              active
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {t(opt.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
