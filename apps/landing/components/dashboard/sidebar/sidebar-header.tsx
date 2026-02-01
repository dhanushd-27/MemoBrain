"use client";

import { useSidebar } from "./sidebar-context";
import { cn } from "@repo/ui";
import Image from "next/image";
import Link from "next/link";

export function SidebarHeader() {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        "hidden md:flex items-center p-4 pl-7 mb-2",
        isCollapsed ? "justify-center" : "justify-between",
      )}
    >
        {!isCollapsed && (
          <Link
            href="/dashboard"
            className="font-bold text-xl text-primary overflow-hidden whitespace-nowrap font-serif flex gap-2 items-center justify-center"
          >
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            CoBrain
          </Link>
        )}
    </div>
  );
}
