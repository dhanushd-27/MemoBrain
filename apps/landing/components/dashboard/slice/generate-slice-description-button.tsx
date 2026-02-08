"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui";
import { TbSparkles, TbLoader } from "react-icons/tb";
import { generateSliceDescription, updateSlice } from "../../../services/slice.service";
import type { Slice } from "@repo/types";

interface GenerateSliceDescriptionButtonProps {
  slice: Slice;
  onSuccess: () => void;
  variant?: "button" | "menu-item";
  onMenuClose?: () => void;
}

export const GenerateSliceDescriptionButton = ({
  slice,
  onSuccess,
  variant = "button",
  onMenuClose,
}: GenerateSliceDescriptionButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Generate the description
      const response = await generateSliceDescription(slice.id);
      
      // Update the slice with the new description
      await updateSlice(slice.id, {
        description: response.description,
      });

      // Close menu if it's open
      if (onMenuClose) {
        onMenuClose();
      }

      // Refresh the data
      onSuccess();
    } catch (err) {
      console.error("Failed to generate slice description:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate description. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (variant === "menu-item") {
    return (
      <>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-muted text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <TbLoader className="text-lg animate-spin" /> Generating...
            </>
          ) : (
            <>
              <TbSparkles className="text-lg" /> Generate Description
            </>
          )}
        </button>
        {error && (
          <div className="px-4 py-2 text-xs text-red-500 bg-red-50 dark:bg-red-950/20">
            {error}
          </div>
        )}
      </>
    );
  }

  return (
    <Button
      variant="outlined"
      onClick={handleGenerate}
      disabled={isGenerating}
      className="hidden md:flex"
    >
      {isGenerating ? (
        <>
          <TbLoader className="mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <TbSparkles className="mr-2" />
          Generate Description
        </>
      )}
    </Button>
  );
};
