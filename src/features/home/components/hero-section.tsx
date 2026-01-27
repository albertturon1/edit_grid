import { ButtonFileUploader } from "@/components/button-file-uploader";
import { DragDropFileUploader } from "@/components/dragdrop-file-uploader";
import { Logo } from "@/components/logo";
import { FILE_UPLOAD_OPTIONS } from "@/constants";
import { useFileImport } from "@/features/home/hooks/useFileImport";

export function HeroSection() {
  const { importFile } = useFileImport();

  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-12 sm:py-20">
      {/* Background grid */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)]
          bg-size-[40px_40px]
          mask-[linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)]
          [-webkit-mask:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)]
        "
      />

      {/* Glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-150 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium border border-border rounded-full bg-secondary/50 text-muted-foreground">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          Real-time collaboration
        </div>

        {/* Main heading */}
        <Logo className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-balance" />

        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed text-pretty">
          The modern way to edit spreadsheets.{" "}
          <span className="text-foreground font-medium">
            {`${FILE_UPLOAD_OPTIONS.accept.map((e) => e.replace(".", "").toUpperCase())}, and more`}
          </span>{" "}
          — with real-time collaboration built in.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <ButtonFileUploader onFileImport={importFile} options={FILE_UPLOAD_OPTIONS} />
          {/*
          <Button asChild
            variant="outline"
            size="lg"
            className="h-14 px-8 text-base font-medium gap-2 bg-background/50"
          >
            <a href="#demo">
            <Users className="w-5 h-5" />
            Join live session
            </a>
          </Button>
           */}
        </div>

        {/* Upload zone */}
        <DragDropFileUploader
          className="bg-background/50"
          onFileImport={importFile}
          options={FILE_UPLOAD_OPTIONS}
        />
      </div>
    </section>
  );
}
