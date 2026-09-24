"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation"; // ✅ ADD usePathname
import { Camera, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function PendingPhotosCard() {
  const t = useTranslations("Profile");
  const pathname = usePathname(); // ✅ ADD
  const [count, setCount] = useState(0);

  async function fetchCount() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { count: photoCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("avatar_pending", true)
      .not("avatar_url", "is", null)
      .eq("created_by", user.id);

    setCount(photoCount ?? 0);
  }

  useEffect(() => {
    fetchCount();

    const handleFocus = () => fetchCount();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchCount();
    };
    const handleRefresh = () => fetchCount();

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("badge-refresh", handleRefresh);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("badge-refresh", handleRefresh);
    };
  }, [pathname]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <Camera className="w-4 h-4 text-brand" />
        <h2 className="font-semibold text-sm">{t("studentPhotos")}</h2>
      </div>
      <Link href="/pending-photos?from=%2Fprofile" className="block">
        <Card className="p-4 hover:border-brand/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t("reviewPendingPhotos")}</p>
              <p className="text-xs text-muted-foreground">
                {t("approveOrReject")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {count > 0 && (
                <Badge variant="warning">{count > 99 ? "99+" : count}</Badge>
              )}
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
