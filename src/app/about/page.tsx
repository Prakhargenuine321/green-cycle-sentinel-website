"use client";

import React from "react";
import { GridBackground } from "@/components/ui/grid-background";
import { GlassCard } from "@/components/ui/glass-card";
import { Globe, Heart, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerChildFadeInUp } from "@/animations";

export default function AboutPage() {
  const values = [
    {
      icon: <Shield className="h-5 w-5 text-primary" />,
      title: "Scientific Integrity",
      description: "Our gasification and precipitation systems undergo strict peer-review and external lab audits.",
    },
    {
      icon: <Globe className="h-5 w-5 text-primary" />,
      title: "Circular Commitment",
      description: "We are focused on eliminating municipal landfills, routing all organic refuse back into baseline grids.",
    },
    {
      icon: <Heart className="h-5 w-5 text-primary" />,
      title: "Community Protection",
      description: "Sanitizing air in heavy traffic corridors to secure urban public health index levels.",
    },
  ];

  const team = [
    { name: "Dr. Elena Rostova", role: "Chief Scientific Officer", bio: "Former Lead Researcher at National Renewable Energy Laboratory. PhD in Chemistry." },
    { name: "Marcus Vance", role: "Chief Executive Officer", bio: "SVP of Engineering at Rivian / Tesla Infrastructure. MS in Mechanical Engineering." },
    { name: "Sarah Lin", role: "Director of Fluid Dynamics", bio: "Research fellow at MIT Atmospheric Physics group. Expert in urban particulate dispersion." },
    { name: "Alan Vance", role: "Lead Systems Architect", bio: "Distributed IoT logistics veteran. Core architect of municipal dispatching routing models." },
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
            <Users className="h-3.5 w-3.5" />
            <span>Our Mission & Team</span>
          </motion.div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Closing the Waste Loop, <span className="text-gradient-green">Securing Our Air</span>
          </h1>
          <motion.p
            variants={staggerChildFadeInUp}
            className="text-base text-muted-foreground mt-4 leading-relaxed"
          >
            Green Cycle Sentinel was founded by deep-tech engineers and environmental scientists united by a single vision: circular urban autonomy.
          </motion.p>
        </motion.div>

        {/* Mission Statement */}
        <GlassCard animateReveal={true} className="border-border/10 p-8 sm:p-10 mb-16 max-w-4xl mx-auto text-center space-y-4">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Our Core Vision
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            &ldquo;Municipal waste is not refuse; it is high-density chemical energy waiting to be reclaimed. By integrating IoT logistics dispatching with oxygen-lean gasification, we return carbon grids back to public use, sanitizing our city atmospheres concurrently.&rdquo;
          </p>
        </GlassCard>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="font-heading text-2xl font-bold text-center text-foreground mb-12">
            Our Operating Values
          </h2>
          <motion.div
            variants={staggerContainer(0.15, 0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((val) => (
              <GlassCard
                key={val.title}
                animateReveal={false}
                hoverEffect={true}
                className="border-border/10 p-6 flex flex-col items-center text-center space-y-4"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  {val.icon}
                </div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  {val.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {val.description}
                </p>
              </GlassCard>
            ))}
          </motion.div>
        </div>

        {/* Executive Board Team */}
        <div>
          <h2 className="font-heading text-2xl font-bold text-center text-foreground mb-12">
            Leadership Team & Advisors
          </h2>
          <motion.div
            variants={staggerContainer(0.12, 0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member) => (
              <GlassCard
                key={member.name}
                animateReveal={false}
                hoverEffect={true}
                className="border-border/10 p-6 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <h3 className="font-heading text-base font-bold text-foreground leading-tight">
                    {member.name}
                  </h3>
                  <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider block">
                    {member.role}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
