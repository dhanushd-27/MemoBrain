"use client";

import React, { useState } from "react";
import { Button, Input } from "@repo/ui";
import { deleteSlice } from "../../../services/slice.service";
import { TbLoader, TbAlertTriangle } from "react-icons/tb";
import { motion, AnimatePresence } from "motion/react";
import type { Slice } from "@repo/types";

interface DeleteSliceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // This will trigger refetch and navigation if needed
  slice: Slice | null;
}

export function DeleteSliceDialog({
  isOpen,
  onClose,
  onSuccess,
  slice,
}: DeleteSliceDialogProps) {
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!slice) return;

    if (confirmation !== slice.name) {
      setError("Slice name does not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteSlice(slice.id);
      setConfirmation("");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to delete slice", err);
      setError("Failed to delete slice. Please try again.");
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
            <div className="bg-card/80 bg-surface w-full max-w-md p-6 rounded-xl shadow-xl pointer-events-auto border border-danger/20">
              <div className="flex items-center gap-2 mb-4 text-danger">
                <TbAlertTriangle className="text-xl" />
                <h2 className="text-h4-bold">Delete Slice</h2>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Cannot be undone. This will permanently delete the slice{" "}
                <span className="font-bold text-foreground">
                  &quot;{slice.name}&quot;
                </span>{" "}
                and all associated brains.
              </p>

              <div className="flex flex-col gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Type &quot;{slice.name}&quot; to confirm
                  </label>
                  <Input
                    label=""
                    value={confirmation}
                    onChange={(e) => {
                      setConfirmation(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder={slice.name}
                    className="bg-background"
                  />
                </div>

                {error && (
                  <div className="text-danger text-sm font-medium">{error}</div>
                )}

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
                    type="button"
                    // Manually styling danger button if variant doesn't exist yet,
                    // or assuming "contained" but adding red class
                    variant="contained"
                    disabled={loading || confirmation !== slice.name}
                    className="min-w-25 bg-danger hover:bg-danger/90 text-white border-danger"
                    onClick={handleDelete}
                  >
                    {loading ? <TbLoader className="animate-spin" /> : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
