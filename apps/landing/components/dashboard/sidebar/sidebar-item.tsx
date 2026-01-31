"use client";

import Link from "next/link";
import type { IconType } from "react-icons";
import { motion, AnimatePresence } from "motion/react";
import { useSidebar } from "./sidebar-context";
import { cn } from "@repo/ui";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarItem({
  icon: Icon,
  label,
  href,
  isActive,
  onClick,
}: SidebarItemProps) {
  const { isCollapsed } = useSidebar();

  const content = (
    <>
      <Icon className="text-xl shrink-0" />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="ml-3 font-medium whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );

  const parentClasses = cn(
    "flex items-center px-4 py-3 cursor-pointer transition-colors duration-200 rounded-lg mx-2 my-1",
    isActive
      ? "bg-primary/10 text-primary hover:bg-primary/20"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
    isCollapsed ? "justify-center px-0" : "justify-start",
  );

  if (href) {
    return (
      <Link href={href} className={parentClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={parentClasses}>
      {content}
    </div>
  );
}
