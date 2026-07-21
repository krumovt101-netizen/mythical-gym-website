import type { ReactNode } from "react";

/** O kicker mono por cima dos títulos, com o quadrado de latão da casa. */
export function Eyebrow({
  children,
  onPaper = false,
  className = "",
}: {
  children: ReactNode;
  onPaper?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`t-data flex items-center gap-3 ${
        onPaper ? "text-ink-dim" : "text-mercury"
      } ${className}`}
    >
      <span
        aria-hidden
        className={`inline-block size-1.5 ${onPaper ? "bg-brass-deep" : "bg-brass"}`}
      />
      {children}
    </p>
  );
}
