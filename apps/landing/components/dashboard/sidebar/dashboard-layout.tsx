"use client";

import React from "react";
import { SidebarProvider } from "./sidebar-context";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans antialiased">
        {sidebar}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
