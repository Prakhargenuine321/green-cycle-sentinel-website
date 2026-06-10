"use client";

import React from "react";
import { Globe, Trash2, Leaf, BarChart2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { staggerContainer } from "@/animations";

interface Metric {
  icon: React.ReactNode;
  label: string;
  value: string;
  target: string;
  percentage: number;
}

const metrics: Metric[] = [
  {
    icon: <Trash2 className="h-5 w-5 text-primary" />,
    label: "Solid Waste Diverted",
    value: "42,804 Tons",
    target: "Target: 50,000 Tons",
    percentage: 85,
  },
  {
    icon: <Leaf className="h-5 w-5 text-primary" />,
    label: "Net Carbon Abatement",
    value: "18,409 CO2e",
    target: "Target: 25,000 CO2e",
    percentage: 73,
  },
  {
    icon: <Globe className="h-5 w-5 text-primary" />,
    label: "Air Volume Sanitized",
    value: "142.5M m³",
    target: "Target: 200.0M m³",
    percentage: 71,
  },
  {
    icon: <BarChart2 className="h-5 w-5 text-primary" />,
    label: "Syngas Electricity Generated",
    value: "8.4 GWh",
    target: "Target: 10.0 GWh",
    percentage: 84,
  },
];

export function SustainabilityImpact() {
  return (
    <section className="relative py-20 overflow-hidden bg-background/30">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs text-primary font-medium mb-4">
            <Globe className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span>Live ESG Impact Statistics</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Quantifiable <span className="text-gradient-green">Sustainability Impact</span>
          </h2>
          <p className="text-base text-muted-foreground mt-4 leading-relaxed">
            Our circular energy operations publish live verified statistics tracking waste diverted, net greenhouse gas offsets, and power output indices.
          </p>
        </div>

        {/* Dashboard Grid */}
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {metrics.map((metric) => (
            <GlassCard
              key={metric.label}
              animateReveal={false}
              hoverEffect={true}
              className="border-border/10 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Icon Circle */}
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  {metric.icon}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                    {metric.label}
                  </span>
                  <span className="font-heading text-2xl font-bold text-foreground block mt-1">
                    {metric.value}
                  </span>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="mt-6 space-y-2">
                <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${metric.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-muted-foreground/60">
                  <span>{metric.target}</span>
                  <span className="text-primary font-semibold">{metric.percentage}%</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
