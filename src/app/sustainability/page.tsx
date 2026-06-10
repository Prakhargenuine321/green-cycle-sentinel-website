"use client";

import React, { useState, useEffect } from "react";
import { GridBackground } from "@/components/ui/grid-background";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { Globe, Leaf, BarChart2, ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerChildFadeInUp } from "@/animations";
import { getTelemetryLogsAction, updateTelemetryLogsAction } from "@/app/actions";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

// 1. Initial Mock Datasets
const initialCarbonData = [
  { month: "Jan", offset: 1200 },
  { month: "Feb", offset: 1900 },
  { month: "Mar", offset: 3200 },
  { month: "Apr", offset: 4800 },
  { month: "May", offset: 6100 },
  { month: "Jun", offset: 8409 },
];

const initialAirData = [
  { day: "Mon", aqi: 72 },
  { day: "Tue", aqi: 68 },
  { day: "Wed", aqi: 85 },
  { day: "Thu", aqi: 50 },
  { day: "Fri", aqi: 45 },
  { day: "Sat", aqi: 30 },
  { day: "Sun", aqi: 28 },
];

const initialEnergyData = [
  { week: "Wk 1", yield: 1.2 },
  { week: "Wk 2", yield: 2.5 },
  { week: "Wk 3", yield: 4.1 },
  { week: "Wk 4", yield: 5.8 },
  { week: "Wk 5", yield: 7.2 },
  { week: "Wk 6", yield: 8.4 },
];

