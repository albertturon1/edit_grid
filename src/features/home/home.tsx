import { HeroSection } from "@/features/home/components/hero-section";
import { CTASection } from "@/features/home/components/cta-section";
import { TablePreview } from "../playground/components/table-preview";

export function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <section id="demo">
        <TablePreview />
      </section>
      <CTASection />
    </main>
  );
}
