"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useScroll, useMotionValueEvent, motion } from "motion/react";
import { Button } from "@repo/ui";
import { Menu, X } from "lucide-react";
import ThemeToggler from "../../theme/theme-toggler";
import { NavDesktop } from "./nav-desktop";
import { NavMobile } from "./nav-mobile";
import { cn } from "@repo/ui";
import { logo } from "@assets";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "FAQ", href: "#faq" },
];

export const Header = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 0);
  });

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || isMobileMenuOpen
          ? "bg-background shadow-md pt-2 md:pb-2" // Solid background when scrolled or open
          : "bg-transparent pt-4 pb-0",
      )}
    >
      <div className="w-full px-6 md:container md:mx-auto md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="CoBrain Logo"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-2xl font-serif font-bold text-foreground">
            CoBrain
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:block">
          <NavDesktop navItems={navItems.slice(0, 3)} />
        </div>

        {/* Right Side (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggler />
          <Link href="/signup">
            <Button variant="contained">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggler />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <NavMobile
        navItems={navItems}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </motion.header>
  );
};
