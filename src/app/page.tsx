"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <header className="py-3 px-6 md:px-8 lg:px-12 flex items-center justify-between border-b border-gray-200">
        {/* Logo (Left) */}
        <div className="text-xl font-bold text-black">
          Memobrain
        </div>

        {/* Right Side Elements */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/dhanushd-27/MemoBrain"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-black transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
          <Button
            variant="secondary"
            className="text-gray-600 hover:bg-gray-100 hover:text-black border border-gray-300 text-sm"
            onClick={ () => { router.push("/login") } }
          >
            Login
          </Button>
          <Button
            variant="default"
            className="bg-black hover:bg-gray-800 text-white text-sm"
            onClick={ () => { router.push("/signup") } }
          >
            Sign Up
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-black">
            Organize and Share Your Knowledge with Memobrain
          </h1>
          <p className="mt-3 text-lg sm:text-lg md:text-lg text-gray-600 max-w-2xl mx-auto">
            Create and share &quot;brain cards&quot; - collections of important links and resources.
          </p>
          <div className="mt-6">
            <Button
              variant="default"
              size="lg"
              className={cn(
                "bg-black hover:bg-gray-800 text-white",
                "px-6 py-2.5 rounded-full shadow-md hover:shadow-lg",
                "transition-all duration-300 transform hover:scale-105",
                "text-lg sm:text-xl font-semibold"
              )}
            >
              Get Started
            </Button>
          </div>
        </div>
      </main>

      {/* Footer (Optional) */}
      {/* <footer className="py-3 px-6 md:px-8 lg:px-12 text-center text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} Memobrain. All rights reserved.
      </footer> */}
    </div>
  );
};

export default LandingPage;
