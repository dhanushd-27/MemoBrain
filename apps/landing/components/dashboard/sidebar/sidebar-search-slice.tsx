"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "./sidebar-context";
import { Input, Button, cn } from "@repo/ui";
import { TbSearch, TbPlus, TbLoader } from "react-icons/tb";
import { motion } from "motion/react";
import Link from "next/link";
import { getSlices, type SliceResponse } from "../../../services/slice.service";
import type { Slice } from "@repo/types";
import { CreateSliceDialog } from "../slice/create-slice-dialog";

export function SidebarSearchSlice() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [slices, setSlices] = useState<Slice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchSlices = async () => {
    try {
      const response = await getSlices();
      setSlices(response.slices);
    } catch (error) {
      console.error("Failed to fetch slices", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlices();
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 py-2",
        isCollapsed ? "px-2 items-center" : "px-4",
      )}
    >
      <CreateSliceDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchSlices}
      />

      {/* Search Bar - Only visible when expanded */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Input
            label=""
            placeholder="Search slices..."
            containerClassName="gap-0"
            className="h-10 rounded-xl"
          />
        </motion.div>
      )}

      {/* Search Icon for collapsed state - expands sidebar when clicked */}
      {isCollapsed && (
        <div
          className="p-2 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={toggleSidebar}
        >
          <TbSearch className="text-xl" />
        </div>
      )}

      {/* New Slice Button */}
      <Button
        className={cn(
          "w-full hover:cursor-pointer",
          isCollapsed ? "h-10 w-10 p-0 rounded-full" : "",
        )}
        variant="contained"
        onClick={() => setIsDialogOpen(true)}
      >
        <TbPlus />
        {!isCollapsed && <span className="ml-2">New Slice</span>}
      </Button>

      {/* Recent Slices */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col gap-1 pt-4"
        >
          <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
            Recent Slices
          </div>
          {loading ? (
            <div className="flex justify-center p-2">
              <TbLoader className="animate-spin text-muted-foreground" />
            </div>
          ) : (
            slices.map((slice) => (
              <Link
                key={slice.id}
                href={`/dashboard/${btoa(slice.id)}`} // Simple Base64 hash as slug
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-sm text-foreground transition-colors"
              >
                <span className="truncate">{slice.name}</span>
              </Link>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
