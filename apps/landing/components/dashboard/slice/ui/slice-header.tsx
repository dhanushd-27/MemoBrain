"use client";

import React, { useState } from "react";
import { Button, IconButton } from "@repo/ui";
import {
  TbPlus,
  TbDotsVertical,
  TbPencil,
  TbShare,
  TbTrash,
} from "react-icons/tb";
import { motion, AnimatePresence } from "motion/react";
import { SidebarTrigger } from "../../sidebar/sidebar-trigger";
import type { Slice } from "@repo/types";
import ThemeToggler from "../../../theme/theme-toggler";

interface SliceHeaderProps {
  slice: Slice;
  onNewBrain: () => void;
  onEditSlice: () => void;
  onShareSlice: () => void;
  onDeleteSlice: () => void;
}

export const SliceHeader = ({
  slice,
  onNewBrain,
  onEditSlice,
  onShareSlice,
  onDeleteSlice,
}: SliceHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex items-start gap-4 mb-8">
      <div className="mt-1 mr-2">
        <SidebarTrigger />
      </div>
      <div className="flex-1">
        <h1 className="text-4xl font-serif font-bold mb-2">{slice.name}</h1>
        <p className="text-muted-foreground max-w-2xl">
          {slice.description || "No description provided."}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggler />
        <Button
          variant="contained"
          onClick={onNewBrain}
          className="hidden md:flex"
        >
          <TbPlus className="mr-2" />
          New Brain
        </Button>

        <div className="relative">
          <IconButton
            icon={TbDotsVertical}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            variant="texted"
          />

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                className="absolute right-0 top-full mt-1 w-48 bg-card border rounded-lg shadow-lg z-50 overflow-hidden flex flex-col bg-surface"
              >
                <button
                  onClick={() => {
                    onNewBrain();
                    setIsMenuOpen(false);
                  }}
                  className="flex md:hidden items-center gap-2 w-full px-4 py-3 text-sm hover:bg-muted text-left"
                >
                  <TbPlus className="text-lg" /> New Brain
                </button>
                <button
                  onClick={() => {
                    onEditSlice();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-muted text-left"
                >
                  <TbPencil className="text-lg" /> Edit Details
                </button>
                <button
                  onClick={() => {
                    onShareSlice();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-muted text-left"
                >
                  <TbShare className="text-lg" /> Share Slice
                </button>
                <button
                  onClick={() => {
                    onDeleteSlice();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-muted text-left text-danger"
                >
                  <TbTrash className="text-lg" /> Delete Slice
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
