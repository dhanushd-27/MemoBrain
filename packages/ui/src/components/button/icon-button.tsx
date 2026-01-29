"use client";

import { forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import { Button, ButtonProps } from "./button";
import { cn } from "../../lib/utils";

export interface IconButtonProps extends Omit<
  ButtonProps,
  "children" | "leadingIcon" | "icon" | "size"
> {
  icon: LucideIcon;
  size?: "default" | "sm" | "lg";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, className, size = "default", ...props }, ref) => {
    // Map abstract sizes to dimensions if needed, or just rely on Button's size but override padding.
    // User requested "same padding on x and padding on y".
    // We'll use Button's variant styles but force a square aspect ratio and centered content.

    // size mapping to Button's size prop or just classes?
    // Button 'icon' size is h-[48px] px-[24px].
    // If we want square, we want h-[48px] w-[48px] (p-0 or centered flex).

    // Let's assume 'default' maps to 48px square.

    const sizeClasses = {
      default: "h-[48px] w-[48px] p-0", // 48px
      sm: "h-[36px] w-[36px] p-0",
      lg: "h-[56px] w-[56px] p-0",
    };

    // If user passed a size not in our map (if we allowed string), we'd fallback.
    // Since we omit 'size' from ButtonProps and redefine it, we control it.

    return (
      <Button
        ref={ref}
        className={cn(
          "aspect-square p-0", // base overrides
          sizeClasses[size],
          className,
        )}
        size="icon" // passed to satisfy underlying requirements or effectively ignored due to className overrides
        icon={Icon}
        iconClassName="h-6 w-6"
        {...props}
      />
    );
  },
);
IconButton.displayName = "IconButton";
