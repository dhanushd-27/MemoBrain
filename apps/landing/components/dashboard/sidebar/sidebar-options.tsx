"use client";

import { SidebarItem } from "./sidebar-item";
import { MdDashboard, MdSettings, MdPerson, MdFolder } from "react-icons/md";

export function SidebarOptions() {
  return (
    <div className="flex flex-col gap-1 px-2">
      <SidebarItem
        icon={MdDashboard}
        label="Dashboard"
        href="/dashboard"
        isActive={true}
      />
      <SidebarItem
        icon={MdFolder}
        label="Projects"
        href="/dashboard/projects"
      />
      <SidebarItem icon={MdPerson} label="Team" href="/dashboard/team" />
      <SidebarItem
        icon={MdSettings}
        label="Settings"
        href="/dashboard/settings"
      />
    </div>
  );
}
