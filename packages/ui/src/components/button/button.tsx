"use client";

import { ReactNode, ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 w-fit px-[30px] py-[12px]",
  {
    variants: {
      variant: {
        contained:
          "bg-[var(--button-primary)] text-[var(--button-primary-fg)] hover:bg-[var(--button-primary-hover)] active:scale-95",
        outlined:
          "border-[1.5px] border-[var(--button-outlined-border)] bg-transparent text-[var(--button-primary)] hover:bg-[var(--button-outlined-hover-bg)] hover:text-[var(--button-hover-text)] active:bg-[var(--button-outlined-pressed-bg)]",
        texted:
          "bg-transparent text-[var(--button-primary)] hover:bg-[var(--button-texted-hover-bg)] hover:text-[var(--button-hover-text)] active:bg-[var(--button-texted-pressed-bg)]",
      },
      size: {
        default: "h-12 px-[30px]",
        icon: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "contained",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: ReactNode;
  isLoading?: boolean;
  leadingIcon?: ReactNode;
  icon?: LucideIcon;
  iconClassName?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      leadingIcon,
      icon: Icon,
      iconClassName,
      children,
      ...props
    },
    ref,
  ) => {
    // Adjust size variant logic if icon is present?
    // The spec says "Padding (With Icon): 24px".
    // I'll handle this dynamically or assume the user passes size="icon" if they want that exact padding,
    // OR I can conditionally apply the class.

    const computedSize = leadingIcon ? "icon" : size;

    return (
      <button
        className={cn(
          buttonVariants({ variant, size: computedSize, className }),
        )}
        ref={ref}
        disabled={props.disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span
            className={cn(
              "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
              children ? "mr-2" : "",
            )}
          />
        )}
        {!isLoading && leadingIcon && (
          <span className="mr-1">{leadingIcon}</span>
        )}
        {!isLoading && Icon && (
          <Icon
            className={cn("h-4 w-4", iconClassName, children ? "mr-1" : "")}
          />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
