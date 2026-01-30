"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@repo/ui";

interface NavItem {
  name: string;
  href: string;
}

interface NavDesktopProps {
  navItems: NavItem[];
}

export const NavDesktop = ({ navItems }: NavDesktopProps) => {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
