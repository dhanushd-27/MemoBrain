"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "./auth-card";
import { Button, Input, Capsule } from "@repo/ui";
import { FcGoogle } from "react-icons/fc";
import { signup } from "../../services/auth.service";

export function SignUpView() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signup(formData);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <AuthCard
      title="Sign Up"
      imageSrc="/signup.png"
      imageOverlay={<Capsule type="link" href="/" text="Back to Home" />}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}
        <Input
          label="Name"
          type="text"
          placeholder="Enter your name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button
          className="mt-2 w-full"
          size="default"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
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

      <Button
        variant="outlined"
        className="w-full"
        icon={FcGoogle}
        onClick={handleGoogleLogin}
      >
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
