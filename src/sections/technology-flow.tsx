"use client";

import React, { useState } from "react";
import { Cpu, RefreshCw, Zap, Wind, Database, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface FlowStep {
  number: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  techStat: string;
}

const flowSteps: FlowStep[] = [
  {
    number: "01",
    icon: <Database className="h-5 w-5" />,
    title: "Collection Grid",
    subtitle: "IoT Telemetry Intake",
    description: "Refuse bins report filling status to a centralized algorithm, dispatching routes for efficient collection.",
    techStat: "Sensor Update: 1.5s",
  },
  {
    number: "02",
    icon: <Cpu className="h-5 w-5" />,
    title: "Pellet Processing",
    subtitle: "Fuel Conditioning",
    description: "Refuse is shredded, dried, and compressed into organic briquettes of optimized size for gasification.",
    techStat: "Dry Index: < 10% H2O",
  },
  {
    number: "03",
    icon: <RefreshCw className="h-5 w-5" />,
    title: "Gasification Reactor",
    subtitle: "Zero-Combustion Gas yield",
    description: "Hydrocarbon chains are gasified at high temperatures inside oxygen-lean reactors to create clean syngas.",
    techStat: "Reactor Temp: 1200°C",
  },
  {
    number: "04",
    icon: <Zap className="h-5 w-5" />,
    title: "Syngas Turbine",
    subtitle: "Power Feed Grid",
    description: "Refined syngas drives gas turbines, generating electricity feeds directly into municipal infrastructure grids.",
    techStat: "Net Efficiency: 42.8%",
  },
  {
    number: "05",
    icon: <Wind className="h-5 w-5" />,
    title: "Air Scrubber & AQI",
    subtitle: "Emission Sanitization",
    description: "Ionizers clean particulate traces, while sensors publish live outdoor AQI levels to verification dashboards.",
    techStat: "Particulate Capture: 99.8%",
  },
];

export function TechnologyFlow() {
  const [activeStep, setActiveStep] = useState(2); // Default highlight Reactor step

  return (
    <section className="relative py-20 overflow-hidden bg-background/30">
      {/* Background connecting track lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-xs text-primary font-medium mb-4">
            <RefreshCw className="h-3.5 w-3.5 text-primary animate-spin" style={{ animationDuration: '6s' }} />
            <span>Interactive Technology Loop</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            From Refuse Intake to <span className="text-gradient-green">Municipal Power</span>
          </h2>
          <p className="text-base text-muted-foreground mt-4 leading-relaxed">
            Follow the flow sequence detailing how Sentinel nodes convert physical landfill waste outputs into clean syngas and localized grid power.
          </p>
        </div>

        {/* Desktop Stepper (Horizontal) */}
        <div className="hidden lg:flex flex-row items-stretch justify-between relative gap-4">
          {/* Connector line behind cards */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border/20 -translate-y-1/2 -z-10" />

          {flowSteps.map((step, idx) => {
            const isActive = idx === activeStep;
            return (
              <GlassCard
                key={step.number}
                animateReveal={true}
                delay={idx * 0.1}
                hoverEffect={false}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "flex-1 flex flex-col justify-between p-5 border-border/10 cursor-pointer transition-all duration-300 relative select-none",
                  isActive
                    ? "border-primary/50 shadow-[0_0_25px_oklch(from_var(--primary)_l_c_h_/_0.12)] scale-[1.03]"
                    : "opacity-60 hover:opacity-100 hover:scale-[1.01]"
                )}
              >
                {/* Visual connectors */}
                {idx < flowSteps.length - 1 && (
                  <ChevronRight className="absolute top-1/2 -right-3.5 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 pointer-events-none z-20" />
                )}

                <div className="space-y-4">
                  {/* Step Row info */}
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-[10px] font-mono text-muted-foreground">
                      STAGE {step.number}
                    </span>
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center border",
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border/10"
                      )}
                    >
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="font-heading text-base font-bold text-foreground leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div
                  className={cn(
                    "mt-4 pt-3 border-t border-border/5 text-[9px] font-mono tracking-wider",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground/60"
                  )}
                >
                  {step.techStat}
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Mobile Stepper (Vertical Stack) */}
        <div className="flex lg:hidden flex-col space-y-6 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-6 top-4 bottom-4 w-[2px] bg-border/20 -z-10" />

          {flowSteps.map((step, idx) => {
            const isActive = idx === activeStep;
            return (
              <GlassCard
                key={step.number}
                animateReveal={true}
                delay={idx * 0.05}
                hoverEffect={false}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "flex flex-row items-start space-x-4 p-5 border-border/10 cursor-pointer select-none transition-all duration-300",
                  isActive
                    ? "border-primary/50 shadow-[0_0_20px_oklch(from_var(--primary)_l_c_h_/_0.1)]"
                    : "opacity-75 hover:opacity-100"
                )}
              >
                {/* Step circle */}
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center border shrink-0 z-10",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border/10"
                  )}
                >
                  {step.icon}
                </div>

                <div className="flex-grow space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      STAGE {step.number}
                    </span>
                    <span className="text-[9px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/10">
                      {step.techStat}
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
