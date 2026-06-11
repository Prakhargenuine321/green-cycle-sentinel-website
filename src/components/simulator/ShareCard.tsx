"use client";

import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Copy, Check, Download, ImageIcon } from "lucide-react";
import {
  WasteTypeId,
  ImpactResult,
  getWasteType,
  formatEnergy,
  formatCarbon,
  formatNumber,
} from "@/lib/simulator-data";
import { GlowButton } from "@/components/ui/glow-button";

interface ShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  wasteTypeId: WasteTypeId;
  quantityKg: number;
  impact: ImpactResult;
}

// ── Canvas image colours (mapped from site oklch tokens) ──────────────────
// Using fixed hex values so canvas can render them correctly
const CANVAS = {
  bgTop: "#0c1410",
  bgBottom: "#111d13",
  border: "#1e3d22",
  green: "#3dd87a",    // primary oklch(0.72 0.18 147)
  greenDim: "#1e4a2a",
  greenGlow: "rgba(61,216,122,0.18)",
  white: "#f0faf0",
  muted: "#7dab8a",
  cardBg: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(255,255,255,0.07)",
} as const;

/**
 * Draws a rounded rectangle path.
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Generates a 1200×630 PNG impact card using the Canvas 2D API.
 * Returns a data URL.
 */
function generateImpactCanvas(
  wasteTypeId: WasteTypeId,
  quantityKg: number,
  impact: ImpactResult
): string {
  const W = 1200;
  const H = 630;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // ── Background gradient ────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, CANVAS.bgTop);
  bg.addColorStop(1, CANVAS.bgBottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid pattern
  ctx.strokeStyle = "rgba(61,216,122,0.04)";
  ctx.lineWidth = 1;
  const grid = 60;
  for (let x = 0; x <= W; x += grid) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += grid) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // ── Radial glow (top-left corner) ─────────────────────────────────────
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 500);
  glow.addColorStop(0, "rgba(61,216,122,0.10)");
  glow.addColorStop(1, "rgba(61,216,122,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ── Border ────────────────────────────────────────────────────────────
  ctx.strokeStyle = CANVAS.border;
  ctx.lineWidth = 2;
  roundRect(ctx, 1, 1, W - 2, H - 2, 32);
  ctx.stroke();

  // Inner green accent top bar
  const topBar = ctx.createLinearGradient(0, 0, W, 0);
  topBar.addColorStop(0, CANVAS.green);
  topBar.addColorStop(0.5, "rgba(61,216,122,0.4)");
  topBar.addColorStop(1, "rgba(61,216,122,0)");
  ctx.fillStyle = topBar;
  ctx.fillRect(32, 0, W - 64, 3);

  // ── LEFT COLUMN ───────────────────────────────────────────────────────
  const leftX = 64;
  let y = 72;

  // Brand badge
  ctx.fillStyle = CANVAS.greenDim;
  roundRect(ctx, leftX, y, 230, 32, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(61,216,122,0.3)";
  ctx.lineWidth = 1;
  roundRect(ctx, leftX, y, 230, 32, 16);
  ctx.stroke();

  ctx.fillStyle = CANVAS.green;
  ctx.font = "bold 11px 'Inter', system-ui, sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText("GREEN CYCLE SENTINEL", leftX + 16, y + 21);
  ctx.letterSpacing = "0px";

  y += 56;

  // Headline
  ctx.fillStyle = CANVAS.white;
  ctx.font = "bold 28px 'Inter', system-ui, sans-serif";
  ctx.fillText("I simulated converting", leftX, y);
  y += 44;

  // Quantity + waste type (accented)
  const wt = getWasteType(wasteTypeId);
  const qtyLabel =
    quantityKg >= 1000
      ? `${(quantityKg / 1000).toFixed(1)} tonnes`
      : `${quantityKg.toLocaleString()}kg`;

  ctx.fillStyle = CANVAS.green;
  ctx.font = "bold 48px 'Inter', system-ui, sans-serif";
  ctx.fillText(`${qtyLabel} of`, leftX, y);
  y += 60;
  ctx.fillText(`${wt.label.toLowerCase()}`, leftX, y);
  y += 52;

  ctx.fillStyle = CANVAS.white;
  ctx.font = "bold 28px 'Inter', system-ui, sans-serif";
  ctx.fillText("into clean energy ✨", leftX, y);
  y += 56;

  // Sub text
  ctx.fillStyle = CANVAS.muted;
  ctx.font = "15px 'Inter', system-ui, sans-serif";
  ctx.fillText("Simulated with the Waste-to-Energy Impact Simulator", leftX, y);
  y += 24;
  ctx.fillStyle = CANVAS.green;
  ctx.font = "13px 'Inter', system-ui, sans-serif";
  ctx.fillText("greencyclesentinel.com/simulator", leftX, y);

  // Waste type icon pill
  y += 48;
  ctx.fillStyle = CANVAS.greenDim;
  roundRect(ctx, leftX, y, 80, 80, 20);
  ctx.fill();
  ctx.strokeStyle = "rgba(61,216,122,0.3)";
  ctx.lineWidth = 1;
  roundRect(ctx, leftX, y, 80, 80, 20);
  ctx.stroke();

  ctx.font = "40px serif";
  ctx.fillText(wt.icon, leftX + 18, y + 56);

  // ── RIGHT COLUMN — metric cards ────────────────────────────────────────
  const rightX = 640;
  const cardW = 240;
  const cardH = 130;
  const cardGap = 20;

  const metrics = [
    { emoji: "⚡", label: "Energy Generated",   value: formatEnergy(impact.energyKwh) },
    { emoji: "🌍", label: "CO₂ Avoided",         value: formatCarbon(impact.carbonKg) },
    { emoji: "🏠", label: "Homes Powered / Day", value: `${formatNumber(impact.householdsPowered)} homes` },
    { emoji: "🌳", label: "Tree Equivalent",     value: `${formatNumber(impact.treeEquivalent)} yrs` },
  ];

  metrics.forEach((m, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = rightX + col * (cardW + cardGap);
    const cy = 64 + row * (cardH + cardGap);

    // Card bg
    ctx.fillStyle = CANVAS.cardBg;
    roundRect(ctx, cx, cy, cardW, cardH, 18);
    ctx.fill();

    // Card border
    ctx.strokeStyle = CANVAS.cardBorder;
    ctx.lineWidth = 1;
    roundRect(ctx, cx, cy, cardW, cardH, 18);
    ctx.stroke();

    // Green left accent
    ctx.fillStyle = CANVAS.green;
    roundRect(ctx, cx, cy + 20, 3, cardH - 40, 2);
    ctx.fill();

    // Emoji
    ctx.font = "26px serif";
    ctx.fillText(m.emoji, cx + 20, cy + 44);

    // Value
    ctx.fillStyle = CANVAS.green;
    ctx.font = "bold 22px 'Inter', system-ui, sans-serif";
    ctx.fillText(m.value, cx + 20, cy + 78);

    // Label
    ctx.fillStyle = CANVAS.muted;
    ctx.font = "11px 'Inter', system-ui, sans-serif";
    ctx.fillText(m.label.toUpperCase(), cx + 20, cy + 102);
  });

  // ── Vertical divider ──────────────────────────────────────────────────
  const divGrad = ctx.createLinearGradient(620, 0, 620, H);
  divGrad.addColorStop(0, "rgba(61,216,122,0)");
  divGrad.addColorStop(0.4, "rgba(61,216,122,0.15)");
  divGrad.addColorStop(0.6, "rgba(61,216,122,0.15)");
  divGrad.addColorStop(1, "rgba(61,216,122,0)");
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(620, 40);
  ctx.lineTo(620, H - 40);
  ctx.stroke();

  // ── Bottom bar ─────────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, H - 56, W, 56);

  ctx.fillStyle = CANVAS.muted;
  ctx.font = "12px 'Inter', system-ui, sans-serif";
  ctx.fillText(
    "Based on IEA & IPCC AR6 waste-to-energy lifecycle data  ·  All values are potential estimates",
    leftX,
    H - 20
  );

  ctx.fillStyle = CANVAS.green;
  ctx.font = "bold 12px 'Inter', system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("#GreenCycleSentinel  #WasteToEnergy  #CleanEnergy", W - leftX, H - 20);
  ctx.textAlign = "left";

  return canvas.toDataURL("image/png");
}

// ── Component ──────────────────────────────────────────────────────────────

export function ShareCard({ isOpen, onClose, wasteTypeId, quantityKg, impact }: ShareCardProps) {
  const wt = getWasteType(wasteTypeId);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const shareText = `I just simulated converting ${
    quantityKg >= 1000
      ? `${(quantityKg / 1000).toFixed(1)} tonnes`
      : `${quantityKg.toLocaleString()}kg`
  } of ${wt.label.toLowerCase()} into ${formatEnergy(impact.energyKwh)} of clean energy using Green Cycle Sentinel's Waste-to-Energy Simulator.

⚡ Energy: ${formatEnergy(impact.energyKwh)}
🌍 CO₂ Avoided: ${formatCarbon(impact.carbonKg)}
🏠 Homes Powered: ${formatNumber(impact.householdsPowered)}
🌳 Tree Equivalent: ${formatNumber(impact.treeEquivalent)} tree-years

See the impact yourself → https://greencyclesentinel.com/simulator

#GreenCycleSentinel #WasteToEnergy #CircularEconomy #CleanEnergy`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // silent
    }
  }, [shareText]);

  const handleDownloadImage = useCallback(() => {
    setDownloading(true);
    // rAF ensures the UI updates (spinner) before the canvas blocks the thread
    requestAnimationFrame(() => {
      try {
        const dataUrl = generateImpactCanvas(wasteTypeId, quantityKg, impact);
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `gcs-impact-${wasteTypeId}-${quantityKg}kg.png`;
        a.click();
      } finally {
        setDownloading(false);
      }
    });
  }, [wasteTypeId, quantityKg, impact]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-full sm:max-w-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-card-title"
          >
            {/* Card preview */}
            <div
              className="relative rounded-3xl overflow-hidden border border-primary/30 p-6 space-y-5 shadow-2xl"
              style={{
                background: `linear-gradient(135deg, oklch(0.12 0.012 160) 0%, oklch(0.16 0.02 160) 100%)`,
                boxShadow: `0 0 60px ${wt.glowColor}, 0 40px 80px oklch(0 0 0 / 0.5)`,
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 h-8 w-8 rounded-full border border-border/20 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border/40 transition-all cursor-pointer"
                aria-label="Close share card"
              >
                <X className="h-4 w-4" />
              </button>

              {/* GCS brand header */}
              <div className="flex items-center gap-2">
                <div
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-sm border"
                  style={{
                    backgroundColor: `${wt.color}18`,
                    borderColor: `${wt.color}40`,
                  }}
                >
                  ♻️
                </div>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Green Cycle Sentinel
                </span>
              </div>

              <h2
                id="share-card-title"
                className="font-heading text-lg font-bold text-foreground leading-tight"
              >
                I simulated converting{" "}
                <span style={{ color: wt.color }}>
                  {quantityKg >= 1000
                    ? `${(quantityKg / 1000).toFixed(1)}t`
                    : `${quantityKg.toLocaleString()}kg`}{" "}
                  of {wt.label.toLowerCase()}
                </span>{" "}
                into clean energy.
              </h2>

              {/* Impact metrics grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { emoji: "⚡", label: "Energy", value: formatEnergy(impact.energyKwh) },
                  { emoji: "🌍", label: "CO₂ Avoided", value: formatCarbon(impact.carbonKg) },
                  { emoji: "🏠", label: "Homes/day", value: formatNumber(impact.householdsPowered) },
                  { emoji: "🌳", label: "Tree-years", value: formatNumber(impact.treeEquivalent) },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="p-3 rounded-xl border border-border/15 bg-card/30"
                  >
                    <p className="text-lg leading-none">{metric.emoji}</p>
                    <p
                      className="font-heading text-base font-black mt-1.5"
                      style={{ color: wt.color }}
                    >
                      {metric.value}
                    </p>
                    <p className="text-[9px] font-mono text-muted-foreground mt-0.5">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* URL */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/20 border border-border/10">
                <Share2 className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-[10px] font-mono text-muted-foreground truncate">
                  greencyclesentinel.com/simulator
                </span>
              </div>

              {/* Image download hint */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/15">
                <ImageIcon className="h-3 w-3 text-primary shrink-0" />
                <span className="text-[10px] font-mono text-muted-foreground">
                  Downloads a <span className="text-primary font-semibold">1200×630 PNG</span> ready for Twitter, LinkedIn & Instagram
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <GlowButton
                  onClick={handleCopy}
                  className="flex-1 gap-2 text-xs"
                  aria-label="Copy impact text to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Text
                    </>
                  )}
                </GlowButton>
                <GlowButton
                  variant="outline"
                  onClick={handleDownloadImage}
                  disabled={downloading}
                  className="gap-2 text-xs text-foreground border-border hover:bg-muted/50 min-w-[120px] justify-center"
                  aria-label="Download impact card as PNG image"
                >
                  {downloading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full"
                      />
                      Rendering…
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      Download PNG
                    </>
                  )}
                </GlowButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
