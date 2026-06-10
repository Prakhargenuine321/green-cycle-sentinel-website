"use client";

import React from "react";
import { AlertTriangle, Activity, Database, HeartPulse } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { staggerContainer } from "@/animations";

interface ProblemItem {
  icon: React.ReactNode;
  title: string;
  stat: string;
  description: string;
  warning: string;
}

const problems: ProblemItem[] = [
  {
    icon: <Database className="h-6 w-6 text-amber-500" />,
    title: "Linear Solid Waste Growth",
    stat: "2.01B Tons",
    description: "Annual municipal solid waste is scaling rapidly. Landfills are reaching absolute saturation, leaking high levels of greenhouse gases directly into atmospheres.",
    warning: "Expected waste increase of 70% by 2050",
  },
  {
    icon: <HeartPulse className="h-6 w-6 text-amber-500" />,
    title: "Air Quality Degradation",
    stat: "91% Exceeded",
    description: "The majority of the global population breathes air that exceeds safe WHO guidelines. Municipalities lack real-time localized tracking and micro-purification systems.",
    warning: "7 Million annual deaths linked to air toxins",
  },
  {
    icon: <Activity className="h-6 w-6 text-amber-500" />,
    title: "Material Circular Leakage",
    stat: "91.4% Lost",
    description: "Over ninety percent of raw energy inputs and recyclable materials bypass waste-recovery flows entirely, ending up permanently lost in oceans or slag heaps.",
    warning: "Valuable hydrocarbons incinerated without energy recovery",
  },
];

export function Problem() {
  return (
    <section className="relative py-20 overflow-hidden bg-background/50">
      {/* Visual top border connector */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/25 rounded-full px-3 py-1 text-xs text-amber-500 font-medium mb-4">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Core Environmental Vulnerabilities</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            The Industrial Consumption Loop is <span className="text-amber-500">Fractured</span>
          </h2>
          <p className="text-base text-muted-foreground mt-4 leading-relaxed">
            Existing municipal collection networks, waste dumps, and air monitoring infrastructures are built on legacy linear frameworks that cannot scale to modern resource demands.
          </p>
        </div>

        {/* Problems Card Grid */}
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {problems.map((problem) => (
            <GlassCard
              key={problem.title}
              animateReveal={false}
              hoverEffect={true}
              className="group border-border/10 hover:border-amber-500/30 hover:shadow-[0_0_30px_oklch(from_var(--destructive)_l_c_h_/_0.03)] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  {problem.icon}
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {problem.title}
                </h3>
                <div className="text-3xl font-heading font-black text-amber-500/90 tracking-tight">
                  {problem.stat}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/5 text-[11px] font-mono text-amber-500 flex items-center space-x-1.5 bg-amber-500/[0.02] p-2 rounded-lg border border-amber-500/5">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>{problem.warning}</span>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
