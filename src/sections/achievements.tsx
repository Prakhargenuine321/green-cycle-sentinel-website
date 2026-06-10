"use client";

import React from "react";
import { Award, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { staggerContainer } from "@/animations";

interface Achievement {
  icon: React.ReactNode;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

const achievementsList: Achievement[] = [
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: "ISO 14001 Certification",
    issuer: "International Standards Org",
    date: "December 2025",
    description: "Fully compliant with international specifications for environmental management systems. Assures partners of our structural green operational compliance.",
  },
  {
    icon: <Award className="h-6 w-6 text-primary" />,
    title: "ESG Impact Index - AAA Rating",
    issuer: "Global Green Finance Council",
    date: "February 2026",
    description: "Awarded top-tier AAA sustainability rating, putting Green Cycle Sentinel in the top 5% of global technology startups for carbon offset efficiency.",
  },
  {
    icon: <Sparkles className="h-6 w-6 text-primary" />,
    title: "Circular Economy Innovation Award",
    issuer: "CleanTech Foundation",
    date: "November 2025",
    description: "Recognized as the most promising circular energy infrastructure solution, specifically highlighting our municipal syngas reactor mechanics.",
  },
];

export function Achievements() {
  return (
    <section className="relative py-20 overflow-hidden bg-background/50">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs text-primary font-medium mb-4">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span>Industrial Trust & Compliance</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Certifications & <span className="text-gradient-green">Global Achievements</span>
          </h2>
          <p className="text-base text-muted-foreground mt-4 leading-relaxed">
            Our systems and processes undergo continuous third-party audits to guarantee that we deliver verified, investor-grade ESG compliance outputs.
          </p>
        </div>

        {/* Achievements list cards */}
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {achievementsList.map((ach) => (
            <GlassCard
              key={ach.title}
              animateReveal={false}
              hoverEffect={true}
              className="border-border/10 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Icon Circle */}
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  {ach.icon}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                    {ach.issuer}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-foreground mt-1">
                    {ach.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Card Footer date */}
              <div className="mt-6 pt-4 border-t border-border/5 text-[10px] font-mono text-muted-foreground/60 text-right">
                ISSUED: {ach.date}
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
