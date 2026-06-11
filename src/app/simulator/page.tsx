import type { Metadata } from "next";
import { Suspense } from "react";
import { GridBackground } from "@/components/ui/grid-background";
import { SimulatorSkeleton } from "./loading";
import { DynamicSimulator } from "./dynamic-simulator";

export const metadata: Metadata = {
  title: "Waste-to-Energy Impact Simulator | Green Cycle Sentinel",
  description:
    "Visualize how much clean energy, carbon reduction, and landfill diversion your waste can generate with Green Cycle Sentinel's interactive Waste-to-Energy Simulator.",
  openGraph: {
    title: "Waste-to-Energy Impact Simulator | Green Cycle Sentinel",
    description:
      "Simulate converting plastic, organic, agricultural, paper, textile, and mixed waste into clean energy. See your environmental impact live.",
    type: "website",
  },
};

export default function SimulatorPage() {
  return (
    <div className="relative min-h-screen py-12 sm:py-16 overflow-hidden">
      <GridBackground showGlow={true} glowPosition="top" animateReveal={true} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Suspense fallback={<SimulatorSkeleton />}>
          <DynamicSimulator />
        </Suspense>
      </div>
    </div>
  );
}
