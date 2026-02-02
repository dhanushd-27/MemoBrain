"use client";

import { FiSidebar } from "react-icons/fi";
import { useSidebar } from "./sidebar-context";
import { IconButton } from "@repo/ui";

export function SidebarTrigger() {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleClick = () => {
    // Simple check for desktop vs mobile action
    if (window.innerWidth >= 768) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <IconButton icon={FiSidebar} onClick={handleClick} variant={"texted"} />
  );
}
