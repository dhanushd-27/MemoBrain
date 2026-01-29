"use client";

import React from "react";
import ThemeToggler from "../components/theme/theme-toggler";
import { Button } from "@repo/ui";
import { ArrowRight } from "lucide-react";

export default function App() {
  return (
    <section className="flex flex-col">
      <h1 className="text-4xl font-bold font-serif">CoBrain</h1>
      <p className="text-xl font-normal font-sans">
        CoBrain is a platform for mental health and wellness.
      </p>
      <ThemeToggler />
      <Button variant="cta" icon={ArrowRight}>
        Get Started
      </Button>
    </section>
  );
}
