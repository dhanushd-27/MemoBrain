"use client";

import { signout } from "../../../services/auth.service";
import { SidebarItem } from "./sidebar-item";
import { MdLogout } from "react-icons/md";
import ThemeToggler from "../../theme/theme-toggler";

export function SidebarFooter() {
  const handleLogout = async () => {
    await signout();
    window.location.href = "/";
  };

  return (
    <div className="mt-auto">
      <div className="flex items-center justify-between w-full">
        <ThemeToggler />
        <SidebarItem icon={MdLogout} label="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
}
