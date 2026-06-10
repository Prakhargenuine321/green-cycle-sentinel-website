"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/animations";

export interface GridBackgroundProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  showGlow?: boolean;
  glowPosition?: "top" | "center" | "bottom" | "top-right";
  animateReveal?: boolean;
}

export function GridBackground({
  className,
  showGlow = true,
  glowPosition = "top",
  animateReveal = true,
  ...props
}: GridBackgroundProps) {
  const glowPositionClass = {
    top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    "top-right": "top-0 right-0 -translate-y-1/3 translate-x-1/3",
  }[glowPosition];

  const animationProps = animateReveal
    ? {
        variants: fadeIn,
        initial: "hidden",
        animate: "visible",
      }
    : {};

  return (
    <motion.div
      className={cn(
        "absolute inset-0 -z-50 overflow-hidden bg-background transition-colors duration-500",
        className
      )}
      {...animationProps}
      {...props}
    >
      {/* Grid line pattern */}
      <div className="grid-pattern absolute inset-0" />

      {/* Radiant Glowing aura */}
      {showGlow && (
        <div
          className={cn(
            "absolute h-[500px] w-[500px] md:h-[800px] md:w-[800px] rounded-full bg-primary/10 blur-[100px] md:blur-[160px] pointer-events-none",
            glowPositionClass
          )}
        />
      )}

      {/* Secondary glowing aura to build depth */}
      {showGlow && (
        <div
          className={cn(
            "absolute h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-accent/15 blur-[80px] md:blur-[120px] pointer-events-none translate-x-10 translate-y-10",
            glowPositionClass
          )}
        />
      )}
    </motion.div>
  );
}
