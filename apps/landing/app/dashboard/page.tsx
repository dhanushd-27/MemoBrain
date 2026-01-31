import React from "react";
import { SidebarTrigger } from "../../components/dashboard/sidebar";
import ThemeToggler from "../../components/theme/theme-toggler";
import { MdChevronRight } from "react-icons/md";

export default function Dashboard() {
  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <SidebarTrigger/>
          <MdChevronRight />
          <h1 className="text-sm font-regular">Dashboard Overview</h1>
        </div>
        <ThemeToggler />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-card border shadow-sm">
          <h3 className="font-semibold mb-2">Total Projects</h3>
          
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="p-6 rounded-xl bg-card border shadow-sm">
          <h3 className="font-semibold mb-2">Active Tasks</h3>
          <p className="text-3xl font-bold">24</p>
        </div>
        <div className="p-6 rounded-xl bg-card border shadow-sm">
          <h3 className="font-semibold mb-2">Team Members</h3>
          <p className="text-3xl font-bold">8</p>
        </div>
      </div>
    </div>
  );
}
