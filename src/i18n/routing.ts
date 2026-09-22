import { defineRouting } from "next-intl/routing";

/**
 * FR is the primary locale (Québec). EN is secondary.
 * Browser Accept-Language + cookie/localStorage preference are respected.
 */
export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  localeDetection: true,
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
  },
});

export type AppLocale = (typeof routing.locales)[number];

export const LOCALE_STORAGE_KEY = "estate-valora-locale";

/** Session flag — Reveal skips fade-in right after a language switch. */
export const LOCALE_SWITCH_REVEAL_KEY = "estate-valora-locale-switch";

const LOCALE_SWITCH_SKIP_MS = 4000;

/** Call before navigating to another locale. */
export function markLocaleSwitch() {
  try {
    sessionStorage.setItem(LOCALE_SWITCH_REVEAL_KEY, String(Date.now()));
  } catch {
    /* private mode */
  }
}

/** True for a short window after markLocaleSwitch — used by Reveal. */
export function shouldSkipRevealForLocaleSwitch(): boolean {
  try {
    const raw = sessionStorage.getItem(LOCALE_SWITCH_REVEAL_KEY);
    if (!raw) return false;
    const at = Number(raw);
    if (!Number.isFinite(at)) {
      sessionStorage.removeItem(LOCALE_SWITCH_REVEAL_KEY);
      return false;
    }
    if (Date.now() - at < LOCALE_SWITCH_SKIP_MS) return true;
    sessionStorage.removeItem(LOCALE_SWITCH_REVEAL_KEY);
    return false;
  } catch {
    return false;
  }
}
