import { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Code({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): ReactNode {
  return <code className={className}>{children}</code>;
}
