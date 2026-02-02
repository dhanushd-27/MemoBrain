"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui";
import { TbBrain, TbPlus } from "react-icons/tb";
import type { Memo } from "@repo/types";
import { BrainCard } from "./brain-card";

interface BrainGridProps {
  brains: Memo[];
  onNewBrain: () => void;
  onEditBrain: (brain: Memo) => void;
  onDeleteBrain: (brain: Memo) => void;
}

export const BrainGrid = ({
  brains,
  onNewBrain,
  onEditBrain,
  onDeleteBrain,
}: BrainGridProps) => {
  const [openBrainMenuId, setOpenBrainMenuId] = useState<string | null>(null);

  if (brains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-6 text-center">
        <div className="bg-muted p-6 rounded-full">
          <TbBrain className="text-6xl text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">No brains yet</h3>
          <p className="text-muted-foreground max-w-sm">
            This slice is empty. Create your first brain (memo) to start
            organizing your thoughts.
          </p>
        </div>
        <Button
          variant="contained"
          className="rounded-full px-8"
          onClick={onNewBrain}
        >
          <TbPlus className="mr-2 text-xl" />
          Create New Brain
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {brains.map((brain) => (
        <BrainCard
          key={brain.id}
          brain={brain}
          onEdit={onEditBrain}
          onDelete={onDeleteBrain}
          activeMenuId={openBrainMenuId}
          onMenuToggle={setOpenBrainMenuId}
        />
      ))}
    </div>
  );
};
