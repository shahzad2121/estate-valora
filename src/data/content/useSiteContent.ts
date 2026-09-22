"use client";

import { useLocale } from "next-intl";
import { getSiteContent } from "@/data/content";

/** Client-side site copy for the active locale. */
export function useSiteContent() {
  return getSiteContent(useLocale());
}
