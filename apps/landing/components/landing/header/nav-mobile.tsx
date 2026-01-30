"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { cn } from "@repo/ui";

interface NavItem {
  name: string;
  href: string;
}

interface NavMobileProps {
  navItems: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const NavMobile = ({ navItems, isOpen, onClose }: NavMobileProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden bg-background border-b border-border shadow-md"
        >
          <nav className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary p-2 rounded-md hover:bg-muted",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
