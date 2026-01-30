"use client";

import React from "react";
import { AuthCard } from "../../../components/auth/auth-card";
import { Button, Input, Capsule } from "@repo/ui";
import { FcGoogle } from "react-icons/fc";

export default function SignUpPage() {
  return (
    <AuthCard
      title="Sign Up"
      imageSrc="/signup.png"
      imageOverlay={<Capsule type="link" href="/" text="Back to Home" />}
    >
      <form className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          id="email"
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          id="password"
        />
        <Button className="mt-2 w-full" size="default">
          Sign Up
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button variant="outlined" className="w-full" icon={FcGoogle}>
        Login with Google
      </Button>

      <div className="flex justify-center text-body-regular text-muted-foreground">
        Already have an account?{" "}
        <a
          href="/signin"
          className="ml-1 text-foreground underline hover:text-muted-foreground transition-colors"
        >
          Sign In
        </a>
      </div>
    </AuthCard>
  );
}
