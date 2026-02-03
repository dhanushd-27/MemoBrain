"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@repo/ui";
import { TbDotsVertical, TbTrash, TbPencil, TbShare } from "react-icons/tb";
import { motion, AnimatePresence } from "motion/react";
import type { Slice } from "@repo/types";
import { useSidebar } from "./sidebar-context"; // Import useSidebar

interface SliceItemProps {
  slice: Slice;
  isActive: boolean;
  isMenuOpen: boolean;
  onToggleMenu: (id: string, e: React.MouseEvent) => void;
  onEdit: (slice: Slice, e: React.MouseEvent) => void;
  onShare: (slice: Slice, e: React.MouseEvent) => void;
  onDelete: (slice: Slice, e: React.MouseEvent) => void;
  closeMenu: () => void;
}

export const SliceItem: React.FC<SliceItemProps> = ({
  slice,
  isActive,
  isMenuOpen,
  onToggleMenu,
  onEdit,
  onShare,
  onDelete,
  closeMenu,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { closeMobileSidebar } = useSidebar(); // Access closeMobileSidebar

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, closeMenu]);

  const handleLinkClick = () => {
    // Check if window width is mobile sized (optional optimization, but closeMobileSidebar likely handles logic or is harmless)
    // Actually, calling it always is safe as per context definition usually.
    closeMobileSidebar();
  };

  return (
    <div className="relative group">
      <Link
        href={`/dashboard/${btoa(slice.id)}`}
        className={cn(
          "flex items-center justify-between p-2 rounded-md hover:bg-muted text-sm transition-colors group",
          isActive
            ? "bg-muted text-foreground font-medium"
            : "text-muted-foreground",
        )}
        onClick={handleLinkClick} // Add click handler
      >
        <span className="truncate pr-8">{slice.name}</span>

        {/* Action Menu Trigger */}
        <div
          className={cn(
            "absolute right-2 p-1 rounded-md hover:bg-background/80 transition-opacity",
            isMenuOpen ? "bg-background/80" : "",
          )}
          onClick={(e) => onToggleMenu(slice.id, e)}
        >
          <TbDotsVertical className="text-muted-foreground hover:text-foreground" />
        </div>
      </Link>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            className="absolute right-0 top-full mt-1 w-32 bg-card border rounded-lg shadow-lg z-50 overflow-hidden flex flex-col"
          >
            <button
              onClick={(e) => onEdit(slice, e)}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-muted text-left"
            >
              <TbPencil className="text-sm" /> Edit
            </button>
            <button
              onClick={(e) => onShare(slice, e)}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-muted text-left"
            >
              <TbShare className="text-sm" /> Share
            </button>
            <button
              onClick={(e) => onDelete(slice, e)}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-muted text-left text-danger"
            >
              <TbTrash className="text-sm" /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
