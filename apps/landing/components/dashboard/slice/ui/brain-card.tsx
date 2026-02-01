"use client";

import React, { useState } from "react";
import { TbBrain, TbDotsVertical, TbPencil, TbTrash } from "react-icons/tb";
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
        onClick={() => onEdit(brain)}
      >
        {brain.type === "TEXT" && (brain.content as any).text}
        {brain.type === "LINK" && (
          <span className="text-primary underline">
            {(brain.content as any).url}
          </span>
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
          <pre className="bg-muted p-2 rounded text-xs font-mono overflow-hidden">
            {(brain.content as any).code}
          </pre>
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
