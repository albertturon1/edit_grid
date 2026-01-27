import { useState, useEffect } from "react";
import { FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Padding } from "./padding";
import { Logo } from "./logo";
import { ThemeToggle } from "./ui/theme-toggle";

interface NavbarProps {
  height: number;
}

export function Navbar({ height }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent",
      )}
    >
      <Padding>
        <nav className="flex items-center justify-between ml-auto" style={{ height }}>
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-accent" />
            <Logo />
          </a>
          <ThemeToggle />
        </nav>
      </Padding>
    </header>
  );
}
