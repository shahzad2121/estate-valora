"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  LOCALE_STORAGE_KEY,
  markLocaleSwitch,
  routing,
  type AppLocale,
} from "@/i18n/routing";

/**
 * Syncs localStorage ↔ current locale.
 * If a stored preference exists and differs from the URL locale, navigate to it
 * (covers returning visitors whose cookie expired but localStorage remains).
 */
export function LocalePreferenceSync() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      return;
    }

    const isValid =
      stored != null &&
      routing.locales.includes(stored as AppLocale);

    if (isValid && stored !== locale) {
      markLocaleSwitch();
      router.replace(pathname, { locale: stored as AppLocale });
      return;
    }

    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      /* private mode */
    }
  }, [locale, pathname, router]);

  return null;
}
