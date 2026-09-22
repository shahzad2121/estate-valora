"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/**
 * Keeps <html lang> in sync without remounting the document.
 */
export function DocumentLang() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale === "fr" ? "fr-CA" : "en";
  }, [locale]);

  return null;
}
