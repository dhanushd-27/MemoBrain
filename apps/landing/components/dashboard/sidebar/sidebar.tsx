"use client";

import { useSidebar } from "./sidebar-context";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@repo/ui";
import { MdClose } from "react-icons/md"; // Example icons, user asked for react-icons
import Image from "next/image";
import React from "react";
import Link from "next/link";

export function Sidebar({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { isCollapsed, isMobileOpen, closeMobileSidebar } = useSidebar();

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className={cn(
          "hidden md:flex flex-col bg-card h-screen sticky top-0 left-0 z-30 shrink-0 overflow-hidden",
          isCollapsed ? "border-none" : "border-r",
        )}
        initial={false}
        animate={{
          width: isCollapsed ? 0 : 240,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <div className="flex-1 overflow-y-auto py-4">{children}</div>
        {footer && <div className="p-2">{footer}</div>}
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileSidebar}
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            {/* Sidebar Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r shadow-lg flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary font-serif">
                  <Image src="/logo.png" alt="Logo" width={32} height={32} />
                  CoBrain
                </Link>
                <button
                  onClick={closeMobileSidebar}
                  className="p-2 hover:bg-muted rounded-md text-foreground"
                >
                  <MdClose className="text-2xl" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-2 py-4">{children}</div>
              {footer && <div className="pb-2">{footer}</div>}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
