import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/hero/Hero";
import { Experience } from "@/components/experience/Experience";
import { Process } from "@/components/process/Process";
import { ReportSection } from "@/components/report/ReportSection";
import { ListingsSection } from "@/components/listings/ListingsSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { FAQ } from "@/components/faq/FAQ";
import { ContactSection } from "@/components/contact/ContactSection";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Landing page composition.
 * Advisor section temporarily hidden.
 */
export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <Experience />
      <Process />
      <ReportSection />
      <ListingsSection />
      <TestimonialsSection />
      <FAQ />
      <ContactSection />
    </main>
  );
}
