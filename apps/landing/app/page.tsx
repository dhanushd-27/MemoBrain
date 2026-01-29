import React from "react";
import ThemeToggler from "../components/theme/theme-toggler";

import Link from "next/link";
import { Button } from "@repo/ui";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="CoBrain Logo" className="h-8 w-8" />
          <span className="text-h4-bold text-foreground">CoBrain</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggler />
          <Link href="/signin">
            <Button variant="texted">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button variant="contained">Sign Up</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <h1 className="text-h1 text-center text-foreground font-serif">
          Welcome to CoBrain
        </h1>
        <p className="text-body-medium text-center text-muted-foreground">
          CoBrain is a platform for mental health and wellness.
        </p>
      </main>
    </div>
  );
}
