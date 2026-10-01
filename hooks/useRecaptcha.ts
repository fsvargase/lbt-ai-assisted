"use client";

import { useCallback, useEffect } from "react";
import { recaptchaSiteKey } from "@/lib/env.public";

interface Grecaptcha {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

const SCRIPT_ID = "recaptcha-v3";

function loadScript(siteKey: string) {
  if (typeof document === "undefined") return;
  if (document.getElementById(SCRIPT_ID)) return;
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
  script.async = true;
  document.head.appendChild(script);
}

/**
 * Loads reCAPTCHA v3 and returns an `execute(action)` that resolves a token,
 * or `null` when reCAPTCHA is unavailable (e.g. no site key configured).
 */
export function useRecaptcha() {
  useEffect(() => {
    if (recaptchaSiteKey) loadScript(recaptchaSiteKey);
  }, []);

  const execute = useCallback(
    async (action: string): Promise<string | null> => {
      const grecaptcha = window.grecaptcha;
      if (!recaptchaSiteKey || !grecaptcha) return null;
      return new Promise((resolve) => {
        grecaptcha.ready(() => {
          grecaptcha
            .execute(recaptchaSiteKey, { action })
            .then(resolve)
            .catch(() => resolve(null));
        });
      });
    },
    [],
  );

  return { execute };
}
