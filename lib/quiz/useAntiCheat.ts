"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type ViolationType =
  | "visibility_hidden"
  | "blur"
  | "fullscreen_exit"
  | "copy"
  | "paste"
  | "right_click"
  | "context_menu"
  | "before_unload";

type Options = {
  maxStrikes?: number;
  enabled: boolean;
  onViolation: (type: ViolationType, count: number) => void;
  onMaxStrikes: (type: ViolationType, count: number) => void;
};

export function useAntiCheat({
  maxStrikes = 3,
  enabled,
  onViolation,
  onMaxStrikes,
}: Options) {
  const strikesRef = useRef(0);
  const [warning, setWarning] = useState<{
    type: ViolationType;
    count: number;
  } | null>(null);

  const trigger = useCallback(
    (type: ViolationType) => {
      if (!enabled) return;

      // Debounce: ignore duplicate events within 500ms
      const now = Date.now();
      if (now - lastEventRef.current < 500) return;
      lastEventRef.current = now;

      strikesRef.current += 1;
      const count = strikesRef.current;

      onViolation(type, count);
      setWarning({ type, count });

      if (count >= maxStrikes) {
        onMaxStrikes(type, count);
      }
    },
    [enabled, maxStrikes, onViolation, onMaxStrikes],
  );

  const lastEventRef = useRef<number>(0);

  // Enter fullscreen on mount
  useEffect(() => {
    if (!enabled) return;

    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }

    return () => {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const onVisibility = () => {
      if (document.hidden) trigger("visibility_hidden");
    };

    const onBlur = () => trigger("blur");

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) trigger("fullscreen_exit");
    };

    const onCopy = (e: Event) => {
      e.preventDefault();
      trigger("copy");
    };

    const onPaste = (e: Event) => {
      e.preventDefault();
      trigger("paste");
    };

    const onContext = (e: Event) => {
      e.preventDefault();
      trigger("context_menu");
    };

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      trigger("before_unload");
      e.preventDefault();
      e.returnValue = "";
    };

    const onPopState = () => {
      // User tried to go back — push them forward again
      history.pushState(null, "", location.href);
      trigger("before_unload");
    };

    // Prevent back navigation
    history.pushState(null, "", location.href);

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("copy", onCopy);
    document.addEventListener("paste", onPaste);
    document.addEventListener("contextmenu", onContext);
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("paste", onPaste);
      document.removeEventListener("contextmenu", onContext);
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("popstate", onPopState);
    };
  }, [enabled, trigger]);

  return { warning, clearWarning: () => setWarning(null), strikesRef };
}
