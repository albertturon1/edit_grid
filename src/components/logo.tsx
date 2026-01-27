import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <h1 className={cn("text-xl font-bold", className)}>
      <span className="text-foreground">Edit</span>
      <span className="text-accent">Grid</span>
    </h1>
  );
}
