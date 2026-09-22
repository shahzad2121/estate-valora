"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  LOCALE_STORAGE_KEY,
  markLocaleSwitch,
  routing,
  type AppLocale,
} from "@/i18n/routing";

/**
 * FR | EN toggle — updates URL, cookie (via next-intl), and localStorage.
 */
export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: AppLocale) {
    if (next === locale) return;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* private mode */
    }
    markLocaleSwitch();

    const navigate = () => {
      router.replace(pathname, { locale: next });
    };

    // Soften the route swap when the browser supports View Transitions
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (typeof doc.startViewTransition === "function") {
      doc.startViewTransition(navigate);
    } else {
      navigate();
    }
  }

  return (
    <div
      className={[
        "inline-flex items-center gap-1 rounded-full border border-white/18 bg-white/[0.07] p-1 backdrop-blur-[6px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="group"
      aria-label={t("label")}
    >
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            className={
              active
                ? "rounded-full bg-white px-2.5 py-1 text-[11px] font-medium tracking-[0.08em] text-black"
                : "rounded-full px-2.5 py-1 text-[11px] tracking-[0.08em] text-white/75 transition-colors hover:text-white"
            }
            aria-pressed={active}
          >
            {t(code)}
          </button>
        );
      })}
    </div>
  );
}
