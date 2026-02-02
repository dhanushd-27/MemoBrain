"use client";

import Link from "next/link";

interface NavItem {
  name: string;
  href: string;
}

interface NavDesktopProps {
  navItems: NavItem[];
}

export const NavDesktop = ({ navItems }: NavDesktopProps) => {
  return (
    <nav className="flex items-center gap-8">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
