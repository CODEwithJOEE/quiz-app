"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function BackButton({
  href,
  ariaLabel = "Go back",
}: {
  href: string;
  ariaLabel?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleBack() {
    if (loading) return;
    setLoading(true);
    router.push(href);
    setTimeout(() => setLoading(false), 500);
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      disabled={loading}
      className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-border transition-colors shrink-0 disabled:opacity-60"
      aria-label={ariaLabel}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ArrowLeft className="w-4 h-4" />
      )}
    </button>
  );
}
