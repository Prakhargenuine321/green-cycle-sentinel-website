"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp } from "@/animations";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
  glowEffect?: boolean;
  animateReveal?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  className,
  hoverEffect = true,
  glowEffect = false,
  animateReveal = true,
  delay = 0,
  ...props
}: GlassCardProps) {
  const motionProps = animateReveal
    ? {
        variants: fadeInUp,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, margin: "-50px" },
        transition: delay ? { delay } : undefined,
      }
    : {};

  return (
    <motion.div
      className={cn(
        "glass-card rounded-2xl p-6",
        hoverEffect && "glass-card-hover",
        glowEffect && "glow-green",
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}
