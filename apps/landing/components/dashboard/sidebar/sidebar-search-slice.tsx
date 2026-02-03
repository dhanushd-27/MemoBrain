"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "./sidebar-context";
import { useRefresh } from "../refresh-context";
import { Button, cn } from "@repo/ui";
import { ShareSliceDialog } from "../slice/share-slice-dialog";

import { TbSearch, TbPlus, TbLoader } from "react-icons/tb";
import { motion } from "motion/react";
import { getSlices } from "../../../services/slice.service";
import type { Slice } from "@repo/types";
import { CreateSliceDialog } from "../slice/create-slice-dialog";
import { UpdateSliceDialog } from "../slice/update-slice-dialog";
import { DeleteSliceDialog } from "../slice/delete-slice-dialog";
import { SearchSliceDialog } from "../slice/search-slice-dialog";

import { useParams, useRouter } from "next/navigation";
import { SliceItem } from "./slice-item";

export function SidebarSearchSlice() {
  const { isCollapsed } = useSidebar();
  const { refreshKey, triggerRefresh } = useRefresh();
  const [slices, setSlices] = useState<Slice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [selectedSlice, setSelectedSlice] = useState<Slice | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sliceToDelete, setSliceToDelete] = useState<Slice | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  // menuRef moved to SliceItem

  const params = useParams();
  const router = useRouter();

  // Helper to decode ID from slug if needed, but we check against raw ID usually.
  // Actually params.id is base64, need to compare carefully.
  const currentSliceId = params.id
    ? (() => {
        try {
          return atob(params.id as string);
        } catch {
          return null;
        }
      })()
    : null;

  const fetchSlices = async () => {
    setLoading(true);
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
  }, [refreshKey]);

  // Click outside logic moved to SliceItem

  const handleDeleteClick = (slice: Slice, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent navigation
    event.stopPropagation();
    setSliceToDelete(slice);
    setIsDeleteDialogOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteSuccess = () => {
    if (sliceToDelete && currentSliceId === sliceToDelete.id) {
      router.push("/dashboard");
    }
    triggerRefresh();
  };

  const handleEdit = (slice: Slice, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent navigation
    event.stopPropagation();
    setSelectedSlice(slice);
    setIsUpdateDialogOpen(true);
    setActiveMenuId(null);
  };

  const handleShare = (slice: Slice, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedSlice(slice);
    setIsShareDialogOpen(true);
    setActiveMenuId(null);
  };

  const toggleMenu = (sliceId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveMenuId(activeMenuId === sliceId ? null : sliceId);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 py-2",
        isCollapsed ? "px-2 items-center" : "px-4",
      )}
    >
      <CreateSliceDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={triggerRefresh}
      />

      <UpdateSliceDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => {
          setIsUpdateDialogOpen(false);
          setSelectedSlice(null);
        }}
        onSuccess={triggerRefresh}
        slice={selectedSlice}
      />

      <ShareSliceDialog
        isOpen={isShareDialogOpen}
        onClose={() => {
          setIsShareDialogOpen(false);
          setSelectedSlice(null);
        }}
        slice={selectedSlice}
      />

      <DeleteSliceDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSliceToDelete(null);
        }}
        onSuccess={handleDeleteSuccess}
        slice={sliceToDelete}
      />

      <SearchSliceDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
      />

      {/* Search Button */}
      {!isCollapsed && (
        <Button
          variant="outlined"
          className="w-full justify-start text-muted-foreground hover:text-foreground h-10 rounded-xl px-3 border-input bg-background/50"
          onClick={() => setIsSearchDialogOpen(true)}
        >
          <TbSearch className="mr-2 text-lg" />
          <span className="text-sm">Search slices</span>
        </Button>
      )}

      {/* Search Icon for collapsed state - expands sidebar when clicked */}
      {isCollapsed && (
        <div
          className="p-2 text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={() => setIsSearchDialogOpen(true)}
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
        onClick={() => setIsCreateDialogOpen(true)}
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
          className="flex flex-col gap-1 pt-4 pb-20" // added padding bottom for scrolling/menu space
        >
          <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
            All Slices
          </div>
          {loading ? (
            <div className="flex justify-center p-2">
              <TbLoader className="animate-spin text-muted-foreground" />
            </div>
          ) : (
            slices.map((slice) => (
              <SliceItem
                key={slice.id}
                slice={slice}
                isActive={currentSliceId === slice.id}
                isMenuOpen={activeMenuId === slice.id}
                onToggleMenu={toggleMenu}
                onEdit={handleEdit}
                onShare={handleShare}
                onDelete={handleDeleteClick}
                closeMenu={() => setActiveMenuId(null)}
              />
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
