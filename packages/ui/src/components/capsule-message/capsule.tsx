import React from "react";
import { cn } from "../../lib/utils";

export interface CapsuleProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  text?: string;
  className?: string;
  type?: "message" | "link";
  href?: string;
}

export function Capsule({
  text,
  children,
  className,
  type = "message",
  href,
  ...props
}: CapsuleProps) {
  const content = text || children;
  const commonClasses = cn(
    "flex w-fit items-center justify-center rounded-full",
    "bg-surface border border-border-strong",
    "px-4 py-1.5",
    "text-foreground font-sans text-small-medium",
    "shadow-small transition-colors hover:opacity-90",
    className,
  );

  if (type === "link" && href) {
    return (
      <a
        href={href}
        className={commonClasses}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={commonClasses}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      {content}
    </div>
  );
}

// Keeping the default export compatible if possible, or we can switch to named export preference.
// The previous file had `export default function CapsuleMessage`.
// I will keep a named export `Capsule` as primary, and alias default for backward compatibility if needed,
// but the user asked for "Create a simple simple capsule", so I'll prioritize the new name.
export default Capsule;
