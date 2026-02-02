"use client";

import React, { useState } from "react";
import { SidebarTrigger } from "./sidebar";
import ThemeToggler from "../theme/theme-toggler";
import { CreateSliceDialog } from "./slice/create-slice-dialog";
import { Button } from "@repo/ui";
import { TbPlus, TbSection } from "react-icons/tb";

export function DashboardView() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="p-6 h-full flex flex-col">
      <header className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
        </div>
        <ThemeToggler />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center -mt-20 text-center space-y-8 max-w-2xl mx-auto px-4">
        <div className="bg-primary/5 p-4 rounded-full ring-1 ring-primary/20">
          <TbSection className="text-4xl text-primary" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
            Welcome to CoBrain
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Organize your thoughts, projects, and ideas into focused
            &quot;Slices&quot;. Each slice focuses on a specific context,
            allowing you to manage related notes, links, and tasks efficiently.
          </p>
        </div>

        <Button
          variant="contained"
          className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-primary/25 transition-all"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <TbPlus className="mr-2 text-2xl" />
          Create New Slice
        </Button>
      </div>

      <CreateSliceDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => {
          // We might want to refresh the sidebar list here, but currently that might happen automatically
          // if the sidebar data fetching relies on something that updates.
          // For now, we can perhaps just close. The sidebar component itself usually handles its own fetching.
          // Ideally, we might trigger a global refetch or router refresh.
          window.location.reload(); // Simple way to ensure sidebar updates for now
        }}
      />
    </div>
  );
}
