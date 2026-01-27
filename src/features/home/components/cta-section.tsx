import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";
import { Github } from "lucide-react";

export function CTASection() {
  return (
    <section className="px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
          Ready to streamline your data workflow?
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Start editing your spreadsheets with real-time collaboration. No sign-up required for
          basic usage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-14 px-8 text-base font-medium gap-2 bg-transparent"
          >
            <a href={env.VITE_REPO_URL}>
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
