import { useEffect } from "react";
type AntiCheatOptions = {
  redirectUrl?: string;
  intervalMs?: number;
  threshold?: number;
  captureShortcuts?: boolean;
};
// code này em tham khảo AI anh kiểm tra kỹ lại giúp em nhé
export function useBlockDevTools(options?: AntiCheatOptions) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const redirectUrl = options?.redirectUrl ?? "https://www.google.com/";
    const intervalMs = options?.intervalMs ?? 600;
    const threshold = options?.threshold ?? 160;
    const captureShortcuts = options?.captureShortcuts ?? true;

    let redirected = false;
    let suppressUntil = 0;
    const setSuppression = (ms = 1500) => { suppressUntil = Date.now() + ms; };

    const redirect = () => {
      if (redirected) return;
      redirected = true;

      try { window.onbeforeunload = null; } catch {}

      try {
        if (window.top && window.top !== window.self) {
          (window.top as Window).location.replace(redirectUrl);
          return;
        }
      } catch {}

      try {
        window.location.replace(redirectUrl);
      } catch {
        window.location.href = redirectUrl;
      }
    };

    const openedBySize = () => {
      const wDiff = Math.abs(window.outerWidth - window.innerWidth);
      const hDiff = Math.abs(window.outerHeight - window.innerHeight);
      return wDiff > threshold || hDiff > threshold;
    };

    let consoleTriggered = false;
    const probe = new Image();
    Object.defineProperty(probe, "id", {
      get() {
        consoleTriggered = true;
        return "";
      }
    });

    const checkDevTools = () => {
      if (redirected) return;
      if (Date.now() < suppressUntil) return;

      consoleTriggered = false;
      try { console.log(probe); } catch {}
      setTimeout(() => {
        if (consoleTriggered || openedBySize()) redirect();
      }, 40);
    };

    const onResize = () => checkDevTools();
    window.addEventListener("resize", onResize);

    const intervalId = window.setInterval(checkDevTools, intervalMs);
    checkDevTools();

    const onKeyDown = (e: KeyboardEvent) => {
      if (!captureShortcuts) return;
      const key = e.key.toUpperCase();
      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      const shouldBlock =
        key === "F12" ||
        (ctrlOrMeta && e.shiftKey && ["I", "J", "C", "K"].includes(key)) ||
        (ctrlOrMeta && key === "U");
      if (shouldBlock) {
        e.preventDefault();
        e.stopPropagation();
        (e as any).stopImmediatePropagation?.();
        setSuppression();
      }
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e as any).stopImmediatePropagation?.();
    };
    window.addEventListener("contextmenu", onContextMenu, { capture: true });
    document.addEventListener("contextmenu", onContextMenu, { capture: true });

    window.addEventListener("keydown", onKeyDown, { capture: true });
    document.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown as any, { capture: true } as any);
      document.removeEventListener("keydown", onKeyDown as any, { capture: true } as any);
      window.clearInterval(intervalId);
      window.removeEventListener("contextmenu", onContextMenu as any, { capture: true } as any);
      document.removeEventListener("contextmenu", onContextMenu as any, { capture: true } as any);
    };
  }, [options]);
}