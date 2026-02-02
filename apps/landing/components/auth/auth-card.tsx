"use client";

import React, { ReactNode } from "react";
import ThemeToggler from "../theme/theme-toggler";
import Image from "next/image";

interface AuthCardProps {
  title: string;
  imageSrc?: string;
  children: ReactNode;
  imageOverlay?: ReactNode;
}

export function AuthCard({
  title,
  imageSrc = "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  children,
  imageOverlay,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-4xl border border-border bg-surface backdrop-blur-xl shadow-large">
        {/* Left: 9:16 Image */}
        <div className="hidden w-2/5 lg:block">
          <div className="relative h-full w-full">
            <Image
              src={imageSrc}
              alt="Auth Background"
              width={1000}
              height={1000}
              className="h-full w-full object-cover"
              priority
            />
            {imageOverlay && (
              <div className="absolute top-6 left-6 z-10">{imageOverlay}</div>
            )}
          </div>
        </div>

        {/* Right: Form Container */}
        <div className="flex w-full flex-col justify-center gap-8 p-12 lg:w-3/5 relative">
          <div className="absolute top-8 right-8 flex items-center gap-4">
            <ThemeToggler />
          </div>
          <h1 className="text-h2 font-serif text-foreground">{title}</h1>
          <div className="flex flex-col gap-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
