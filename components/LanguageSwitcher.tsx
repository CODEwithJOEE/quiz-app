// components/LanguageSwitcher.tsx
"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const LOCALES = [
  { code: "en" as const, labelKey: "english" },
  { code: "tl" as const, labelKey: "tagalog" },
];

export default function LanguageSwitcher() {
  const t = useTranslations("Profile");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleChange(nextLocale: string) {
    if (nextLocale === locale || isPending) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="p-1 bg-muted rounded-2xl flex gap-1">
      {LOCALES.map((opt) => {
        const active = locale === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => handleChange(opt.code)}
            disabled={isPending}
            className={cn(
              "flex-1 flex items-center justify-center h-9 rounded-xl text-xs font-medium transition-all disabled:opacity-60",
              active
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t(opt.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
