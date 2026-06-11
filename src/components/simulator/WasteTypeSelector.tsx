"use client";

import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { WASTE_TYPES, WasteTypeId } from "@/lib/simulator-data";
import { staggerContainer, staggerChildFadeInUp, EASE_PRESET } from "@/animations";

interface WasteTypeSelectorProps {
  selected: WasteTypeId;
  onChange: (id: WasteTypeId) => void;
}

export function WasteTypeSelector({ selected, onChange }: WasteTypeSelectorProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: WasteTypeId, idx: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onChange(id);
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = WASTE_TYPES[(idx + 1) % WASTE_TYPES.length];
        onChange(next.id);
        (document.getElementById(`waste-card-${next.id}`) as HTMLElement)?.focus();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = WASTE_TYPES[(idx - 1 + WASTE_TYPES.length) % WASTE_TYPES.length];
        onChange(prev.id);
        (document.getElementById(`waste-card-${prev.id}`) as HTMLElement)?.focus();
      }
    },
    [onChange]
  );

  return (
    <motion.div
      variants={staggerContainer(0.06, 0)}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
      role="radiogroup"
      aria-label="Select waste type"
    >
      {WASTE_TYPES.map((wt, idx) => {
        const isSelected = selected === wt.id;
        return (
          <motion.div
            key={wt.id}
            id={`waste-card-${wt.id}`}
            variants={staggerChildFadeInUp}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onClick={() => onChange(wt.id)}
            onKeyDown={(e) => handleKeyDown(e, wt.id, idx)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border cursor-pointer select-none",
              "transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "min-h-[100px] sm:min-h-[110px]",
              isSelected
                ? "border-primary/60 bg-primary/8 scale-[1.03] shadow-[0_0_28px_var(--card-glow)]"
                : "border-border/15 bg-card/40 hover:border-border/35 hover:bg-card/70 hover:scale-[1.01]"
            )}
            style={
              {
                "--card-glow": wt.glowColor,
                boxShadow: isSelected ? `0 0 28px ${wt.glowColor}` : undefined,
              } as React.CSSProperties
            }
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Selection indicator ring */}
            {isSelected && (
              <motion.div
                layoutId="waste-selection-ring"
                className="absolute inset-0 rounded-2xl border-2"
                style={{ borderColor: wt.color }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}

            {/* Icon */}
            <motion.span
              animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.4, ease: EASE_PRESET }}
              className="text-3xl leading-none"
              aria-hidden="true"
            >
              {wt.icon}
            </motion.span>

            {/* Labels */}
            <div className="text-center">
              <p
                className={cn(
                  "font-heading text-sm font-semibold leading-tight",
                  isSelected ? "text-foreground" : "text-foreground/80"
                )}
              >
                {wt.label}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                {wt.description}
              </p>
            </div>

            {/* Process temp badge (shown only on selected) */}
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute top-2 right-2 text-[8px] font-mono px-1.5 py-0.5 rounded border"
                style={{
                  color: wt.color,
                  borderColor: `${wt.color}40`,
                  backgroundColor: `${wt.color}12`,
                }}
              >
                {wt.processTempC}°C
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
