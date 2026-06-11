/**
 * Green Cycle Sentinel — Waste-to-Energy Impact Simulator
 * Data layer: conversion factors, computation engine, gamification thresholds.
 *
 * Energy & emissions factors are scientifically-grounded estimates based on
 * peer-reviewed WtE lifecycle analysis literature (IEA, IPCC AR6, UNEP).
 */

// ─── Waste Type Definitions ────────────────────────────────────────────────

export type WasteTypeId =
  | "plastic"
  | "organic"
  | "agricultural"
  | "paper"
  | "textile"
  | "mixed";

export interface WasteType {
  id: WasteTypeId;
  label: string;
  description: string;
  icon: string; // emoji icon
  color: string; // CSS oklch color for accent
  glowColor: string; // CSS color for box-shadow glow
  /** kWh of electricity generated per kg of waste */
  energyFactor: number;
  /** kg CO₂-equivalent avoided per kg of waste (vs landfill) */
  carbonFactor: number;
  /** fraction of waste diverted from landfill (0–1) */
  diversionRate: number;
  /** g of NOₓ-equivalent emissions reduced per kg */
  emissionFactor: number;
  /** Gasification temp label for tech detail */
  processTempC: number;
}

export const WASTE_TYPES: WasteType[] = [
  {
    id: "plastic",
    label: "Plastic",
    description: "High calorific value synthetic polymers",
    icon: "♻️",
    color: "oklch(0.70 0.20 200)",
    glowColor: "oklch(0.70 0.20 200 / 0.25)",
    energyFactor: 3.2,
    carbonFactor: 2.1,
    diversionRate: 0.95,
    emissionFactor: 4.8,
    processTempC: 1200,
  },
  {
    id: "organic",
    label: "Organic Waste",
    description: "Food scraps, kitchen waste & biodegradables",
    icon: "🥦",
    color: "oklch(0.72 0.18 147)",
    glowColor: "oklch(0.72 0.18 147 / 0.25)",
    energyFactor: 0.4,
    carbonFactor: 0.6,
    diversionRate: 0.85,
    emissionFactor: 1.2,
    processTempC: 850,
  },
  {
    id: "agricultural",
    label: "Agricultural Waste",
    description: "Crop residues, husks & biomass by-products",
    icon: "🌾",
    color: "oklch(0.75 0.16 85)",
    glowColor: "oklch(0.75 0.16 85 / 0.25)",
    energyFactor: 0.9,
    carbonFactor: 1.1,
    diversionRate: 0.9,
    emissionFactor: 2.0,
    processTempC: 950,
  },
  {
    id: "paper",
    label: "Paper",
    description: "Paper, cardboard & cellulose-based packaging",
    icon: "📄",
    color: "oklch(0.78 0.12 60)",
    glowColor: "oklch(0.78 0.12 60 / 0.25)",
    energyFactor: 1.8,
    carbonFactor: 1.4,
    diversionRate: 0.88,
    emissionFactor: 2.8,
    processTempC: 1000,
  },
  {
    id: "textile",
    label: "Textile Waste",
    description: "Discarded clothing, fabric & synthetic fibres",
    icon: "👕",
    color: "oklch(0.68 0.22 320)",
    glowColor: "oklch(0.68 0.22 320 / 0.25)",
    energyFactor: 2.5,
    carbonFactor: 1.9,
    diversionRate: 0.8,
    emissionFactor: 3.9,
    processTempC: 1100,
  },
  {
    id: "mixed",
    label: "Mixed Waste",
    description: "General municipal solid waste blend",
    icon: "🗑️",
    color: "oklch(0.65 0.15 250)",
    glowColor: "oklch(0.65 0.15 250 / 0.25)",
    energyFactor: 1.6,
    carbonFactor: 1.2,
    diversionRate: 0.82,
    emissionFactor: 2.6,
    processTempC: 1050,
  },
];

export function getWasteType(id: WasteTypeId): WasteType {
  return WASTE_TYPES.find((w) => w.id === id)!;
}

// ─── Impact Computation ────────────────────────────────────────────────────

export interface ImpactResult {
  /** kWh of electricity potentially generated */
  energyKwh: number;
  /** kg of CO₂-equivalent potentially avoided */
  carbonKg: number;
  /** kg of waste potentially kept out of landfill */
  landfillDiversionKg: number;
  /** g of NOₓ-equivalent emissions potentially reduced */
  emissionReductionG: number;
  /** Households powered for a day equivalent */
  householdsPowered: number;
  /** Trees equivalent in CO₂ absorption */
  treeEquivalent: number;
  /** 0-1 gauge intensity for visualizations */
  intensity: number;
}

