"use client";

import React, { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, label, error, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-1", containerClassName)}>
        <label
          className="text-body-medium text-foreground ml-1"
          htmlFor={props.id}
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "flex h-14 w-full rounded-2xl border-[1.5px] border-input bg-transparent px-4 py-2 text-body-medium transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-foreground disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-danger focus-visible:border-danger" : "",
              className,
            )}
            {...props}
          />
          {error && (
            <span className="absolute -bottom-5 left-1 text-xs text-danger">
              {error}
            </span>
          )}
        </div>
      </div>
    );
  },
);
Input.displayName = "Input";
