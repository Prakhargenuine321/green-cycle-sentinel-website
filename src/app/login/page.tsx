"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GridBackground } from "@/components/ui/grid-background";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowInput } from "@/components/ui/glow-input";
import { PasswordInput } from "@/components/ui/glow-input";
import { GlowButton } from "@/components/ui/glow-button";
import { Sparkles, LogIn, ArrowRight } from "lucide-react";
import { loginAction } from "@/app/actions";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/report-waste";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email && password) {
      setLoading(true);
      const res = await loginAction({ email, password });
      setLoading(false);

      if (res.success) {
        if (res.role === "INVESTOR" || res.role === "ADMIN") {
          document.cookie = "investor_bypass=true; path=/; max-age=604800; SameSite=Lax";
        }
        router.push(redirect);
        router.refresh();
      } else if ("unverified" in res && res.unverified) {
        // Account exists but OTP not completed — send them to verify
        router.push(`/otp-verification?email=${encodeURIComponent(res.email as string)}`);
      } else {
        setError(res.error || "Invalid email or password");
      }
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-16 px-4">
      {/* Background grids */}
      <GridBackground showGlow={true} glowPosition="center" animateReveal={true} />

      <div className="w-full max-w-[400px] relative z-10">
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
              Sign In to Your Account
            </h1>
            <p className="text-xs text-muted-foreground">
              Access waste registries and live AQI nodes.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-500 font-mono text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-muted-foreground/85 uppercase tracking-wider">
                Email Address
              </label>
              <GlowInput
                type="email"
                required
                placeholder="elena@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono text-muted-foreground/85 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/contact"
                  className="text-[10px] text-primary hover:underline font-mono"
                >
                  Forgot Password?
                </Link>
              </div>
              <PasswordInput
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <GlowButton type="submit" disabled={loading} className="w-full gap-2 py-2.5 mt-2">
              {loading ? "Authenticating..." : "Sign In"} <LogIn className="h-4 w-4" />
            </GlowButton>
          </form>

          {/* Signup direct links */}
          <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/5">
            Don&rsquo;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium inline-flex items-center gap-0.5">
              Sign Up <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center bg-background text-foreground font-mono text-xs">
        Loading Authentication Portal...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
