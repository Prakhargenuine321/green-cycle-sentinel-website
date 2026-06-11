"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GridBackground } from "@/components/ui/grid-background";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { Sparkles, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { verifyOtpAction, resendOtpAction } from "@/app/actions";

export default function OtpVerificationPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    // Only accept numeric entries
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1); // Only keep last typed char
    setCode(newCode);

    // Auto-focus next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Auto-focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(pastedText)) {
      const digits = pastedText.split("");
      setCode(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("verification_email") || "";
    if (savedEmail) {
      setTimeout(() => setEmail(savedEmail), 0);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const pin = code.join("");

    if (pin.length === 6) {
      setLoading(true);
      const res = await verifyOtpAction(email, pin);
      setLoading(false);

      if (res.success) {
        // Clear temp verification email
        localStorage.removeItem("verification_email");
        if (res.role === "INVESTOR" || res.role === "ADMIN") {
          document.cookie = "investor_bypass=true; path=/; max-age=604800; SameSite=Lax";
        }
        router.push("/");
        router.refresh();
      } else {
        setError(res.error || "Verification failed");
      }
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      setTimer(59);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      const res = await resendOtpAction(email);
      if (!res.success) {
        setError(res.error || "Failed to resend verification code");
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
              Verify Your Email
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
              We sent a 6-digit confirmation code to your registered email address.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-500 font-mono text-center">
              {error}
            </div>
          )}

          {/* OTP Code Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2 justify-items-center">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  required
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  value={digit}
                  onPaste={handlePaste}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-12 h-12 rounded-lg border border-border bg-background/50 text-center font-heading text-lg font-bold text-foreground outline-none transition-all duration-300 focus:border-primary/50 focus:ring-3 focus:ring-primary/25"
                />
              ))}
            </div>

            <GlowButton type="submit" disabled={loading} className="w-full gap-2 py-2.5">
              {loading ? "Verifying..." : "Verify Code"} <ShieldCheck className="h-4 w-4" />
            </GlowButton>
          </form>

          {/* Resend Actions */}
          <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border/5 space-y-3">
            {timer > 0 ? (
              <p className="font-mono text-muted-foreground/60">
                Resend code in {timer}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-primary hover:underline font-semibold font-mono flex items-center justify-center space-x-1.5 mx-auto cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Resend Code</span>
              </button>
            )}
            <div>
              Back to{" "}
              <Link href="/register" className="text-primary hover:underline font-medium inline-flex items-center gap-0.5">
                Sign Up <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
