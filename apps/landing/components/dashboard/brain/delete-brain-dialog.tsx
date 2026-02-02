"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui";
import { deleteMemo } from "../../../services/memo.service";
import { TbLoader, TbAlertTriangle } from "react-icons/tb";
import { motion, AnimatePresence } from "motion/react";
import type { Memo } from "@repo/types";

interface DeleteBrainDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  memo: Memo | null;
}

export function DeleteBrainDialog({
  isOpen,
  onClose,
  onSuccess,
  memo,
}: DeleteBrainDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!memo) return;

    setLoading(true);
    setError(null);

    try {
      await deleteMemo(memo.id);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Failed to delete memo", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to delete memo. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !memo) return null;

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
          >
            <div className="bg-card w-full max-w-md p-6 rounded-xl shadow-xl pointer-events-auto border overflow-hidden bg-background">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex items-center flex-col">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-100">
                    <TbAlertTriangle className="text-2xl text-danger" />
                  </div>

                  <h2 className="text-xl font-bold font-serif">
                    Delete Brain?
                  </h2>
                </div>
                <p className="text-muted-foreground text-sm">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">
                    &quot;{memo.title || "this brain"}&quot;
                  </span>
                  ? This action cannot be undone.
                </p>

                {error && (
                  <div className="text-destructive text-sm font-medium">
                    {error}
                  </div>
                )}

                <div className="flex w-full gap-3 mt-4">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 bg-danger text-danger-foreground hover:bg-danger/90"
                  >
                    {loading ? (
                      <TbLoader className="animate-spin mr-2" />
                    ) : null}
                    Delete
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
