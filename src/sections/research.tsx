"use client";

import React from "react";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { staggerContainer } from "@/animations";

interface Paper {
  title: string;
  journal: string;
  date: string;
  authors: string;
  abstract: string;
  readTime: string;
}

const papers: Paper[] = [
  {
    title: "High-Temperature Hydrocarbon Cracking in Gasification Reactors",
    journal: "Circular Energy Journal",
    date: "March 2026",
    authors: "Dr. Elena Rostova, Prof. Marcus Vance",
    abstract: "Investigating syngas synthesis under localized oxygen deprivation. Demonstrates a 14% yield optimization in baseline hydrocarbons at reactor temperatures exceeding 1150°C.",
    readTime: "12 min read",
  },
  {
    title: "Aerodynamics of Bipolar Ionization in Urban Street Canyons",
    journal: "Atmospheric Physics Review",
    date: "January 2026",
    authors: "Sarah Lin, Dr. David Chen",
    abstract: "Modeling particulate precipitation rates under low wind speed boundaries. Validates active PM2.5 precipitation efficiency levels up to 99.7% near active filtration towers.",
    readTime: "18 min read",
  },
  {
    title: "Distributed Telemetry Scheduling for Municipal Containers",
    journal: "IEEE IoT Journal",
    date: "October 2025",
    authors: "Alan Vance, Prof. Sarah Jenkins",
    abstract: "Proposing a dynamic vehicle routing algorithm powered by real-time sensor queues. Shows a logistics fuel reduction profile of 42% across dense urban testing clusters.",
    readTime: "15 min read",
  },
];

export function Research() {
  return (
    <section className="relative py-20 overflow-hidden bg-background/50">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs text-primary font-medium">
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
              <span>Academic & Scientific Foundation</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Validated by <span className="text-gradient-green">Deep-Tech Research</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
              Our engineering systems are backed by peer-reviewed research papers and collaborations with national circular energy laboratories. We value scientific rigour.
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right hidden lg:block">
            <span className="text-xs text-muted-foreground/60 font-mono">
              PATENTS REGISTERED: 14/14
            </span>
          </div>
        </div>

        {/* Publications Grid */}
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {papers.map((paper) => (
            <GlassCard
              key={paper.title}
              animateReveal={false}
              hoverEffect={true}
              className="border-border/10 flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-4">
                {/* Journal tag */}
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>{paper.journal}</span>
                  <span>{paper.date}</span>
                </div>

                <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors duration-250 leading-snug">
                  {paper.title}
                </h3>

                <div className="text-[11px] text-primary/80 font-medium">
                  {paper.authors}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {paper.abstract}
                </p>
              </div>

              {/* Card Footer interaction */}
              <div className="mt-6 pt-4 border-t border-border/5 flex items-center justify-between text-[11px] font-mono">
                <span className="text-muted-foreground/60">{paper.readTime}</span>
                <span className="text-primary font-semibold flex items-center space-x-1 hover:underline">
                  <span>Read Paper</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
