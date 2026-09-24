"use client";

import { useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/cn";

const LOCALES = [
  { code: "en" as const, labelKey: "english" },
  { code: "tl" as const, labelKey: "tagalog" },
];

export default function LoginLanguageSwitcher() {
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
    <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-full">
      <Globe className="w-3.5 h-3.5 text-muted-foreground ml-2" />
      {LOCALES.map((opt) => {
        const active = locale === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => handleChange(opt.code)}
            disabled={isPending}
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-medium transition-all disabled:opacity-60",
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
