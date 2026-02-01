"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TbLoader } from "react-icons/tb";
import { Button } from "@repo/ui";
import type { Memo } from "@repo/types";
import { UpdateSliceDialog } from "../../../components/dashboard/slice/update-slice-dialog";
import { DeleteSliceDialog } from "../../../components/dashboard/slice/delete-slice-dialog";
import { ShareSliceDialog } from "../../../components/dashboard/slice/share-slice-dialog";
import { CreateBrainDialog } from "../../../components/dashboard/brain/create-brain-dialog";
import { DeleteBrainDialog } from "../../../components/dashboard/brain/delete-brain-dialog";
import { useSliceData } from "../../../hooks/use-slice-data";
import { SliceHeader } from "../../../components/dashboard/slice/ui/slice-header";
import { BrainGrid } from "../../../components/dashboard/slice/ui/brain-grid";

export default function SliceDashboardPage() {
  const router = useRouter();
  const { slice, brains, loading, error, refresh } = useSliceData();

  // Slice Dialog states
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Brain Dialog States
  const [isCreateBrainDialogOpen, setIsCreateBrainDialogOpen] = useState(false);
  const [isDeleteBrainDialogOpen, setIsDeleteBrainDialogOpen] = useState(false);
  const [selectedBrain, setSelectedBrain] = useState<Memo | null>(null);

  const handleEditBrain = (brain: Memo) => {
    setSelectedBrain(brain);
    setIsCreateBrainDialogOpen(true);
  };

  const handleDeleteBrain = (brain: Memo) => {
    setSelectedBrain(brain);
    setIsDeleteBrainDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateBrainDialogOpen(false);
    setTimeout(() => setSelectedBrain(null), 300); // Clear after animation
  };

  const handleNewBrain = () => {
    setSelectedBrain(null);
    setIsCreateBrainDialogOpen(true);
  };

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
      <SliceHeader
        slice={slice}
        onNewBrain={handleNewBrain}
        onEditSlice={() => setIsUpdateDialogOpen(true)}
        onShareSlice={() => setIsShareDialogOpen(true)}
        onDeleteSlice={() => setIsDeleteDialogOpen(true)}
      />

      <div className="h-px bg-border w-full mb-8" />

      <BrainGrid
        brains={brains}
        onNewBrain={handleNewBrain}
        onEditBrain={handleEditBrain}
        onDeleteBrain={handleDeleteBrain}
      />

      {/* Dialogs */}
      <UpdateSliceDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        onSuccess={refresh}
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

      <CreateBrainDialog
        isOpen={isCreateBrainDialogOpen}
        onClose={handleCloseCreateDialog}
        onSuccess={refresh}
        sliceId={slice.id}
        initialData={selectedBrain}
      />

      <DeleteBrainDialog
        isOpen={isDeleteBrainDialogOpen}
        onClose={() => setIsDeleteBrainDialogOpen(false)}
        onSuccess={refresh}
        memo={selectedBrain}
      />
    </div>
  );
}
