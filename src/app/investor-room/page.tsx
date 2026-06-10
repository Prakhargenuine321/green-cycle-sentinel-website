"use client";

import React, { useState, useEffect } from "react";
import { GridBackground } from "@/components/ui/grid-background";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowInput } from "@/components/ui/glow-input";
import { GlowButton } from "@/components/ui/glow-button";
import { Lock, FileText, Download, TrendingUp, DollarSign, PieChart as PieIcon, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { verifyInvestorPasscodeAction } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

// 1. Investor-specific Mock Data
const valuationData = [
  { stage: "Seed (2026)", valuation: 8.5 },
  { stage: "Series A (2027)", valuation: 25.0 },
  { stage: "Series B (2028)", valuation: 60.0 },
  { stage: "Series C (2029)", valuation: 120.0 },
];

const capexData = [
  { year: "2026", CAPEX: 2.1, EBITDA: -0.8 },
  { year: "2027", CAPEX: 4.5, EBITDA: 1.2 },
  { year: "2028", CAPEX: 7.2, EBITDA: 5.8 },
  { year: "2029", CAPEX: 12.0, EBITDA: 15.4 },
];

const capTableData = [
  { name: "Founders", value: 45, color: "#10b981" },     // primary green
  { name: "Seed Investors", value: 25, color: "#34d399" }, // light green
  { name: "Series A VCs", value: 18, color: "#6ee7b7" },   // pale green
  { name: "ESOP Option Pool", value: 12, color: "#059669" } // dark green
];

const pitchDeckSlides = [
  {
    title: "1. The Waste Problem",
    content: "Rapid urban density generates 2.1B+ metric tons of municipal solid refuse annually. High-methane organic piles decay and pollute waterways. Standard solutions (incineration) release extreme CO2 toxins into adjacent neighborhoods.",
  },
  {
    title: "2. The Sentinel Solution",
    content: "We engineer decentralized gasification reactors. By converting organic biomass at 1200°C without combustion, we synthesize clean syngas and biochar, creating green electricity and high-grade carbon sink outputs.",
  },
  {
    title: "3. Smart Grid Integration",
    content: "Every Sentinel reactor is coupled with an IoT edge node. Telemetry gathers real-time conversion rates, particulate metrics, and local grid feed-in rates, automating municipal billing and carbon credit certification.",
  },
  {
    title: "4. Business Model & Scale",
    content: "Dual-income stream: (A) Municipal collection tipping fees ($80/ton). (B) Power grid feedback feed-in tariffs ($0.12/kWh) + verified carbon abatement offsets ($40/credit). Projecting profitability per unit inside 18 months.",
  },
  {
    title: "5. Traction & Captable",
    content: "3 active Municipal pilots in Berlin and San Francisco. Generated $840k in trailing ARR. Backed by top clean-tech venture syndicates. Expanding deployment boundaries to 15 additional cities in 2027.",
  },
];

export default function InvestorRoomPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  // Check bypass cookie on mount
  useEffect(() => {
    const checkBypass = () => {
      const match = document.cookie.match(/(?:^|; )investor_bypass=([^;]*)/);
      if (match && match[1] === "true") {
        setIsUnlocked(true);
      }
    };
    checkBypass();
  }, []);

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError("");

    const res = await verifyInvestorPasscodeAction(passcode);
    if (res.success) {
      setIsUnlocked(true);
    } else {
      setPasscodeError(res.error || "Invalid decryption passcode. Security logged.");
    }
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % pitchDeckSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + pitchDeckSlides.length) % pitchDeckSlides.length);
  };

  // 1. Passcode Locked Interface
  if (!isUnlocked) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center py-16 px-4">
        <GridBackground showGlow={true} glowPosition="center" animateReveal={true} />

        <div className="w-full max-w-[400px] relative z-10">
          <GlassCard animateReveal={true} hoverEffect={false} className="border-border/15 p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-2">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <h1 className="font-heading text-xl font-bold text-foreground">
                Secure Investor Dataroom
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                Authorized partners require a decryption passcode to access sensitive financial logs and pitch decks.
              </p>
            </div>

            {passcodeError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-500 font-mono text-center">
                {passcodeError}
              </div>
            )}

            <form onSubmit={handleUnlockSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-muted-foreground/85 uppercase tracking-wider">
                  Decryption Passcode
                </label>
                <GlowInput
                  type="password"
                  required
                  placeholder="Enter passcode..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                />
              </div>

              <GlowButton type="submit" className="w-full gap-2 py-2.5">
                Decrypt Boardroom <Check className="h-4 w-4" />
              </GlowButton>
            </form>

            <div className="text-center text-[10px] text-muted-foreground/50 font-mono">
              IP ADDRESS: LOGGED // TLS 1.3 SECURED
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  // 2. Unlocked Boardroom Dashboard Interface
  return (
    <div className="relative min-h-screen py-16">
      <GridBackground showGlow={true} glowPosition="top" animateReveal={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 text-xs text-emerald-400 font-medium mb-2">
            <Lock className="h-3.5 w-3.5" />
            <span>Decrypted VC Boardroom Console</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Investor Relations <span className="text-gradient-green">&amp; Projections</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Real-time financial models, cap table allocations, and confidential pitch deck resources for Green Cycle Sentinel seed-round partners.
          </p>
        </div>

        {/* Projections Visual Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Valuation Growth */}
          <GlassCard animateReveal={false} hoverEffect={true} className="border-border/10 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-sm font-bold text-foreground">Valuation Target Trajectory</h2>
                <p className="text-[10px] text-muted-foreground mt-0.5">Projected valuation growth targets ($ USD Millions).</p>
              </div>

              <div className="h-44 w-full mt-4 font-mono text-[9px] -ml-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={valuationData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.72 0.18 147)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.72 0.18 147)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="stage" stroke="rgba(255,255,255,0.2)" tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(18,18,20,0.85)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        fontSize: "10px",
                        color: "#fff",
                      }}
                    />
                    <Area type="monotone" dataKey="valuation" stroke="oklch(0.72 0.18 147)" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>

          {/* CAPEX vs EBITDA */}
          <GlassCard animateReveal={false} hoverEffect={true} className="border-border/10 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-sm font-bold text-foreground">CAPEX vs EBITDA</h2>
                <p className="text-[10px] text-muted-foreground mt-0.5">Capital expenditure vs operating earnings model ($M).</p>
              </div>

              <div className="h-44 w-full mt-4 font-mono text-[9px] -ml-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={capexData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="year" stroke="rgba(255,255,255,0.2)" tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(18,18,20,0.85)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        fontSize: "10px",
                        color: "#fff",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "9px" }} />
                    <Bar dataKey="CAPEX" fill="rgba(255,255,255,0.15)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="EBITDA" fill="oklch(0.72 0.18 147)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>

          {/* Cap Table allocation */}
          <GlassCard animateReveal={false} hoverEffect={true} className="border-border/10 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <PieIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-sm font-bold text-foreground">Cap Table Equity Split</h2>
                <p className="text-[10px] text-muted-foreground mt-0.5">Distribution of shares pre-Series A round.</p>
              </div>

              <div className="h-44 w-full mt-4 font-mono text-[9px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={capTableData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {capTableData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(18,18,20,0.85)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        fontSize: "10px",
                        color: "#fff",
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Pitch Deck Slide Viewer & Files */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Pitch Deck (8 Cols) */}
          <GlassCard animateReveal={false} hoverEffect={false} className="lg:col-span-8 border-border/15 p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-border/5">
              <h3 className="font-heading text-base font-bold text-foreground">
                Sentinel Seed Pitch Slide Deck
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevSlide}
                  className="h-8 w-8 rounded-lg bg-background/50 border border-border flex items-center justify-center hover:border-primary/50 text-foreground transition-all duration-300 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {activeSlide + 1} / {pitchDeckSlides.length}
                </span>
                <button
                  onClick={nextSlide}
                  className="h-8 w-8 rounded-lg bg-background/50 border border-border flex items-center justify-center hover:border-primary/50 text-foreground transition-all duration-300 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Slide Content Box */}
            <div className="min-h-56 flex flex-col justify-center bg-background/15 border border-border/5 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-28 w-28 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  <h4 className="font-heading text-lg font-bold text-primary">
                    {pitchDeckSlides[activeSlide].title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pitchDeckSlides[activeSlide].content}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </GlassCard>

          {/* Confidential Documents (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard animateReveal={false} hoverEffect={false} className="border-border/10 p-6 space-y-4">
              <h3 className="font-heading text-sm font-bold text-foreground flex items-center space-x-2">
                <FileText className="h-4.5 w-4.5 text-primary" />
                <span>Confidential Vault</span>
              </h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Download verified audit logs, cap table models, and gasification specifications.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { name: "pitch_deck_gcs_q2.pdf", size: "4.2 MB" },
                  { name: "cap_table_shares_2026.xlsx", size: "1.8 MB" },
                  { name: "reactor_specs_v4.pdf", size: "8.4 MB" },
                ].map((doc) => (
                  <div
                    key={doc.name}
                    className="flex justify-between items-center p-3 rounded-lg border border-border bg-background/50 text-[10px] font-mono text-muted-foreground hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <div className="text-foreground font-semibold truncate font-sans">{doc.name}</div>
                      <div>{doc.size} — SECURE DOWNLOAD</div>
                    </div>
                    <a
                      href={`/docs/${doc.name}`}
                      download
                      className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 text-primary transition-all duration-300"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
