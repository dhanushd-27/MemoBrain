import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Button } from "@repo/ui";
import { cn } from "@repo/ui";

interface NavItem {
  name: string;
  href: string;
}

interface NavMobileProps {
  navItems: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const NavMobile = ({ navItems, isOpen, onClose }: NavMobileProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden bg-background"
        >
          <nav className="flex flex-col px-6 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "text-base font-medium transition-colors hover:text-primary pt-2 rounded-md hover:bg-muted",
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              <Link href="/signup" onClick={onClose} className="w-full block">
                <Button variant="contained" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
