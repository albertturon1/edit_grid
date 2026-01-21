import { BouncingBoxes } from "@/components/bouncing-boxes/bouncing-boxes";
import { Logo } from "@/components/logo";
import { FileUploader } from "@/components/file-uploader";
import { getValueFromSystemTheme, useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useFileImport } from "./hooks/useFileImport";
import { Button } from "@/components/ui/button";
import { ALLOWED_FILE_EXTENSIONS } from "@/lib/imports";
import { Playground } from "@/features/playground/playground";

export function HomePage() {
  const { theme } = useTheme();
  const { importFile, importExample } = useFileImport();

  const currentTheme = theme === "system" ? getValueFromSystemTheme() : theme;

  const overlayClass = currentTheme === "light" ? "bg-slate-100/10" : "bg-black/60";

  return (
    <div className="relative flex-1 overflow-hidden">
      <BouncingBoxes size={50} speed={0.7} gap={5} />

      <div className={cn("absolute inset-0 z-10 flex flex-col", overlayClass)}>
        <div className="absolute inset-0 z-10 bg-background opacity-30" />

        <div className="z-20 flex w-full h-full flex-col items-center justify-between backdrop-blur-3xl py-10">
          <div className="flex flex-1 flex-col justify-center gap-y-10 w-full max-w-md px-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="flex flex-wrap items-center justify-center text-2xl sm:text-3xl font-bold">
                <span className="text-foreground">Welcome to&nbsp;</span>
                <Logo className="text-2xl sm:text-3xl" />
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground font-medium">
                Your Ultimate Online Worksheet Editor
              </p>
            </div>

            <div className="flex flex-col items-center gap-5 w-full">
              <Button
                size="lg"
                className="w-full gap-2 font-semibold bg-violet-600 hover:bg-violet-700 text-white"
                onClick={() => {
                  importExample("/customers-1000.csv");
                }}
              >
                Open example file
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <FileUploader
                onFileImport={importFile}
                options={{
                  fileSizeLimit: { size: 5, unit: "MB" },
                  accept: ALLOWED_FILE_EXTENSIONS,
                }}
              />
            </div>
          </div>

          <div className="w-full max-w-4xl px-4">
            <div className="mb-2">
              <h2 className="text-lg font-semibold">Playground</h2>
              <p className="text-sm text-muted-foreground">
                Try the collaborative table editor below
              </p>
            </div>
            <Playground />
          </div>
        </div>
      </div>
    </div>
  );
}
