"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Handshake, Briefcase, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { motion } from "framer-motion";
import { staggerContainer } from "@/animations";

export function CTAs() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer(0.2, 0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Investor CTA Card */}
          <GlassCard
            animateReveal={false}
            hoverEffect={true}
            className="border-border/10 p-8 sm:p-10 flex flex-col justify-between overflow-hidden relative group"
          >
            {/* Custom glowing background loop */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-[50px] group-hover:scale-125 transition-transform duration-500" />

            <div className="space-y-6 relative z-10">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
                  Venture & Growth Capital
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  Backing the Circular Energy Transition
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                We are expanding our Sentinel Gasifier pilot programs. Access our secure investor dataroom to review engineering audits, patent registers, and carbon revenue models.
              </p>
            </div>

            <div className="pt-8 relative z-10">
              <Link href="/contact#investors">
                <GlowButton className="w-full sm:w-auto gap-2">
                  Access Pitch Room <ArrowRight className="h-4 w-4" />
                </GlowButton>
              </Link>
            </div>
          </GlassCard>

          {/* Partner CTA Card */}
          <GlassCard
            animateReveal={false}
            hoverEffect={true}
            className="border-border/10 p-8 sm:p-10 flex flex-col justify-between overflow-hidden relative group"
          >
            {/* Custom glowing background loop */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-accent/15 blur-[50px] group-hover:scale-125 transition-transform duration-500" />

            <div className="space-y-6 relative z-10">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/25">
                <Handshake className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-accent-foreground font-bold uppercase tracking-wider">
                  Municipalities & Corporates
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mt-1">
                  Powering Modern Smart Cities
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                Deploy Sentinel collection nodes and purification towers in your local district. Work with our systems integration team to map waste reduction profiles.
              </p>
            </div>

            <div className="pt-8 relative z-10">
              <Link href="/contact#partners">
                <GlowButton glowColor="accent" className="w-full sm:w-auto gap-2">
                  Contact Partner Team <ChevronRight className="h-4 w-4" />
                </GlowButton>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
