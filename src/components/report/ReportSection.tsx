import { getLocale } from "next-intl/server";
import { getSiteContent } from "@/data/content";
import { ReportScene } from "@/components/report/ReportScene";

/**
 * Thin async server shell — fetches locale content, delegates to ReportScene.
 */
export async function ReportSection() {
  const locale = await getLocale();
  const report = getSiteContent(locale).report;

  // "Property strengths" label is locale-specific copy
  const strengthsLabel =
    locale === "fr" ? "Points forts de la propriété" : "Property strengths";

  return (
    <ReportScene
      index={report.index}
      eyebrow={report.eyebrow}
      title={report.title}
      description={report.description}
      sample={report.sample}
      floaters={report.floaters}
      cta={report.cta}
      ctaHref={report.ctaHref}
      strengthsLabel={strengthsLabel}
    />
  );
}
