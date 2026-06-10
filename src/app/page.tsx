import { GridBackground } from "@/components/ui/grid-background";
import { Hero } from "@/sections/hero";
import { Problem } from "@/sections/problem";
import { Solution } from "@/sections/solution";
import { TechnologyFlow } from "@/sections/technology-flow";
import { Research } from "@/sections/research";
import { Products } from "@/sections/products";
import { SustainabilityImpact } from "@/sections/sustainability-impact";
import { Achievements } from "@/sections/achievements";
import { CTAs } from "@/sections/ctas";

export default function Home() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Dynamic Grid Background with Glows */}
      <GridBackground showGlow={true} glowPosition="top" animateReveal={true} />

      {/* Landing page sections */}
      <Hero />
      <Problem />
      <Solution />
      <TechnologyFlow />
      <Research />
      <Products />
      <SustainabilityImpact />
      <Achievements />
      <CTAs />
    </div>
  );
}
