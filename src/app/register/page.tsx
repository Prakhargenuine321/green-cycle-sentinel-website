"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GridBackground } from "@/components/ui/grid-background";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowInput } from "@/components/ui/glow-input";
import { PasswordInput } from "@/components/ui/glow-input";
import { GlowButton } from "@/components/ui/glow-button";
import { Sparkles, ArrowRight, UserPlus } from "lucide-react";
import { registerAction } from "@/app/actions";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await registerAction({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);
    if (res.success) {
      // Keep track of email for verification
      localStorage.setItem("verification_email", formData.email);
      router.push("/otp-verification");
    } else {
      setError(res.error || "Registration failed");
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center py-16 px-4">
      {/* Background grids */}
      <GridBackground showGlow={true} glowPosition="center" animateReveal={true} />

      <div className="w-full max-w-[420px] relative z-10">
        <GlassCard animateReveal={true} hoverEffect={false} className="border-border/15 p-8 space-y-6">
          {/* Header branding */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center space-x-2 group focus:outline-none mb-2">
              <div className="relative h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <span className="font-heading text-base font-bold tracking-tight text-foreground">
                GCS <span className="font-sans font-light text-muted-foreground/80 text-xs">Sentinel</span>
              </span>
            </Link>
            <h1 className="font-heading text-xl font-bold text-foreground">
              Create Your Account
            </h1>
            <p className="text-xs text-muted-foreground">
              Register to submit reports and track collections.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-500 font-mono text-center">
              {error}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-muted-foreground/85 uppercase tracking-wider">
                Full Name
              </label>
              <GlowInput
                required
                placeholder="Elena Rostova"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-muted-foreground/85 uppercase tracking-wider">
                Email Address
              </label>
              <GlowInput
                type="email"
                required
                placeholder="elena@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-muted-foreground/85 uppercase tracking-wider">
                  Password
                </label>
                <PasswordInput
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-muted-foreground/85 uppercase tracking-wider">
                  Confirm
                </label>
                <PasswordInput
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <GlowButton type="submit" disabled={loading} className="w-full gap-2 py-2.5 mt-2">
              {loading ? "Registering..." : "Create Account"} <UserPlus className="h-4 w-4" />
            </GlowButton>
          </form>

          {/* Login direct links */}
          <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/5">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium inline-flex items-center gap-0.5">
              Sign In <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
