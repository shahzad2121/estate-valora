import { contentEn, type SiteContent } from "./en";
import { contentFr } from "./fr";

/**
 * Locale-aware site copy. Components stay presentation-only.
 */
export function getSiteContent(locale: string): SiteContent {
  if (locale === "en") return contentEn as unknown as SiteContent;
  return contentFr as unknown as SiteContent;
}

export type { SiteContent };
export { contentEn, contentFr };
