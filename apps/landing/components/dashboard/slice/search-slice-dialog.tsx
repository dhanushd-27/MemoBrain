"use client";

import React, { useState, useEffect } from "react";
import { Input, cn } from "@repo/ui";
import { getSlices } from "../../../services/slice.service";
import { TbLoader, TbSearch } from "react-icons/tb";
import { motion, AnimatePresence } from "motion/react";
import { useDebounce } from "../../../hooks/use-debounce";
import type { Slice } from "@repo/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchSliceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchSliceDialog({ isOpen, onClose }: SearchSliceDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [slices, setSlices] = useState<Slice[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchSlices = async (query?: string) => {
    setLoading(true);
    try {
      const response = await getSlices(query);
      setSlices(response.slices);
    } catch (error) {
      console.error("Failed to fetch slices", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSlices(debouncedQuery);
    }
  }, [isOpen, debouncedQuery]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSlices([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
            className="fixed inset-0 z-50 flex items-start pt-[20vh] justify-center pointer-events-none px-4"
          >
            <div className="bg-card w-full max-w-lg p-6 rounded-xl shadow-xl pointer-events-auto border bg-surface flex flex-col gap-4 max-h-[60vh]">
              <div className="flex items-center gap-2 border-b pb-4">
                <TbSearch className="text-xl text-muted-foreground" />
                <input
                  autoFocus
                  className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground"
                  placeholder="Search slices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="text-xs text-muted-foreground border px-1.5 py-0.5 rounded">
                  ESC
                </div>
              </div>

              <div className="flex-1 overflow-y-auto min-h-50 flex flex-col gap-2">
                {loading ? (
                  // Skeleton Loader
                  <div className="space-y-3 p-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-12 bg-muted/50 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : slices.length > 0 ? (
                  slices.map((slice) => (
                    <Link
                      key={slice.id}
                      href={`/dashboard/${btoa(slice.id)}`}
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group",
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium group-hover:text-primary transition-colors">
                          {slice.name}
                        </span>
                        {slice.description && (
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {slice.description}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        Go
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 py-10">
                    <TbSearch className="text-4xl mb-2" />
                    <span>No slices found</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
