/**
 * Simulator loading skeleton — shown by Next.js Suspense while the dynamic
 * client chunk (WasteToEnergySimulator) is being fetched and hydrated.
 */
export function SimulatorSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-label="Loading simulator..." aria-busy="true">
      {/* Header skeleton */}
      <div className="text-center space-y-4 mb-12">
        <div className="mx-auto h-6 w-52 rounded-full bg-muted/40" />
        <div className="mx-auto h-10 w-96 rounded-xl bg-muted/40 max-w-full" />
        <div className="mx-auto h-5 w-80 rounded-lg bg-muted/30 max-w-full" />
      </div>

      {/* Step 1 skeleton */}
      <div className="rounded-3xl border border-border/10 bg-card/30 p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-muted/40" />
          <div className="h-5 w-32 rounded-lg bg-muted/40" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[100px] rounded-2xl bg-muted/25" />
          ))}
        </div>
      </div>

      {/* Step 2 skeleton */}
      <div className="rounded-3xl border border-border/10 bg-card/30 p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-muted/40" />
          <div className="h-5 w-40 rounded-lg bg-muted/40" />
        </div>
        <div className="h-10 w-40 rounded-xl bg-muted/40" />
        <div className="h-4 w-full rounded-full bg-muted/30" />
      </div>

      {/* Step 3 skeleton */}
      <div className="rounded-3xl border border-border/10 bg-card/30 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-muted/40" />
          <div className="h-5 w-36 rounded-lg bg-muted/40" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted/25" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SimulatorSkeleton;
