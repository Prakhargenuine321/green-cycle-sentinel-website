"use client";

import React from "react";
import { GridBackground } from "@/components/ui/grid-background";
import { GlassCard } from "@/components/ui/glass-card";
import { GraduationCap, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerChildFadeInUp } from "@/animations";

export default function ResearchPage() {
  const researchPapers = [
    {
      title: "Catalytic Cracking of Complex Hydrocarbons in Oxygen-Deprived Reactor Environments",
      authors: "Dr. Elena Rostova, Prof. Marcus Vance, Dr. Henry Kim",
      journal: "Journal of Thermochemical circular energy",
      date: "March 2026",
      abstract: "This paper analyzes the syngas purification yield optimization under localized catalytic interfaces. By utilizing active nickel-alumina meshes, tar formations inside the processing flue are reduced by 98.4% without requiring heavy physical washing loops.",
      category: "Thermal Conversion",
    },
    {
      title: "Fluid Dynamics of Multi-Stage Outdoor Bipolar Ionization Arrays",
      authors: "Sarah Lin, Dr. David Chen, Prof. Roger Davies",
      journal: "Atmospheric Dispersion & Particles Journal",
      date: "January 2026",
      abstract: "Modeling outdoor PM2.5 precipitation speeds inside dense urban street canyons. Validates that bipolar ion clusters actively bind to carbon and dust particulate, multiplying heavy sediment settling speeds up to twelve-fold under low drafts.",
      category: "Air Purification",
    },
    {
      title: "Machine Learning Heuristics for Dynamic Container Routing and Telemetry Nodes",
      authors: "Alan Vance, Prof. Sarah Jenkins",
      journal: "IEEE Transactions on Intelligent Infrastructure Systems",
      date: "October 2025",
      abstract: "Proposing an active vehicle dispatching routing algorithm that processes continuous container load and ultrasonic volume queues. Demonstrates a fuel savings index of 42.6% over static route scheduling models during testing.",
      category: "IoT Routing",
    },
    {
      title: "Biox-catalysts for Anaerobic Decomposition of Organic Municipal Refuse",
      authors: "Dr. Elena Rostova, Linda Wu",
      journal: "Biochemical Energy Review",
      date: "August 2025",
      abstract: "Analyzing anaerobic compost reaction velocities under bacterial culture enrichments. Outlines that custom inoculation mixes speed up composting cycles by 3.5x while reducing methane emissions by 40%.",
      category: "Biological Composting",
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
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Academic Research & Whitepapers</span>
          </motion.div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Scientific <span className="text-gradient-green">Whitepaper Repository</span>
          </h1>
          <motion.p
            variants={staggerChildFadeInUp}
            className="text-base text-muted-foreground mt-4 leading-relaxed"
          >
            Access our published papers, laboratory trial indexes, and algorithmic models documenting our circular engineering systems.
          </motion.p>
        </motion.div>

        {/* Papers Grid */}
        <motion.div
          variants={staggerContainer(0.12, 0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {researchPapers.map((paper) => (
            <GlassCard
              key={paper.title}
              animateReveal={false}
              hoverEffect={true}
              className="border-border/10 p-6 sm:p-8 flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-4">
                {/* Meta details */}
                <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                  <span className="text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase font-semibold">
                    {paper.category}
                  </span>
                  <span>{paper.date}</span>
                </div>

                <h2 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-250 leading-snug">
                  {paper.title}
                </h2>
                <p className="text-[11px] text-muted-foreground/85 font-medium">
                  {paper.authors}
                </p>
                <div className="text-[10px] font-mono text-muted-foreground/60 italic border-l-2 border-border/20 pl-3">
                  Published in: {paper.journal}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                  {paper.abstract}
                </p>
              </div>

              {/* Action */}
              <div className="mt-8 pt-4 border-t border-border/5 flex justify-end text-[11px] font-mono">
                <span className="text-primary font-bold flex items-center space-x-1 hover:underline">
                  <span>Open PDF Document</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Lab Partnerships Grid */}
        <div className="mt-20 border-t border-border/10 pt-16">
          <h2 className="font-heading text-2xl font-bold text-center text-foreground mb-12">
            Research Partners & Laboratories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              "National Renewable Energy Lab",
              "MIT Environmental Systems Lab",
              "Euro Circular Technology Inst.",
              "Stanford Decarbonization Group",
            ].map((partner, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center p-5 rounded-xl border border-border/10 bg-background/25 text-xs text-center font-mono text-muted-foreground hover:text-primary hover:border-primary/25 transition-all duration-300"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
