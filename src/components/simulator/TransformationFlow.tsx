"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ImpactResult, WasteTypeId, getWasteType } from "@/lib/simulator-data";

interface TransformationFlowProps {
  impact: ImpactResult;
  wasteTypeId: WasteTypeId;
}

const FLOW_STAGES = [
  { id: "waste", label: "Waste Input", sublabel: "Collection", icon: "🗑️" },
  { id: "heat", label: "Thermal Break", sublabel: "1000°C+ Reactor", icon: "🔥" },
  { id: "syngas", label: "Syngas Yield", sublabel: "Clean Gas Stream", icon: "💨" },
  { id: "energy", label: "Power Generation", sublabel: "Turbine Output", icon: "⚡" },
  { id: "benefit", label: "Env. Benefit", sublabel: "Carbon Offset", icon: "🌿" },
];

export function TransformationFlow({ impact, wasteTypeId }: TransformationFlowProps) {
  const wt = getWasteType(wasteTypeId);
  const prefersReduced = useReducedMotion();
  const intensity = impact.intensity;

  // Particle speed scales with intensity
  const animDuration = prefersReduced ? 0 : Math.max(0.5, 1.8 - intensity * 1.2);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="h-1.5 w-6 rounded-full"
          style={{ backgroundColor: wt.color }}
        />
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          Conversion Flow
        </p>
      </div>

      {/* SVG flow diagram — vertical on mobile, compact on desktop */}
      <div className="relative flex flex-col gap-1">
        {FLOW_STAGES.map((stage, idx) => {
          const isLast = idx === FLOW_STAGES.length - 1;
          const stageIntensity = Math.max(0, Math.min(1, (intensity - idx * 0.12) * 2));
          const isActive = intensity > idx * 0.15;

          return (
            <React.Fragment key={stage.id}>
              {/* Stage node */}
              <motion.div
                className="relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-500"
                animate={{
                  borderColor: isActive
                    ? `${wt.color}50`
                    : "oklch(from var(--border) l c h / 0.15)",
                  backgroundColor: isActive
                    ? `${wt.color}08`
                    : "transparent",
                }}
                transition={{ duration: prefersReduced ? 0 : 0.4 }}
              >
                {/* Animated glow backdrop */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      background: `radial-gradient(ellipse at left, ${wt.glowColor} 0%, transparent 70%)`,
                    }}
                  />
                )}

                {/* Icon with intensity ring */}
                <div className="relative shrink-0">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-lg border transition-all duration-500"
                    style={{
                      borderColor: isActive ? `${wt.color}50` : "transparent",
                      boxShadow: isActive ? `0 0 14px ${wt.glowColor}` : "none",
                      backgroundColor: isActive ? `${wt.color}15` : "oklch(from var(--muted) l c h / 0.4)",
                    }}
                  >
                    <span className="leading-none">{stage.icon}</span>
                  </div>
                  {/* Active pulse ring */}
                  {isActive && !prefersReduced && (
                    <motion.div
                      className="absolute inset-0 rounded-xl border"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      style={{ borderColor: wt.color }}
                    />
                  )}
                </div>

                {/* Text */}
                <div className="flex-grow min-w-0">
                  <p
                    className="text-sm font-heading font-semibold leading-tight transition-colors duration-300"
                    style={{ color: isActive ? wt.color : "oklch(from var(--foreground) l c h / 0.5)" }}
                  >
                    {stage.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">{stage.sublabel}</p>
                </div>

                {/* Intensity mini bar */}
                <div className="shrink-0 w-12 h-1.5 bg-border/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    animate={{ width: `${stageIntensity * 100}%` }}
                    transition={{ duration: prefersReduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{ backgroundColor: wt.color }}
                  />
                </div>
              </motion.div>

              {/* Connector with animated flow line */}
              {!isLast && (
                <div className="relative flex items-center justify-center h-5 ml-5">
                  <div className="absolute left-0 right-0 h-full flex items-center justify-center">
                    <svg
                      width="24"
                      height="20"
                      viewBox="0 0 24 20"
                      className="overflow-visible"
                      aria-hidden="true"
                    >
                      {/* Static track */}
                      <line
                        x1="12" y1="0" x2="12" y2="20"
                        stroke="oklch(from var(--border) l c h / 0.2)"
                        strokeWidth="2"
                      />
                      {/* Animated particle stream */}
                      {isActive && !prefersReduced && (
                        <motion.line
                          x1="12" y1="0" x2="12" y2="20"
                          stroke={wt.color}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="4 8"
                          animate={{ strokeDashoffset: [0, -24] }}
                          transition={{
                            duration: animDuration,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          style={{ filter: `drop-shadow(0 0 3px ${wt.color})` }}
                        />
                      )}
                    </svg>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* System status footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/10">
        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
          Reactor Status
        </span>
        <motion.div
          className="flex items-center gap-1.5"
          animate={intensity > 0.1 ? { opacity: 1 } : { opacity: 0.4 }}
        >
          {!prefersReduced && (
            <motion.div
              className="h-1.5 w-1.5 rounded-full"
              animate={
                intensity > 0.1
                  ? { backgroundColor: wt.color, scale: [1, 1.4, 1] }
                  : { backgroundColor: "oklch(from var(--muted-foreground) l c h / 0.4)", scale: 1 }
              }
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}
          <span
            className="text-[9px] font-mono font-semibold uppercase tracking-wider"
            style={{ color: intensity > 0.1 ? wt.color : undefined }}
          >
            {intensity > 0.5 ? "PEAK OUTPUT" : intensity > 0.1 ? "ACTIVE" : "STANDBY"}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
