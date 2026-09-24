"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { LogOut } from "lucide-react";
import { Button } from "./ui/Button";

export default function LogoutButton() {
  const t = useTranslations("Logout");
  const locale = useLocale(); // ✅ Get current locale
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (!confirm(t("confirm"))) return;
    setLoading(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });

      // ✅ Hard redirect WITH locale prefix
      window.location.href = `/${locale}/login`;
    } catch (err) {
      setLoading(false);
      console.error("Logout error:", err);
    }
  }

  return (
    <Button
      variant="danger"
      size="lg"
      className="w-full"
      loading={loading}
      onClick={handleLogout}
    >
      {!loading && <LogOut className="w-4 h-4" />}
      {loading ? t("loggingOut") : t("logOut")}
    </Button>
  );
}
