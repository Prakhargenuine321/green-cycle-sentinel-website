"use client";

import React, { useReducer, useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Share2, Zap } from "lucide-react";
import { WasteTypeId, computeImpact } from "@/lib/simulator-data";
import { WasteTypeSelector } from "./WasteTypeSelector";
import { QuantitySlider } from "./QuantitySlider";
import { MetricResultsPanel } from "./MetricResultsPanel";
import { TransformationFlow } from "./TransformationFlow";
import { EnergyMeter } from "./EnergyMeter";
import { AchievementBadges } from "./AchievementBadges";
import { InvestorScaleSection } from "./InvestorScaleSection";
import { ShareCard } from "./ShareCard";
import { GlowButton } from "@/components/ui/glow-button";
import { staggerContainer, staggerChildFadeInUp } from "@/animations";

// ── State ──────────────────────────────────────────────────────────────────

interface SimulatorState {
  wasteTypeId: WasteTypeId;
  quantityKg: number;
}

type SimulatorAction =
  | { type: "SET_WASTE_TYPE"; payload: WasteTypeId }
  | { type: "SET_QUANTITY"; payload: number };

function simulatorReducer(state: SimulatorState, action: SimulatorAction): SimulatorState {
  switch (action.type) {
    case "SET_WASTE_TYPE":
      return { ...state, wasteTypeId: action.payload };
    case "SET_QUANTITY":
      return { ...state, quantityKg: action.payload };
    default:
      return state;
  }
}

// ── Component ─────────────────────────────────────────────────────────────

export function WasteToEnergySimulator() {
  const [state, dispatch] = useReducer(simulatorReducer, {
    wasteTypeId: "plastic",
    quantityKg: 500,
  });
  const [shareOpen, setShareOpen] = useState(false);

  const handleWasteTypeChange = useCallback((id: WasteTypeId) => {
    dispatch({ type: "SET_WASTE_TYPE", payload: id });
  }, []);

  const handleQuantityChange = useCallback((kg: number) => {
    dispatch({ type: "SET_QUANTITY", payload: kg });
  }, []);

  // Memoised impact computation — only recalculates when type or quantity changes
  const impact = useMemo(
    () => computeImpact(state.wasteTypeId, state.quantityKg),
    [state.wasteTypeId, state.quantityKg]
  );

  return (
    <>
      {/* ── Hero section header ─────────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer(0.1, 0.1)}
        initial="hidden"
        animate="visible"
        className="text-center space-y-4 mb-12"
      >
        <motion.div
          variants={staggerChildFadeInUp}
          className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs text-primary font-medium"
        >
          <Zap className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span>Interactive Waste-to-Energy Simulator</span>
        </motion.div>

        <motion.h1
          variants={staggerChildFadeInUp}
          className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
        >
          Visualize Your{" "}
          <span className="text-gradient-green">Environmental Impact</span>
        </motion.h1>

        <motion.p
          variants={staggerChildFadeInUp}
          className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Select a waste type, adjust the quantity, and watch your potential energy generation
          and carbon impact come to life in real time.
        </motion.p>
      </motion.div>

      {/* ── Main simulator layout ───────────────────────────────────────── */}
      <div className="space-y-8">

        {/* Step 1: Waste Type Selection */}
        <motion.section
          variants={staggerChildFadeInUp}
          initial="hidden"
          animate="visible"
          className="glass-card rounded-3xl p-6 sm:p-8 space-y-5"
          aria-labelledby="step-1-heading"
        >
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-xs font-bold text-primary font-mono">
              1
            </div>
            <h2
              id="step-1-heading"
              className="font-heading text-base font-semibold text-foreground"
            >
              Select Waste Type
            </h2>
          </div>
          <WasteTypeSelector
            selected={state.wasteTypeId}
            onChange={handleWasteTypeChange}
          />
        </motion.section>

        {/* Step 2: Quantity Slider */}
        <motion.section
          variants={staggerChildFadeInUp}
          initial="hidden"
          animate="visible"
          className="glass-card rounded-3xl p-6 sm:p-8 space-y-5"
          aria-labelledby="step-2-heading"
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-xs font-bold text-primary font-mono">
              2
            </div>
            <h2
              id="step-2-heading"
              className="font-heading text-base font-semibold text-foreground"
            >
              Adjust Waste Quantity
            </h2>
          </div>
          <QuantitySlider
            wasteTypeId={state.wasteTypeId}
            value={state.quantityKg}
            onChange={handleQuantityChange}
          />
        </motion.section>

        {/* Step 3: Live Results */}
        <motion.section
          variants={staggerChildFadeInUp}
          initial="hidden"
          animate="visible"
          className="glass-card rounded-3xl p-6 sm:p-8 space-y-6"
          aria-labelledby="step-3-heading"
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-xs font-bold text-primary font-mono">
              3
            </div>
            <h2
              id="step-3-heading"
              className="font-heading text-base font-semibold text-foreground"
            >
              Live Impact Results
            </h2>
          </div>

          {/* Results layout: flow + metrics side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1.6fr] gap-6 items-start">
            {/* Left: Transformation flow */}
            <TransformationFlow impact={impact} wasteTypeId={state.wasteTypeId} />

            {/* Center: Energy meter */}
            <div className="hidden lg:flex justify-center">
              <EnergyMeter impact={impact} wasteTypeId={state.wasteTypeId} />
            </div>

            {/* Right: Metric cards */}
            <MetricResultsPanel impact={impact} wasteTypeId={state.wasteTypeId} />

            {/* Mobile energy meter */}
            <div className="lg:hidden flex justify-center">
              <EnergyMeter impact={impact} wasteTypeId={state.wasteTypeId} />
            </div>
          </div>
        </motion.section>

        {/* Achievements */}
        <motion.section
          variants={staggerChildFadeInUp}
          initial="hidden"
          animate="visible"
          className="glass-card rounded-3xl p-6 sm:p-8"
          aria-labelledby="achievements-heading"
          transition={{ delay: 0.3 }}
        >
          <h2
            id="achievements-heading"
            className="sr-only"
          >
            Achievement Badges
          </h2>
          <AchievementBadges quantityKg={state.quantityKg} />
        </motion.section>

        {/* Share CTA */}
        <motion.div
          variants={staggerChildFadeInUp}
          initial="hidden"
          animate="visible"
          className="flex justify-center"
          transition={{ delay: 0.4 }}
        >
          <GlowButton
            onClick={() => setShareOpen(true)}
            size="lg"
            className="gap-2"
            aria-label="Open impact sharing card"
          >
            <Share2 className="h-4 w-4" />
            Generate Impact Card
          </GlowButton>
        </motion.div>
      </div>

      {/* ── Investor Scale Section ──────────────────────────────────────── */}
      <div className="mt-24 pt-16 border-t border-border/10">
        <InvestorScaleSection wasteTypeId={state.wasteTypeId} />
      </div>

      {/* ── Share Modal ─────────────────────────────────────────────────── */}
      <ShareCard
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        wasteTypeId={state.wasteTypeId}
        quantityKg={state.quantityKg}
        impact={impact}
      />
    </>
  );
}
