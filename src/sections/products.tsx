"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Package, Server, Smartphone, Compass } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { motion } from "framer-motion";
import { staggerContainer } from "@/animations";

interface Product {
  icon: React.ReactNode;
  name: string;
  category: string;
  specs: Record<string, string>;
  target: string;
}

const productsList: Product[] = [
  {
    icon: <Server className="h-6 w-6 text-primary" />,
    name: "Sentinel Gasifier v1",
    category: "Thermal Conversion Reactor",
    specs: {
      "Refuse Output Reduction": "95% by volume",
      "Process Temperature": "1200°C Max",
      "Baseline Power Yield": "Up to 5MW Syngas",
    },
    target: "Municipalities & Utilities",
  },
  {
    icon: <Smartphone className="h-6 w-6 text-primary" />,
    name: "Smart Container Node",
    category: "IoT Waste Telemetry Hub",
    specs: {
      "Sensor Modules": "Ultrasonic + Load-cell",
      "Battery Life Span": "5 Years (Solar Assist)",
      "Wireless Protocol": "LoRaWAN / NBIoT",
    },
    target: "Smart Cities & Large Campuses",
  },
  {
    icon: <Compass className="h-6 w-6 text-primary" />,
    name: "Purification AQI Tower",
    category: "Bipolar Ionization Sanitizer",
    specs: {
      "Air Sanitize Volume": "15,000 m³/hour",
      "PM2.5 Capture Rating": "99.7% efficiency",
      "Grid Feed Mode": "Off-grid Solar Powered",
    },
    target: "Urban Centers & Industrial Parks",
  },
];

export function Products() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs text-primary font-medium">
              <Package className="h-3.5 w-3.5 text-primary" />
              <span>Sentinel Product Suite</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Investor-Grade <span className="text-gradient-green">Hardware Solutions</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
              Our products are engineered in compliance with strict ISO standards, providing municipal partners with plug-and-play carbon reducing assets.
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <Link href="/products">
              <GlowButton variant="outline" glowColor="none" className="text-foreground border-border hover:bg-muted/50 cursor-pointer">
                View Spec Sheets <ArrowRight className="ml-2 h-4 w-4" />
              </GlowButton>
            </Link>
          </div>
        </div>

        {/* Product Cards */}
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {productsList.map((product) => (
            <GlassCard
              key={product.name}
              animateReveal={false}
              hoverEffect={true}
              className="border-border/10 flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header row */}
                <div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-4">
                    {product.icon}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                    {product.category}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-foreground mt-1">
                    {product.name}
                  </h3>
                </div>

                {/* Specs list */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
                    Specifications
                  </span>
                  <div className="space-y-2 border-t border-border/5 pt-2">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-mono text-foreground font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer row */}
              <div className="mt-8 pt-4 border-t border-border/5 flex flex-col space-y-4">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-muted-foreground/60">DEPLOYED TO:</span>
                  <span className="text-foreground font-semibold uppercase">{product.target}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
