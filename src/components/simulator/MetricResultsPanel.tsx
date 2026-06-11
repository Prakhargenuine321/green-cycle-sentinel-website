"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Leaf, Trash2, Wind } from "lucide-react";
import { ImpactResult, WasteTypeId, getWasteType, formatEnergy, formatCarbon, formatEmission, formatNumber } from "@/lib/simulator-data";
import { staggerContainer, staggerChildFadeInUp } from "@/animations";

interface MetricResultsPanelProps {
  impact: ImpactResult;
  wasteTypeId: WasteTypeId;
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
  color: string;
  glowColor: string;
  progress: number; // 0–1
  delay?: number;
}


/** SVG ring progress indicator */
function ImpactRing({
  progress,
  color,
  size = 52,
  strokeWidth = 4,
}: {
  progress: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(progress, 1));

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rotate-[-90deg]"
      aria-hidden="true"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={strokeWidth}
        className="impact-ring-track"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={strokeWidth}
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="none"
        className="impact-ring-fill"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  );
}

function MetricCard({ icon, label, value, subValue, color, glowColor, progress, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      variants={staggerChildFadeInUp}
      className="relative flex flex-col justify-between p-4 rounded-2xl border border-border/15 bg-card/40 backdrop-blur-sm overflow-hidden group"
      style={{ "--card-glow": glowColor } as React.CSSProperties}
      whileHover={{
        borderColor: `${color}50`,
        boxShadow: `0 0 24px ${glowColor}`,
        y: -2,
      }}
      transition={{ duration: 0.25 }}
    >
      {/* Background ambient glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top left, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex items-start justify-between">
        {/* Icon */}
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center border"
          style={{
            backgroundColor: `${color}14`,
            borderColor: `${color}28`,
            color,
          }}
        >
          {icon}
        </div>
        {/* Ring */}
        <ImpactRing progress={progress} color={color} />
      </div>

      <div className="relative z-10 mt-3 space-y-0.5">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p
          className="font-heading text-xl sm:text-2xl font-black count-up-number leading-tight"
          style={{ color }}
        >
          {value}
        </p>
        <p className="text-[10px] text-muted-foreground">{subValue}</p>
      </div>
    </motion.div>
  );
}

export function MetricResultsPanel({ impact, wasteTypeId }: MetricResultsPanelProps) {
  const wt = getWasteType(wasteTypeId);

  // Progress rings normalised to max expected value per metric
  const energyProgress = Math.min(impact.energyKwh / 32000, 1); // max for 10k kg plastic
  const carbonProgress = Math.min(impact.carbonKg / 21000, 1);
  const landfillProgress = impact.landfillDiversionKg / 10000;
  const emissionProgress = Math.min(impact.emissionReductionG / 48_000_000, 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="h-1.5 w-6 rounded-full"
          style={{ backgroundColor: wt.color }}
        />
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          Potential Impact — Live Results
        </p>
      </div>

      <motion.div
        variants={staggerContainer(0.08, 0)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3"
      >
        <MetricCard
          icon={<Zap className="h-4 w-4" />}
          label="Energy Generated"
          value={formatEnergy(impact.energyKwh)}
          subValue={`≈ ${formatNumber(impact.householdsPowered)} homes/day`}
          color={wt.color}
          glowColor={wt.glowColor}
          progress={energyProgress}
          delay={0}
        />
        <MetricCard
          icon={<Leaf className="h-4 w-4" />}
          label="Carbon Reduction"
          value={formatCarbon(impact.carbonKg)}
          subValue={`≈ ${formatNumber(impact.treeEquivalent)} tree-years`}
          color="oklch(0.72 0.18 147)"
          glowColor="oklch(0.72 0.18 147 / 0.25)"
          progress={carbonProgress}
          delay={0.08}
        />
        <MetricCard
          icon={<Trash2 className="h-4 w-4" />}
          label="Landfill Diversion"
          value={`${formatNumber(impact.landfillDiversionKg, 0)} kg`}
          subValue={`${Math.round(getWasteType(wasteTypeId).diversionRate * 100)}% landfill diversion rate`}
          color="oklch(0.70 0.20 200)"
          glowColor="oklch(0.70 0.20 200 / 0.25)"
          progress={landfillProgress}
          delay={0.16}
        />
        <MetricCard
          icon={<Wind className="h-4 w-4" />}
          label="Emission Reduction"
          value={formatEmission(impact.emissionReductionG)}
          subValue="NOₓ equivalent reduced"
          color="oklch(0.68 0.22 320)"
          glowColor="oklch(0.68 0.22 320 / 0.25)"
          progress={emissionProgress}
          delay={0.24}
        />
      </motion.div>

      {/* Footnote */}
      <p className="text-[9px] text-muted-foreground/50 font-mono text-center pt-1">
        * Estimates based on IEA &amp; IPCC AR6 waste-to-energy lifecycle data
      </p>
    </div>
  );
}
