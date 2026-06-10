"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface GlowButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Button>, "key" | "style"> {
  glowColor?: "primary" | "secondary" | "accent" | "none";
  animateScale?: boolean;
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, children, glowColor = "primary", animateScale = true, ...props }, ref) => {
    
    const glowClasses = {
      primary: "shadow-[0_0_15px_oklch(from_var(--primary)_l_c_h_/_0.15)] hover:shadow-[0_0_25px_oklch(from_var(--primary)_l_c_h_/_0.45)] hover:border-primary/30",
      secondary: "shadow-[0_0_15px_oklch(from_var(--secondary)_l_c_h_/_0.1)] hover:shadow-[0_0_20px_oklch(from_var(--secondary)_l_c_h_/_0.2)]",
      accent: "shadow-[0_0_15px_oklch(from_var(--accent)_l_c_h_/_0.15)] hover:shadow-[0_0_25px_oklch(from_var(--accent)_l_c_h_/_0.4)]",
      none: "",
    }[glowColor];

    const buttonElement = (
      <Button
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-all duration-300 border border-transparent cursor-pointer",
          glowClasses,
          className
        )}
        {...props}
      >
        {/* Glow backdrop gradient */}
        {glowColor !== "none" && (
          <span className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 to-accent/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}
        {children}
      </Button>
    );

    if (animateScale) {
      return (
        <motion.div
          className="inline-block"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          {buttonElement}
        </motion.div>
      );
    }

    return buttonElement;
  }
);

GlowButton.displayName = "GlowButton";
