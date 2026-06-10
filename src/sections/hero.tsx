"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Activity, ShieldCheck, Zap } from "lucide-react";
import { GlowButton } from "@/components/ui/glow-button";
import { GlassCard } from "@/components/ui/glass-card";
import { fadeInUp, staggerContainer, staggerChildFadeInUp } from "@/animations";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading & Copy */}
          <motion.div
            variants={staggerContainer(0.1, 0.1)}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col justify-center text-left space-y-6"
          >
            <motion.div
              variants={staggerChildFadeInUp}
              className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs text-primary font-medium w-fit"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span>Pioneering Circular Infrastructure</span>
            </motion.div>

            <motion.h1
              variants={staggerChildFadeInUp}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-foreground"
            >
              Circular Energy Systems for the{" "}
              <span className="text-gradient-green">Next Generation</span> of Deep-Tech
            </motion.h1>

            <motion.p
              variants={staggerChildFadeInUp}
              className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              Green Cycle Sentinel engineers smart waste-to-energy ecosystems, active air purification stations, and real-time AQI networks to close the carbon loop for smart municipalities.
            </motion.p>

            <motion.div
              variants={staggerChildFadeInUp}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Link href="/report-waste">
                <GlowButton size="lg" className="w-full sm:w-auto gap-2">
                  Report Waste <ArrowRight className="h-4 w-4" />
                </GlowButton>
              </Link>
              <Link href="/technology">
                <GlowButton
                  variant="outline"
                  size="lg"
                  glowColor="none"
                  className="w-full sm:w-auto text-foreground border-border hover:bg-muted/50 cursor-pointer"
                >
                  Explore Technology
                </GlowButton>
              </Link>
            </motion.div>

            {/* Quick trust metrics */}
            <motion.div
              variants={staggerChildFadeInUp}
              className="flex items-center space-x-6 pt-6 border-t border-border/10 text-xs text-muted-foreground"
            >
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Investor Grade ESG</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Activity className="h-4 w-4 text-emerald-500" />
                <span>Live AQI Node Networks</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: High-Fidelity Tech Dashboard Mockup */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 relative w-full flex items-center justify-center"
          >
            <div className="relative w-full max-w-[420px] aspect-[4/5] md:aspect-[1/1] lg:aspect-[4/5] xl:aspect-[1/1]">
              {/* Outer decorative ambient glow */}
              <div className="absolute inset-0 bg-primary/20 blur-[60px] md:blur-[100px] rounded-full pointer-events-none -z-10" />

              {/* Main glassmorphic card mockup */}
              <GlassCard
                animateReveal={false}
                hoverEffect={true}
                className="w-full h-full flex flex-col justify-between border-border/25 relative overflow-hidden"
              >
                {/* Simulated scan line vector */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-[grid-reveal_4s_infinite_ease-in-out]" />

                {/* Dashboard top bar */}
                <div className="flex items-center justify-between pb-4 border-b border-border/10">
                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-heading text-xs font-semibold text-foreground tracking-wider uppercase">
                      Sentinel Node-08
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted/65 px-2 py-0.5 rounded border border-border/5">
                    SECURE CONNECT
                  </span>
                </div>

                {/* Main visualization grid */}
                <div className="flex-grow py-6 flex flex-col justify-center space-y-6">
                  {/* Gasification rate tracker */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Gasification Rate</span>
                      <span className="font-mono text-primary font-medium">98.4%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "98.4%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>

                  {/* Dual Grid Statistics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-border/10 p-3.5 rounded-xl bg-background/25">
                      <div className="flex items-center space-x-1 mb-1">
                        <Zap className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[10px] text-muted-foreground uppercase font-medium">
                          Power Gen
                        </span>
                      </div>
                      <span className="font-heading text-lg font-bold text-foreground">
                        4.2 <span className="text-xs font-normal text-muted-foreground">MW</span>
                      </span>
                    </div>

                    <div className="border border-border/10 p-3.5 rounded-xl bg-background/25">
                      <div className="flex items-center space-x-1 mb-1">
                        <Activity className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[10px] text-muted-foreground uppercase font-medium">
                          AQI Index
                        </span>
                      </div>
                      <span className="font-heading text-lg font-bold text-primary">
                        12 <span className="text-xs font-normal text-muted-foreground">EXCELLENT</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dashboard footer status */}
                <div className="pt-4 border-t border-border/10 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>Carbon Offset: +12,408 tons</span>
                  <span className="text-emerald-500 font-semibold">GRID STABLE</span>
                </div>
              </GlassCard>

              {/* Smaller secondary floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 h-16 w-36 glass-card border-border/15 p-3 rounded-xl shadow-lg flex items-center space-x-2 pointer-events-none hidden sm:flex"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="flex flex-col text-[10px]">
                  <span className="text-muted-foreground uppercase font-mono">Waste Collected</span>
                  <span className="font-bold text-foreground font-heading">84.2 metric tons</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 h-16 w-36 glass-card border-border/15 p-3 rounded-xl shadow-lg flex items-center space-x-2 pointer-events-none hidden sm:flex"
              >
                <div className="h-2.5 w-2.5 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="h-1.5 w-1.5 text-primary-foreground" />
                </div>
                <div className="flex flex-col text-[10px]">
                  <span className="text-muted-foreground uppercase font-mono">AQI Purification</span>
                  <span className="font-bold text-foreground font-heading">99.8% Efficiency</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
