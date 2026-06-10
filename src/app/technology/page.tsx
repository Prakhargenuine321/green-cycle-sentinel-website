"use client";

import React from "react";
import { GridBackground } from "@/components/ui/grid-background";
import { GlassCard } from "@/components/ui/glass-card";
import { Cpu, RefreshCw, Wind, Database } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerChildFadeInUp } from "@/animations";

export default function TechnologyPage() {
  const specs = [
    {
      title: "Sentinel Gasifier Unit v1",
      icon: <RefreshCw className="h-6 w-6 text-primary" />,
      tagline: "Solid refuse thermal synthesis",
      details: "Our thermo-chemical processing chamber operates under highly controlled, oxygen-lean environments to prevent complete combustion, cracking complex organic structures into high-grade syngas.",
      specTable: {
        "Thermal Processing Core": "1200°C Max Operating",
        "Refuse Conversion Rate": "95.2% average reduction",
        "Syngas Caloric Value": "12.5 MJ/Nm³ baseline",
        "Emission Byproducts": "Zero direct ash, bio-char only",
      },
    },
    {
      title: "IoT Sensor Node Collection",
      icon: <Database className="h-6 w-6 text-primary" />,
      tagline: "Logistics routing optimization",
      details: "Utilizes dual ultrasonic transceiver modules and load-cells connected to local LoRaWAN nodes to track dumpster levels. Schedules dispatch loops automatically based on filling rates.",
      specTable: {
        "Telemetry Tolerances": "±1cm accuracy on fill index",
        "Battery Lifespan Profile": "5 Years (Integrated solar cell)",
        "Network Protocols": "LoRaWAN, NB-IoT, Cellular M2M",
        "Route Optimization Rate": "40% reduction in truck transit",
      },
    },
    {
      title: "Bipolar Ionization Tower",
      icon: <Wind className="h-6 w-6 text-primary" />,
      tagline: "Urban PM2.5 micro-purifier",
      details: "Releases positive and negative oxygen ions that cluster around floating particulate matter (PM2.5, pollen, organic compounds), forcing them to precipitate out of air columns.",
      specTable: {
        "Air Processing Capacity": "15,000 m³ sanitized / hour",
        "Precipitation Efficacy": "99.7% PM2.5 particulate capture",
        "Aura Purify Diameter": "50m active radius coverage",
        "Grid Energy Profile": "Off-grid Solar array + battery",
      },
    },
  ];

  return (
    <div className="relative min-h-screen py-16">
      {/* Background Grids */}
      <GridBackground showGlow={true} glowPosition="center" animateReveal={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner Section */}
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            variants={staggerChildFadeInUp}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs text-primary font-medium mb-4"
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Industrial Specifications Blueprint</span>
          </motion.div>
          <motion.h1
            variants={staggerChildFadeInUp}
            className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-foreground"
          >
            The Technology Behind <span className="text-gradient-green">Green Cycle Sentinel</span>
          </motion.h1>
          <motion.p
            variants={staggerChildFadeInUp}
            className="text-base text-muted-foreground mt-4 leading-relaxed"
          >
            Review the operating specifications, sensor configurations, and thermal details of our municipal circular infrastructure.
          </motion.p>
        </motion.div>

        {/* Detailed Spec Panels */}
        <motion.div
          variants={staggerContainer(0.15, 0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-12"
        >
          {specs.map((item) => (
            <GlassCard
              key={item.title}
              animateReveal={false}
              hoverEffect={true}
              className="border-border/10 p-8 flex flex-col lg:flex-row gap-8 lg:gap-12"
            >
              {/* Left Column: Tech Overview */}
              <div className="lg:w-1/2 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider block">
                      {item.tagline}
                    </span>
                    <h2 className="font-heading text-2xl font-bold text-foreground">
                      {item.title}
                    </h2>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                  {item.details}
                </p>
              </div>

              {/* Right Column: Tabular Spec Sheet */}
              <div className="lg:w-1/2 flex flex-col justify-center">
                <div className="border border-border/10 rounded-xl overflow-hidden bg-background/25">
                  <div className="bg-muted/40 px-4 py-2 border-b border-border/10 text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
                    Operational Spec Sheet
                  </div>
                  <div className="divide-y divide-border/5">
                    {Object.entries(item.specTable).map(([key, value]) => (
                      <div key={key} className="flex justify-between px-4 py-3 text-xs">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-mono text-foreground font-semibold text-right">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
