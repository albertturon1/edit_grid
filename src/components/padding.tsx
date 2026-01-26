import type { ReactNode } from "react";

interface PaddingProps {
  children: ReactNode;
}

export function Padding({ children }: PaddingProps) {
  return <div className="px-2 sm:px-5">{children}</div>;
}
