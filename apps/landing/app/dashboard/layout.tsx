"use client";

import React from "react";
import {
  DashboardLayout,
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  // SidebarOptions,
} from "../../components/dashboard/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const sidebar = (
    <Sidebar footer={<SidebarFooter />}>
      <SidebarHeader />
      {/* <SidebarOptions /> */}
    </Sidebar>
  );

  return <DashboardLayout sidebar={sidebar}>{children}</DashboardLayout>;
}
