"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Download, X } from "lucide-react";

export default function InstallPrompt() {
  const t = useTranslations("Install");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem("installPromptDismissed") === "1") return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
  }

  function dismiss() {
    localStorage.setItem("installPromptDismissed", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-3 right-3 bg-brand text-brand-foreground p-3 rounded-2xl shadow-lg z-50 flex items-center gap-3 animate-fade-in">
      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
        <Download className="w-5 h-5" />
      </div>
      <div className="flex-1 text-sm min-w-0">
        <p className="font-semibold">{t("title")}</p>
        <p className="text-xs opacity-90 truncate">{t("description")}</p>
      </div>
      <button
        onClick={install}
        className="bg-white text-brand px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0"
      >
        {t("install")}
      </button>
      <button
        onClick={dismiss}
        className="text-white/70 hover:text-white shrink-0"
        aria-label={t("dismiss")}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
