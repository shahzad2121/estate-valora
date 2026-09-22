import { getLocale } from "next-intl/server";
import { getSiteContent } from "@/data/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

/**
 * Advisor / broker section shell — design deferred.
 */
export async function AdvisorSection() {
  const locale = await getLocale();
  const { eyebrow, name, title, description, cta } =
    getSiteContent(locale).advisor;

  return (
    <section
      id="advisor"
      data-section="advisor"
      className="relative bg-surface py-24"
      aria-labelledby="advisor-title"
    >
      <div className="page-container">
        <SectionLabel>{eyebrow}</SectionLabel>
        <h2 id="advisor-title" className="mt-4 text-3xl text-foreground">
          {name}
        </h2>
        <p className="mt-2 text-sm text-warm">{title}</p>
        <p className="mt-4 max-w-xl text-foreground-muted">{description}</p>
        <div className="mt-8">
          <Button href="#contact">{cta}</Button>
        </div>
      </div>
    </section>
  );
}