/**
 * Computes potential environmental impact from waste conversion.
 * All results are prefixed "potential" / estimates for educational purposes.
 */
export function computeImpact(
  wasteTypeId: WasteTypeId,
  quantityKg: number
): ImpactResult {
  const wt = getWasteType(wasteTypeId);

  const energyKwh = wt.energyFactor * quantityKg;
  const carbonKg = wt.carbonFactor * quantityKg;
  const landfillDiversionKg = wt.diversionRate * quantityKg;
  const emissionReductionG = wt.emissionFactor * quantityKg * 1000; // g
  // ~1.2 kWh per household per day (global avg)
  const householdsPowered = Math.round(energyKwh / 1.2);
  // A mature tree absorbs ~21 kg CO₂/year
  const treeEquivalent = Math.round(carbonKg / 21);
  // Intensity: logarithmic 0–1 scale across 1–10,000 kg
  const intensity = Math.min(Math.log10(quantityKg) / Math.log10(10000), 1);

  return {
    energyKwh,
    carbonKg,
    landfillDiversionKg,
    emissionReductionG,
    householdsPowered,
    treeEquivalent,
    intensity,
  };
}

// ─── Gamification: Achievement Badges ─────────────────────────────────────

export interface Badge {
  id: string;
  label: string;
  emoji: string;
  description: string;
  thresholdKg: number;
  color: string;
}

export const BADGES: Badge[] = [
  {
    id: "eco-starter",
    label: "Eco Starter",
    emoji: "🌱",
    description: "You've begun your sustainability journey!",
    thresholdKg: 100,
    color: "oklch(0.72 0.18 147)",
  },
  {
    id: "community-cleaner",
    label: "Community Cleaner",
    emoji: "🏘️",
    description: "Enough to power a neighbourhood block.",
    thresholdKg: 500,
    color: "oklch(0.70 0.20 200)",
  },
  {
    id: "energy-creator",
    label: "Energy Creator",
    emoji: "⚡",
    description: "You're generating serious clean electricity!",
    thresholdKg: 1000,
    color: "oklch(0.78 0.12 60)",
  },
  {
    id: "eco-innovator",
    label: "Eco Innovator",
    emoji: "🌿",
    description: "Industrial-scale impact — impressive!",
    thresholdKg: 3000,
    color: "oklch(0.68 0.22 320)",
  },
  {
    id: "future-leader",
    label: "Future Sustainability Leader",
    emoji: "🌍",
    description: "This level powers entire communities.",
    thresholdKg: 7500,
    color: "oklch(0.65 0.15 250)",
  },
];

export function getUnlockedBadges(quantityKg: number): Badge[] {
  return BADGES.filter((b) => quantityKg >= b.thresholdKg);
}

// ─── Investor Scale Data ───────────────────────────────────────────────────

export interface ScaleTier {
  label: string;
  quantityKg: number;
  subtitle: string;
  analogy: string;
}

export const INVESTOR_SCALE_TIERS: ScaleTier[] = [
  {
    label: "Community",
    quantityKg: 100,
    subtitle: "Neighbourhood Scale",
    analogy: "Powers ~50 homes for a day",
  },
  {
    label: "City Block",
    quantityKg: 1000,
    subtitle: "Municipal Zone Scale",
    analogy: "Powers ~500 homes for a day",
  },
  {
    label: "District",
    quantityKg: 10000,
    subtitle: "Industrial Scale",
    analogy: "Powers ~5,000 homes for a day",
  },
];

// ─── Formatting Helpers ───────────────────────────────────────────────────

export function formatEnergy(kwh: number): string {
  if (kwh >= 1_000_000) return `${(kwh / 1_000_000).toFixed(2)} GWh`;
  if (kwh >= 1_000) return `${(kwh / 1_000).toFixed(1)} MWh`;
  return `${kwh.toFixed(1)} kWh`;
}

export function formatCarbon(kg: number): string {
  if (kg >= 1_000) return `${(kg / 1_000).toFixed(2)} tonnes`;
  return `${kg.toFixed(1)} kg`;
}

export function formatEmission(grams: number): string {
  if (grams >= 1_000_000) return `${(grams / 1_000_000).toFixed(2)} tonnes`;
  if (grams >= 1_000) return `${(grams / 1_000).toFixed(1)} kg`;
  return `${grams.toFixed(0)} g`;
}

export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
