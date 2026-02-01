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

export default function Layout({ children }: { children: React.ReactNode }) {
  const sidebar = (
    <Sidebar footer={<SidebarFooter />}>
      <SidebarHeader />
      <SidebarSearchSlice />
      {/* <SidebarOptions /> */}
    </Sidebar>
  );

  return <DashboardLayout sidebar={sidebar}>{children}</DashboardLayout>;
}
