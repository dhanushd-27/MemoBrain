"use client";

import React from "react";
import {
  DashboardLayout,
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarSearchSlice,
  // SidebarOptions,
} from "../../components/dashboard/sidebar";
import { RefreshProvider } from "../../components/dashboard/refresh-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  const sidebar = (
    <Sidebar footer={<SidebarFooter />}>
      <SidebarHeader />
      <SidebarSearchSlice />
      {/* <SidebarOptions /> */}
    </Sidebar>
  );

  return (
    <RefreshProvider>
      <DashboardLayout sidebar={sidebar}>{children}</DashboardLayout>
    </RefreshProvider>
  );
}
