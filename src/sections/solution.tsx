"use client";

import React from "react";
import { Zap, Route, Wind, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { staggerContainer } from "@/animations";

interface SolutionItem {
  icon: React.ReactNode;
  title: string;
  badge: string;
  description: string;
  benefits: string[];
}

const solutions: SolutionItem[] = [
  {
    icon: <Zap className="h-6 w-6 text-primary-foreground" />,
    title: "Waste-to-Energy Gasification",
    badge: "Circular Thermal",
    description: "Sentinel High-Temperature Gasification Units transform unsorted municipal solid waste into high-energy baseline syngas, driving local power turbines with zero incineration burn.",
    benefits: [
      "95% Volume reduction in landfill waste",
      "Saves syngas for grid energy feed",
      "Ultra-low particulate carbon footprint",
    ],
  },
  {
    icon: <Route className="h-6 w-6 text-primary-foreground" />,
    title: "Smart Waste Collection Grid",
    badge: "IoT Telemetry",
    description: "Networked telemetry systems inside local collection nodes monitor filling capacities, optimize truck transit routes, and automate pickup dispatches via scheduling algorithms.",
    benefits: [
      "40% Logistics fuel consumption savings",
      "Prevents dump overflows in urban areas",
      "Dynamic forecasting analytics dashboards",
    ],
  },
  {
    icon: <Wind className="h-6 w-6 text-primary-foreground" />,
    title: "Active AQI Air Purification",
    badge: "Urban Purification",
    description: "Municipal air sanitization stations combining bipolar ionization and medical-grade particulate filtration filters to capture PM2.5 and clean urban centers.",
    benefits: [
      "Neutralizes 99.7% of chemical air toxins",
      "Integrated live AQI reporting sensors",
      "Modular solar-powered city structures",
    ],
  },
];

export function Solution() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs text-primary font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span>Integrated Platform Offerings</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Closing the Loop with <span className="text-gradient-green">Intelligent Systems</span>
          </h2>
          <p className="text-base text-muted-foreground mt-4 leading-relaxed">
            Our modular suite integrates municipal logistics, thermal waste gasification, and smart air cleaning into a cohesive web-monitored dashboard structure.
          </p>
        </div>

        {/* Solutions Cards Grid */}
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {solutions.map((sol) => (
            <GlassCard
              key={sol.title}
              animateReveal={false}
              hoverEffect={true}
              className="border-border/10 flex flex-col justify-between"
            >
              <div className="space-y-5">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    {sol.icon}
                  </div>
                  <span className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                    {sol.badge}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-foreground">
                  {sol.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {sol.description}
                </p>

                {/* Benefits Bullet List */}
                <ul className="space-y-2 pt-2">
                  {sol.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-muted-foreground/90">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
