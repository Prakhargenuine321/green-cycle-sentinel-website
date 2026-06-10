"use client";

import React from "react";
import Link from "next/link";
import { GridBackground } from "@/components/ui/grid-background";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { Server, Smartphone, Compass, ArrowRight, Package, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerChildFadeInUp } from "@/animations";

export default function ProductsPage() {
  const products = [
    {
      icon: <Server className="h-6 w-6 text-primary" />,
      name: "Sentinel Gasifier Reactor v1",
      tagline: "Industrial Refuse Energy Yield",
      description: "A continuous-feed, high-capacity gasification chamber designed for municipal utility sites and manufacturing plants. Processes unsorted carbon refuse into syngas grids with zero combustion ash.",
      specs: {
        "Thermal Output Capacity": "20 MWt Peak",
        "Syngas Purity Index": "99.8% tar-free",
        "Daily Processing Capacity": "50 metric tons",
        "Target Refuse Categories": "Organic refuse, plastics, paper",
      },
      badge: "Municipal Utility Scale",
      priceMock: "Integration Quotes Only",
    },
    {
      icon: <Smartphone className="h-6 w-6 text-primary" />,
      name: "Smart Container Node",
      tagline: "IoT Telemetry Intake Hub",
      description: "A solar-assisted cellular container sensor system that hooks onto existing municipal dumpsters. Tracks weight and volume levels, dispatching dispatches dynamically via network gateways.",
      specs: {
        "Volume Telemetry Range": "Up to 3m ultrasonic depth",
        "Integrated Load-cell Limit": "2,500 kg maximum weight",
        "Transmission Protocols": "LoRaWAN, NB-IoT, 5G M2M",
        "Ingress Protection Rating": "IP67 dust and water sealed",
      },
      badge: "Smart City Asset",
      priceMock: "Volume Subscriptions",
    },
    {
      icon: <Compass className="h-6 w-6 text-primary" />,
      name: "AQI Purification Tower",
      tagline: "Bipolar Ionization Sanitizer",
      description: "An architectural municipal column that sanitizes outdoor urban air, precipitously dropping PM2.5 counts using double-stage ionizers while publishing outdoor gas metrics to dashboards.",
      specs: {
        "Effective Processing Vol": "15,000 m³/hour active",
        "AQI Transceiver Update": "Real-time 5-second offset",
        "Solar Panel Peak Output": "420W integrated roof cells",
        "Active Particle Abatement": "99.7% efficiency capture",
      },
      badge: "Public Space Infrastructure",
      priceMock: "Municipal Contracts",
    },
  ];

  return (
    <div className="relative min-h-screen py-16">
      {/* Background grids */}
      <GridBackground showGlow={true} glowPosition="top-right" animateReveal={true} />

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
            <Package className="h-3.5 w-3.5" />
            <span>Industrial Hardware & Software</span>
          </motion.div>
          <motion.h1
            variants={staggerChildFadeInUp}
            className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-foreground"
          >
            Municipal Circular <span className="text-gradient-green">Product Catalog</span>
          </motion.h1>
          <motion.p
            variants={staggerChildFadeInUp}
            className="text-base text-muted-foreground mt-4 leading-relaxed"
          >
            Explore our plug-and-play gasification systems, IoT dumpster tracking transceivers, and smart solar-assisted air towers.
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={staggerContainer(0.15, 0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {products.map((product) => (
            <GlassCard
              key={product.name}
              animateReveal={false}
              hoverEffect={true}
              className="border-border/10 flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header block */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      {product.icon}
                    </div>
                    <span className="text-[9px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                      {product.badge}
                    </span>
                  </div>
                  <h2 className="font-heading text-xl font-bold text-foreground mt-4">
                    {product.name}
                  </h2>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block mt-1">
                    {product.tagline}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                {/* Specs List */}
                <div className="space-y-2.5">
                  <span className="text-[9px] font-mono text-primary font-bold uppercase tracking-wider">
                    Operating Specs
                  </span>
                  <div className="space-y-2 border-t border-border/5 pt-2">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-mono text-foreground font-medium text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action area */}
              <div className="mt-8 pt-4 border-t border-border/5 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-mono">Contract Model:</span>
                  <span className="font-heading font-semibold text-foreground">{product.priceMock}</span>
                </div>
                <Link href="/contact" className="block w-full">
                  <GlowButton className="w-full gap-2 text-xs py-2">
                    Request Quote & Specs <ArrowRight className="h-3.5 w-3.5" />
                  </GlowButton>
                </Link>
              </div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Compliance Footer */}
        <div className="mt-16 flex items-center justify-center space-x-3 bg-muted/40 border border-border/10 p-4 rounded-2xl max-w-2xl mx-auto text-xs text-muted-foreground">
          <Shield className="h-4.5 w-4.5 text-primary shrink-0" />
          <span>All hardware products conform to CE Mark standards and undergo rigorous testing before dispatch.</span>
        </div>
      </div>
    </div>
  );
}
