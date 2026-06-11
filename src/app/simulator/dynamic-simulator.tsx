"use client";

/**
 * Client Component wrapper for the dynamic import with ssr:false.
 * Required by Next.js 16+ — ssr:false in dynamic() is not allowed in Server Components.
 * This thin client shell keeps the page.tsx as a Server Component for metadata/SEO.
 */
import dynamic from "next/dynamic";
import { SimulatorSkeleton } from "@/app/simulator/loading";

export const DynamicSimulator = dynamic(
  () =>
    import("@/components/simulator/WasteToEnergySimulator").then(
      (m) => m.WasteToEnergySimulator
    ),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton />,
  }
);