export default function SustainabilityPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [carbonData, setCarbonData] = useState(initialCarbonData);
  const [airData, setAirData] = useState(initialAirData);
  const [energyData, setEnergyData] = useState(initialEnergyData);

  // Load initial database metrics on mount
  useEffect(() => {
    const loadInitialData = async () => {
      const res = await getTelemetryLogsAction();
      if (res.success) {
        if (res.carbon) setCarbonData(res.carbon);
        if (res.air) setAirData(res.air);
        if (res.energy) setEnergyData(res.energy);
      }
    };
    loadInitialData();
  }, []);

  // Live Simulation Engine (Syncs changes to DB)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(async () => {
      const res = await updateTelemetryLogsAction();
      if (res && res.success && "carbon" in res) {
        setCarbonData(res.carbon);
        setAirData(res.air);
        setEnergyData(res.energy);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Current metric totals derived from state
  const currentCarbonOffset = carbonData.length > 0 ? carbonData[carbonData.length - 1].offset : 0;
  const currentAqi = airData.length > 0 ? airData[airData.length - 1].aqi : 50;
  const currentEnergyYield = energyData.length > 0 ? energyData[energyData.length - 1].yield : 0;

  const carbonTargetPercent = Math.min(Math.floor((currentCarbonOffset / 25000) * 100), 100);
  const airQualityStatus = currentAqi < 50 ? "Healthy" : currentAqi < 100 ? "Moderate" : "Unhealthy";
  const energyTargetPercent = Math.min(Math.floor((currentEnergyYield / 10.0) * 100), 100);

  return (
    <div className="relative min-h-screen py-16">
      {/* Background grids */}
      <GridBackground showGlow={true} glowPosition="bottom" animateReveal={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner Section */}
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <motion.div
            variants={staggerChildFadeInUp}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs text-primary font-medium mb-2"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Environmental ESG Metrics</span>
          </motion.div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Our Carbon & <span className="text-gradient-green">Sustainability Impact</span>
          </h1>
          <motion.p
            variants={staggerChildFadeInUp}
            className="text-base text-muted-foreground leading-relaxed"
          >
            We deploy verified auditing processes to provide corporate stakeholders and citizens with transparent, live ESG environmental logs.
          </motion.p>

          <motion.div variants={staggerChildFadeInUp} className="pt-4 flex justify-center">
            <GlowButton
              onClick={() => setIsSimulating(!isSimulating)}
              className={`gap-2 text-xs py-2 px-5 ${isSimulating ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : ""}`}
            >
              <Activity className={`h-3.5 w-3.5 ${isSimulating ? "animate-pulse" : ""}`} />
              {isSimulating ? "Disconnect Telemetry" : "Connect Live Telemetry"}
            </GlowButton>
          </motion.div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carbon Offset Area Chart */}
          <GlassCard animateReveal={false} hoverEffect={true} className="border-border/10 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-base font-bold text-foreground">Carbon Offset (Net Abatement)</h2>
                <p className="text-[10px] text-muted-foreground mt-0.5">Prevented methane emissions from gasification units.</p>
              </div>
              <div className="text-2xl font-heading font-black text-primary tracking-tight">
                {currentCarbonOffset.toLocaleString()} Tons
              </div>

              {/* Chart Visual */}
              <div className="h-48 w-full mt-4 font-mono text-[9px] -ml-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={carbonData}>
                    <defs>
                      <linearGradient id="colorOffset" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.72 0.18 147)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.72 0.18 147)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tickLine={false} axisLine={false} />
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
                    <Area type="monotone" dataKey="offset" stroke="oklch(0.72 0.18 147)" strokeWidth={2} fillOpacity={1} fill="url(#colorOffset)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/5 flex justify-between items-center text-[10px] font-mono">
              <span className="text-muted-foreground/60">25,000 Tons Target</span>
              <span className="text-primary font-semibold">{carbonTargetPercent}% Completed</span>
            </div>
          </GlassCard>

          {/* Clean Air Line Chart */}
          <GlassCard animateReveal={false} hoverEffect={true} className="border-border/10 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-base font-bold text-foreground">Clean Air Sanitization</h2>
                <p className="text-[10px] text-muted-foreground mt-0.5">PM2.5 AQI trend indexed by purification towers.</p>
              </div>
              <div className="text-2xl font-heading font-black text-primary tracking-tight">
                AQI Index: {currentAqi} ({airQualityStatus})
              </div>

              {/* Chart Visual */}
              <div className="h-48 w-full mt-4 font-mono text-[9px] -ml-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={airData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" tickLine={false} axisLine={false} domain={[0, 120]} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(18,18,20,0.85)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        fontSize: "10px",
                        color: "#fff",
                      }}
                    />
                    <Line type="monotone" dataKey="aqi" stroke="oklch(0.72 0.18 147)" strokeWidth={2.5} dot={{ r: 3, fill: "oklch(0.72 0.18 147)" }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/5 flex justify-between items-center text-[10px] font-mono">
              <span className="text-muted-foreground/60">Healthy Threshold: &lt;50</span>
              <span className="text-primary font-semibold">Live Monitoring</span>
            </div>
          </GlassCard>

          {/* Energy Feedback Bar Chart */}
          <GlassCard animateReveal={false} hoverEffect={true} className="border-border/10 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <BarChart2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-base font-bold text-foreground">Energy Feedback Yield</h2>
                <p className="text-[10px] text-muted-foreground mt-0.5">Electricity fed into municipal power grids.</p>
              </div>
              <div className="text-2xl font-heading font-black text-primary tracking-tight">
                {currentEnergyYield} Gigawatt-hours
              </div>

              {/* Chart Visual */}
              <div className="h-48 w-full mt-4 font-mono text-[9px] -ml-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="week" stroke="rgba(255,255,255,0.2)" tickLine={false} axisLine={false} />
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
                    <Bar dataKey="yield" fill="oklch(0.72 0.18 147)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/5 flex justify-between items-center text-[10px] font-mono">
              <span className="text-muted-foreground/60">10.0 GWh Target</span>
              <span className="text-primary font-semibold">{energyTargetPercent}% Completed</span>
            </div>
          </GlassCard>
        </div>

        {/* Sustainability Goals section */}
        <div className="mt-20 border-t border-border/10 pt-16 max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-center text-foreground mb-8">
            Our Long-Term ESG Targets
          </h2>
          <div className="space-y-6">
            {[
              { goal: "100k Tons Waste Diverted", time: "By Q4 2027", status: "Ongoing" },
              { goal: "100 GWh Clean Electricity Production", time: "By Q2 2028", status: "Planned" },
              { goal: "Zero Direct Carbon Operations footprint", time: "By Q4 2026", status: "Auditing" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl border border-border/10 bg-background/25 text-xs sm:text-sm font-mono text-muted-foreground"
              >
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="h-4.5 w-4.5 text-primary" />
                  <span className="text-foreground font-semibold font-sans">{item.goal}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[10px]">{item.time}</span>
                  <span className="text-[9px] bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-primary font-bold">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
