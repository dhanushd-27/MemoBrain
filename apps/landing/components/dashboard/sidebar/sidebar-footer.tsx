"use client";

import { signout } from "../../../services/auth.service";
import { SidebarItem } from "./sidebar-item";
import { MdLogout } from "react-icons/md";

export function SidebarFooter() {
  const handleLogout = async () => {
    await signout();
  };

  return (
    <div className="mt-auto">
      <SidebarItem icon={MdLogout} label="Logout" onClick={handleLogout} />
    </div>
  );
}
