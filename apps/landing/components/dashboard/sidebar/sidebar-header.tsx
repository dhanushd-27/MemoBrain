"use client";

import { useSidebar } from "./sidebar-context";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@repo/ui";
import Image from "next/image";

export function SidebarHeader() {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        "hidden md:flex items-center p-4 mb-2",
        isCollapsed ? "justify-center" : "justify-between",
      )}
    >
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="font-bold text-xl text-primary overflow-hidden whitespace-nowrap font-serif flex gap-2 items-center justify-center"
          >
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            CoBrain
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
