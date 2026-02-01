"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  TbLoader,
  TbDotsVertical,
  TbBrain,
  TbPlus,
  TbPencil,
  TbTrash,
  TbShare,
} from "react-icons/tb";
import { IconButton, Button } from "@repo/ui";
import type { Slice, Memo } from "@repo/types";
import { getSlice, getSliceBrains } from "../../../services/slice.service";
import { SidebarTrigger } from "../../../components/dashboard/sidebar/sidebar-trigger";
import { motion, AnimatePresence } from "motion/react";
import { UpdateSliceDialog } from "../../../components/dashboard/slice/update-slice-dialog";
import { DeleteSliceDialog } from "../../../components/dashboard/slice/delete-slice-dialog";
import { ShareSliceDialog } from "../../../components/dashboard/slice/share-slice-dialog";

export default function SliceDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const [slice, setSlice] = useState<Slice | null>(null);
  const [brains, setBrains] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Header menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;

      const idString = params.id;
      const hash = Array.isArray(idString) ? idString[0] : idString;

      if (!hash) return;

      let sliceId;
      try {
        sliceId = atob(hash);
      } catch {
        setError("Invalid slice ID");
        setLoading(false);
        return;
      }

      try {
        const [sliceRes, brainsRes] = await Promise.all([
          getSlice(sliceId),
          getSliceBrains(sliceId),
        ]);

        if (!sliceRes.slice) {
          setError("Slice not found");
        } else {
          setSlice(sliceRes.slice);
          setBrains(brainsRes.brains);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load slice data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <TbLoader className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (error || !slice) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="text-xl font-semibold text-danger">
          {error || "Slice not found"}
        </div>
        <Button variant="outlined" onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="flex items-start gap-4 mb-8">
        <div className="md:hidden mt-1">
          <SidebarTrigger />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-serif font-bold mb-2">{slice.name}</h1>
          <p className="text-muted-foreground max-w-2xl">
            {slice.description || "No description provided."}
          </p>
        </div>
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
                className="absolute right-0 top-full mt-1 w-48 bg-card border rounded-lg shadow-lg z-50 overflow-hidden flex flex-col"
              >
                <button
                  onClick={() => {
                    setIsUpdateDialogOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-muted text-left"
                >
                  <TbPencil className="text-lg" /> Edit Details
                </button>
                <button
                  onClick={() => {
                    setIsShareDialogOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-muted text-left"
                >
                  <TbShare className="text-lg" /> Share Slice
                </button>
                <button
                  onClick={() => {
                    setIsDeleteDialogOpen(true);
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
      </header>

      <div className="h-px bg-border w-full mb-8" />

      {/* Stats/Content */}
      {brains.length === 0 ? (
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
          <Button variant="contained" className="rounded-full px-8">
            <TbPlus className="mr-2 text-xl" />
            Create New Brain
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brains.map((brain) => (
            <div
              key={brain.id}
              className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <TbBrain className="text-xl" />
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
                  {brain.type}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 line-clamp-1">
                {brain.title || "Untitled Brain"}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {/* Add Content */}
                {/* {brain.content} */}
              </p>
              <div className="text-xs text-muted-foreground pt-4 border-t mt-auto">
                Created {new Date(brain.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <UpdateSliceDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        onSuccess={() => {
          // Trigger refresh logic
          window.location.reload();
        }}
        slice={slice}
      />

      <ShareSliceDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        slice={slice}
      />

      <DeleteSliceDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onSuccess={() => router.push("/dashboard")}
        slice={slice}
      />
    </div>
  );
}
