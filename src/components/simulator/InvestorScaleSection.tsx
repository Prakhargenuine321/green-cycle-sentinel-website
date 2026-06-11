"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Zap, Leaf, Building2 } from "lucide-react";
import {
  INVESTOR_SCALE_TIERS,
  WasteTypeId,
  getWasteType,
  computeImpact,
  formatEnergy,
  formatCarbon,
  formatNumber,
} from "@/lib/simulator-data";
import { staggerContainer, staggerChildFadeInUp } from "@/animations";

interface InvestorScaleSectionProps {
  wasteTypeId: WasteTypeId;
}

export function InvestorScaleSection({ wasteTypeId }: InvestorScaleSectionProps) {
  const wt = getWasteType(wasteTypeId);

  return (
    <section className="space-y-6" aria-labelledby="investor-scale-heading">
      {/* Section header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs text-primary font-medium">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Investor Mode — At-Scale Projections</span>
        </div>
        <h2
          id="investor-scale-heading"
          className="font-heading text-2xl sm:text-3xl font-bold text-foreground"
        >
          What This Means{" "}
          <span className="text-gradient-green">At Scale</span>
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Green Cycle Sentinel nodes operate at municipal scale. Here&apos;s the potential
          impact when our {wt.label.toLowerCase()} gasification process is deployed across
          entire city districts.
        </p>
      </div>

      {/* Scale tier cards */}
      <motion.div
        variants={staggerContainer(0.1, 0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {INVESTOR_SCALE_TIERS.map((tier, idx) => {
          const impact = computeImpact(wasteTypeId, tier.quantityKg);
          const isHighlight = idx === 1;

          return (
            <motion.div
              key={tier.label}
              variants={staggerChildFadeInUp}
              className="relative flex flex-col gap-4 p-5 rounded-2xl border overflow-hidden"
              style={{
                borderColor: isHighlight ? `${wt.color}50` : "oklch(from var(--border) l c h / 0.15)",
                background: isHighlight
                  ? `linear-gradient(135deg, ${wt.color}10 0%, transparent 60%)`
                  : "oklch(from var(--card) l c h / 0.4)",
                boxShadow: isHighlight ? `0 0 32px ${wt.glowColor}` : undefined,
              }}
            >
              {isHighlight && (
                <div
                  className="absolute top-3 right-3 text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border"
                  style={{
                    color: wt.color,
                    borderColor: `${wt.color}40`,
                    backgroundColor: `${wt.color}14`,
                  }}
                >
                  FEATURED
                </div>
              )}

              {/* Tier header */}
              <div>
                <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
                  {tier.subtitle}
                </p>
                <p className="font-heading text-xl font-black text-foreground mt-0.5">
                  {tier.label}
                </p>
                <p
                  className="text-2xl font-heading font-black mt-1"
                  style={{ color: wt.color }}
                >
                  {tier.quantityKg >= 1000
                    ? `${tier.quantityKg / 1000}t`
                    : `${tier.quantityKg}kg`}{" "}
                  <span className="text-sm text-muted-foreground font-normal">waste</span>
                </p>
              </div>

              {/* Impact metrics */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded-lg flex items-center justify-center border shrink-0"
                    style={{
                      backgroundColor: `${wt.color}14`,
                      borderColor: `${wt.color}28`,
                    }}
                  >
                    <Zap className="h-3 w-3" style={{ color: wt.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground font-heading">
                      {formatEnergy(impact.energyKwh)}
                    </p>
                    <p className="text-[9px] text-muted-foreground font-mono">energy generated</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded-lg flex items-center justify-center border shrink-0"
                    style={{
                      backgroundColor: "oklch(0.72 0.18 147 / 0.12)",
                      borderColor: "oklch(0.72 0.18 147 / 0.25)",
                    }}
                  >
                    <Leaf className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground font-heading">
                      {formatCarbon(impact.carbonKg)}
                    </p>
                    <p className="text-[9px] text-muted-foreground font-mono">CO₂ avoided</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded-lg flex items-center justify-center border shrink-0"
                    style={{
                      backgroundColor: "oklch(0.70 0.20 200 / 0.12)",
                      borderColor: "oklch(0.70 0.20 200 / 0.25)",
                    }}
                  >
                    <Building2 className="h-3 w-3" style={{ color: "oklch(0.70 0.20 200)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground font-heading">
                      {formatNumber(impact.householdsPowered)} homes
                    </p>
                    <p className="text-[9px] text-muted-foreground font-mono">powered for a day</p>
                  </div>
                </div>
              </div>

              {/* Bottom analogy */}
              <div
                className="pt-3 border-t text-[10px] text-muted-foreground font-mono"
                style={{ borderColor: "oklch(from var(--border) l c h / 0.1)" }}
              >
                💡 {tier.analogy}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Call-to-action footnote */}
      <p className="text-center text-xs text-muted-foreground/60 font-mono">
        Projections based on {wt.label} gasification at {wt.processTempC}°C · {Math.round(wt.diversionRate * 100)}% landfill diversion
      </p>
    </section>
  );
}
