"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";
import { IconButton } from "@repo/ui";

export default function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <IconButton
      variant="texted"
      onClick={toggleTheme}
      icon={theme === "dark" ? FiSun : FiMoon}
      aria-label="Toggle theme"
    />
  );
}
