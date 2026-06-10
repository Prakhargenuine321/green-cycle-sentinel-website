"use client";

import React from "react";
import { GridBackground } from "@/components/ui/grid-background";
import { GlassCard } from "@/components/ui/glass-card";
import { CheckCircle2, ShieldCheck, Award, Sparkles, Server } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerChildFadeInUp } from "@/animations";

export default function AchievementsPage() {
  const credentials = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "ISO 14001 Certification",
      issuer: "Global Audit Standards Corp",
      date: "December 2025",
      description: "Demonstrates that our corporate waste processing and gasification reactors conform strictly to environmental management systems standards.",
      index: "Ref: ISO-14001-2025-0842",
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "AAA ESG Rating Index",
      issuer: "Green Finance Advisory Council",
      date: "February 2026",
      description: "Granted after an intensive audit of our Syngas conversion carbon-offset rates and logistical fuel-abatement parameters. Places GCS in the top 5% of deep-tech startups.",
      index: "Ref: ESG-AAA-GCS-084",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "Circular Infrastructure Innovation Award",
      issuer: "CleanTech Forum Europe",
      date: "November 2025",
      description: "Awarded to the Sentinel Gasifier reactor design for high thermal conversion ratios and particulates trapping efficiency under street canyon configurations.",
      index: "Ref: CT-INNOV-2025-994",
    },
    {
      icon: <Server className="h-6 w-6 text-primary" />,
      title: "ISO 9001 Quality Management",
      issuer: "Global Audit Standards Corp",
      date: "October 2025",
      description: "Verifies that our manufacturing pathways, sensor assembly loops, and delivery channels meet rigorous international quality controls.",
      index: "Ref: ISO-9001-2025-4122",
    },
  ];

  return (
    <div className="relative min-h-screen py-16">
      {/* Background grids */}
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
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Audited Credentials & compliance</span>
          </motion.div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Achievements & <span className="text-gradient-green">Certifications</span>
          </h1>
          <motion.p
            variants={staggerChildFadeInUp}
            className="text-base text-muted-foreground mt-4 leading-relaxed"
          >
            Review our verified ESG benchmarks, ISO industrial standards, and technology design awards.
          </motion.p>
        </motion.div>

        {/* Credentials Grid */}
        <motion.div
          variants={staggerContainer(0.12, 0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {credentials.map((ach) => (
            <GlassCard
              key={ach.title}
              animateReveal={false}
              hoverEffect={true}
              className="border-border/10 p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    {ach.icon}
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border/5">
                    {ach.date}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider block">
                    {ach.issuer}
                  </span>
                  <h2 className="font-heading text-lg font-bold text-foreground mt-1">
                    {ach.title}
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Footer specs */}
              <div className="mt-8 pt-4 border-t border-border/5 flex justify-between items-center text-[9px] font-mono text-muted-foreground/60">
                <span>VERIFIED REGISTRY</span>
                <span className="font-semibold">{ach.index}</span>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
