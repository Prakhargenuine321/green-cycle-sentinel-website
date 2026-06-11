"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { WasteTypeId, getWasteType } from "@/lib/simulator-data";

interface QuantitySliderProps {
  wasteTypeId: WasteTypeId;
  value: number;
  onChange: (value: number) => void;
}

const MIN_KG = 1;
const MAX_KG = 10_000;

/** Maps linear slider (0–1) → logarithmic kg value */
function linearToLog(linear: number): number {
  return Math.round(
    Math.pow(10, Math.log10(MIN_KG) + linear * (Math.log10(MAX_KG) - Math.log10(MIN_KG)))
  );
}

/** Maps kg value → linear slider position (0–1) */
function logToLinear(kg: number): number {
  return (Math.log10(kg) - Math.log10(MIN_KG)) / (Math.log10(MAX_KG) - Math.log10(MIN_KG));
}

function formatKg(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(kg >= 5000 ? 0 : 1)}t`;
  return `${kg.toLocaleString()}kg`;
}

const MARKS = [
  { label: "1kg", kg: 1 },
  { label: "100kg", kg: 100 },
  { label: "1t", kg: 1000 },
  { label: "10t", kg: 10000 },
];

export function QuantitySlider({ wasteTypeId, value, onChange }: QuantitySliderProps) {
  const prefersReduced = useReducedMotion();
  const sliderRef = useRef<HTMLInputElement>(null);
  const [isActive, setIsActive] = useState(false);
  const wt = getWasteType(wasteTypeId);

  const linearProgress = logToLinear(value);
  const progressPct = `${(linearProgress * 100).toFixed(2)}%`;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const linear = parseFloat(e.target.value);
      onChange(linearToLog(linear));
    },
    [onChange]
  );

  return (
    <div className="space-y-6">
      {/* Value display */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">
            Waste Quantity
          </p>
          <motion.div
            key={value}
            initial={prefersReduced ? false : { y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-baseline gap-2"
          >
            <span
              className="font-heading text-4xl sm:text-5xl font-black tracking-tight count-up-number"
              style={{ color: wt.color }}
            >
              {value >= 1000
                ? (value / 1000).toFixed(value >= 5000 ? 0 : 1)
                : value.toLocaleString()}
            </span>
            <span className="text-lg text-muted-foreground font-mono">
              {value >= 1000 ? "tonnes" : "kg"}
            </span>
          </motion.div>
        </div>

        {/* Live intensity bar */}
        <div className="flex flex-col items-end gap-1">
          <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
            Intensity
          </p>
          <div className="flex gap-0.5">
            {[0.1, 0.25, 0.45, 0.65, 0.85].map((threshold, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full"
                animate={{
                  height: linearProgress >= threshold ? "20px" : "8px",
                  backgroundColor:
                    linearProgress >= threshold ? wt.color : "oklch(from var(--border) l c h / 0.3)",
                }}
                transition={{ duration: prefersReduced ? 0 : 0.25, delay: i * 0.04 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Slider track */}
      <div className="relative pt-2 pb-6">
        <div
          className="relative"
          style={{ "--slider-progress": progressPct } as React.CSSProperties}
        >
          <input
            ref={sliderRef}
            id="quantity-slider"
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={linearProgress}
            onChange={handleChange}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            className="simulator-slider"
            aria-label="Waste quantity"
            aria-valuemin={MIN_KG}
            aria-valuemax={MAX_KG}
            aria-valuenow={value}
            aria-valuetext={`${formatKg(value)} of waste`}
            style={{ "--slider-progress": progressPct } as React.CSSProperties}
          />

          {/* Active glow track overlay */}
          {isActive && !prefersReduced && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 left-0 h-[4px] -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: progressPct,
                background: wt.color,
                boxShadow: `0 0 12px ${wt.glowColor}`,
              }}
            />
          )}
        </div>

        {/* Scale marks */}
        <div className="absolute bottom-0 left-0 w-full flex justify-between pointer-events-none">
          {MARKS.map((mark) => {
            const pos = logToLinear(mark.kg) * 100;
            return (
              <div
                key={mark.kg}
                className="absolute flex flex-col items-center gap-0.5"
                style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
              >
                <div
                  className="w-px h-2 rounded-full"
                  style={{
                    backgroundColor:
                      value >= mark.kg
                        ? wt.color
                        : "oklch(from var(--border) l c h / 0.4)",
                  }}
                />
                <span className="text-[9px] font-mono text-muted-foreground">{mark.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Helper chips */}
      <div className="flex gap-2 flex-wrap">
        {[100, 500, 1000, 5000, 10000].map((preset) => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-border/20 text-muted-foreground hover:border-primary/40 hover:text-primary transition-all duration-200 cursor-pointer"
            style={
              value === preset
                ? { borderColor: wt.color, color: wt.color }
                : {}
            }
            aria-label={`Set quantity to ${formatKg(preset)}`}
          >
            {formatKg(preset)}
          </button>
        ))}
      </div>
    </div>
  );
}
