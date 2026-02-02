"use client";

import React, { useState, useEffect } from "react";
import { Button, Input } from "@repo/ui";
import { updateSlice } from "../../../services/slice.service";
import { TbLoader } from "react-icons/tb";
import { motion, AnimatePresence } from "motion/react";
import type { Slice } from "@repo/types";

interface UpdateSliceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  slice: Slice | null;
}

export function UpdateSliceDialog({
  isOpen,
  onClose,
  onSuccess,
  slice,
}: UpdateSliceDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slice) {
      setName(slice.name);
      setDescription(slice.description || "");
    }
  }, [slice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slice) return;

    setLoading(true);
    setError(null);

    try {
      await updateSlice(slice.id, { name, description });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to update slice", err);
      setError("Failed to update slice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !slice) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
          >
            <div className="bg-card/80 bg-surface  w-full max-w-md p-6 rounded-xl shadow-xl pointer-events-auto border">
              <h2 className="text-h4-bold mb-4">Edit Slice</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Slice Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marketing Q1"
                  required
                  className="bg-background"
                />
                <div className="flex flex-col gap-1">
                  <label className="text-body-medium text-foreground ml-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description..."
                    className="flex min-h-20 w-full rounded-2xl border-[1.5px] border-input bg-background px-4 py-2 text-body-medium shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    className="min-w-25"
                  >
                    {loading ? <TbLoader className="animate-spin" /> : "Save"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
