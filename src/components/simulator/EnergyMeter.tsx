"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ImpactResult, WasteTypeId, getWasteType } from "@/lib/simulator-data";

interface EnergyMeterProps {
  impact: ImpactResult;
  wasteTypeId: WasteTypeId;
}

export function EnergyMeter({ impact, wasteTypeId }: EnergyMeterProps) {
  const wt = getWasteType(wasteTypeId);
  const prefersReduced = useReducedMotion();
  const fillPct = Math.min(impact.intensity * 100, 100);

  // Color shifts with intensity: low = muted green → high = bright primary
  const fillColor = wt.color;

  const SEGMENTS = 12;
  const filledSegments = Math.round((fillPct / 100) * SEGMENTS);

  return (
    <div
      className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-border/15 bg-card/30 backdrop-blur-sm"
      aria-label={`Energy output meter: ${Math.round(fillPct)}% capacity`}
      role="meter"
      aria-valuenow={Math.round(fillPct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Header */}
      <div className="text-center">
        <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
          Output Level
        </p>
      </div>

      {/* Vertical segmented meter */}
      <div className="relative flex flex-col-reverse gap-1" aria-hidden="true">
        {Array.from({ length: SEGMENTS }).map((_, i) => {
          const isFilled = i < filledSegments;
          const segmentIntensity = i / SEGMENTS;

          return (
            <motion.div
              key={i}
              className="w-8 h-3 rounded-sm"
              animate={{
                backgroundColor: isFilled ? fillColor : "oklch(from var(--border) l c h / 0.15)",
                boxShadow: isFilled && !prefersReduced
                  ? `0 0 ${6 + segmentIntensity * 8}px ${fillColor}`
                  : "none",
                opacity: isFilled ? 0.7 + segmentIntensity * 0.3 : 0.25,
              }}
              transition={{
                duration: prefersReduced ? 0 : 0.4,
                delay: prefersReduced ? 0 : isFilled ? i * 0.03 : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}

        {/* Top glow cap */}
        {fillPct > 5 && !prefersReduced && (
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full meter-glow-pulse"
            style={{
              backgroundColor: fillColor,
              boxShadow: `0 0 12px ${fillColor}, 0 0 24px ${fillColor}`,
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Percentage */}
      <motion.p
        key={Math.round(fillPct)}
        initial={prefersReduced ? false : { scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="font-heading text-base font-black count-up-number"
        style={{ color: fillColor }}
      >
        {Math.round(fillPct)}%
      </motion.p>

      {/* kWh label */}
      <p className="text-[9px] font-mono text-muted-foreground text-center leading-tight">
        Reactor<br />Capacity
      </p>
    </div>
  );
}
