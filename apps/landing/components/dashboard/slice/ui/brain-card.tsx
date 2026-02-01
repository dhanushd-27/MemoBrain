"use client";

import React, { useState } from "react";
import {
  TbBrain,
  TbDotsVertical,
  TbPencil,
  TbTrash,
  TbCopy,
  TbCheck,
} from "react-icons/tb";
import { motion, AnimatePresence } from "motion/react";
import type { Memo } from "@repo/types";

interface BrainCardProps {
  brain: Memo;
  onEdit: (brain: Memo) => void;
  onDelete: (brain: Memo) => void;
  activeMenuId: string | null;
  onMenuToggle: (id: string | null) => void;
}

export const BrainCard = ({
  brain,
  onEdit,
  onDelete,
  activeMenuId,
  onMenuToggle,
}: BrainCardProps) => {
  const isMenuOpen = activeMenuId === brain.id;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow relative flex flex-col h-70"
      onMouseLeave={() => isMenuOpen && onMenuToggle(null)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
          <TbBrain className="text-xl" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
            {brain.type}
          </span>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMenuToggle(isMenuOpen ? null : brain.id);
              }}
              className="p-1 hover:bg-muted rounded-full text-muted-foreground"
            >
              <TbDotsVertical />
            </button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute right-0 top-full mt-1 w-32 bg-card border rounded-lg shadow-xl z-10 overflow-hidden bg-surface-muted"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(brain);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-muted text-left"
                  >
                    <TbPencil /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(brain);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-muted text-left text-danger"
                  >
                    <TbTrash /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2 line-clamp-1">
        {brain.title || "Untitled Brain"}
      </h3>

      {/* Preview Content */}
      <div
        className="text-muted-foreground text-sm line-clamp-4 flex-1 mb-4 cursor-pointer"
        onClick={(e) => {
          // Prevent editing when clicking the copy button or iframe
          if (
            (e.target as HTMLElement).closest("button") ||
            (e.target as HTMLElement).closest("iframe")
          ) {
            e.stopPropagation();
            return;
          }
          onEdit(brain);
        }}
      >
        {brain.type === "TEXT" && (brain.content as any).text}
        {brain.type === "LINK" && (
          <div className="flex flex-col justify-center h-full">
            <a
              href={(brain.content as any).url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium break-all flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {(brain.content as any).url}
            </a>
          </div>
        )}
        {brain.type === "TODO" && (
          <ul className="list-disc pl-4 space-y-1">
            {(brain.content as any).items.slice(0, 3).map((item: any) => (
              <li
                key={item.id}
                className={item.completed ? "line-through opacity-50" : ""}
              >
                {item.text}
              </li>
            ))}
            {(brain.content as any).items.length > 3 && <li>...</li>}
          </ul>
        )}
        {brain.type === "QA" && (
          <div>
            <strong>Q:</strong> {(brain.content as any).question}
          </div>
        )}
        {brain.type === "CODE" && (
          <div className="relative group">
            <pre className="bg-muted p-2 rounded text-xs font-mono overflow-hidden whitespace-pre-wrap break-all">
              {(brain.content as any).code}
            </pre>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCopy((brain.content as any).code);
              }}
              className="absolute top-2 right-2 p-1.5 bg-background/80 hover:bg-background rounded-md shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy code"
            >
              {isCopied ? (
                <TbCheck className="text-green-500" />
              ) : (
                <TbCopy className="text-muted-foreground" />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground pt-4 border-t mt-auto flex justify-between items-center">
        <span>created {new Date(brain.createdAt).toLocaleDateString()}</span>
        {brain.pinned && (
          <span className="text-primary text-[10px] font-bold uppercase border border-primary/20 px-1 rounded">
            Pinned
          </span>
        )}
      </div>
    </div>
  );
};
