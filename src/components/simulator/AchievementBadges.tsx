"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BADGES, Badge, getUnlockedBadges } from "@/lib/simulator-data";

interface AchievementBadgesProps {
  quantityKg: number;
}

function BadgeItem({
  badge,
  isUnlocked,
  isNew,
}: {
  badge: Badge;
  isUnlocked: boolean;
  isNew: boolean;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative flex flex-col items-center gap-1.5" role="status">
      <AnimatePresence mode="wait">
        {isUnlocked ? (
          <motion.div
            key="unlocked"
            initial={
              prefersReduced || !isNew
                ? false
                : { scale: 0.3, opacity: 0, rotate: -10 }
            }
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={
              isNew && !prefersReduced
                ? { type: "spring", stiffness: 500, damping: 20 }
                : { duration: 0 }
            }
            className="relative"
            aria-label={`Badge unlocked: ${badge.label}`}
          >
            {/* Burst rings on new unlock */}
            {isNew && !prefersReduced && (
              <>
                {[1, 2, 3].map((ring) => (
                  <motion.div
                    key={ring}
                    className="absolute inset-0 rounded-2xl border"
                    style={{ borderColor: badge.color }}
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.5 + ring * 0.3, opacity: 0 }}
                    transition={{ duration: 0.6, delay: ring * 0.1, ease: "easeOut" }}
                  />
                ))}
              </>
            )}

            <div
              className="badge-shimmer h-14 w-14 rounded-2xl flex items-center justify-center text-2xl border-2 cursor-default"
              style={{
                borderColor: badge.color,
                backgroundColor: `${badge.color}18`,
                boxShadow: `0 0 20px ${badge.color}40, 0 0 8px ${badge.color}30`,
              }}
              title={badge.description}
            >
              {badge.emoji}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="locked"
            className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl border-2 border-dashed border-border/20 bg-muted/20 grayscale opacity-30"
            aria-label={`Badge locked: ${badge.label} (unlock at ${badge.thresholdKg.toLocaleString()}kg)`}
            title={`Unlock at ${badge.thresholdKg.toLocaleString()}kg`}
          >
            🔒
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <p
          className="text-[9px] font-semibold leading-tight transition-colors duration-300"
          style={{ color: isUnlocked ? badge.color : "oklch(from var(--muted-foreground) l c h / 0.5)" }}
        >
          {badge.label.split(" ").slice(0, 2).join(" ")}
        </p>
        <p className="text-[8px] font-mono text-muted-foreground/40">
          {badge.thresholdKg >= 1000
            ? `${badge.thresholdKg / 1000}t+`
            : `${badge.thresholdKg}kg+`}
        </p>
      </div>
    </div>
  );
}

export function AchievementBadges({ quantityKg }: AchievementBadgesProps) {
  const unlockedIds = new Set(getUnlockedBadges(quantityKg).map((b) => b.id));

  // Track which badges are *newly* unlocked this render cycle.
  // The ref stores the previous set; the state drives the render.
  // Both are only accessed inside the effect (never during render) to
  // satisfy React 19's rule: refs must not be read during the render phase.
  const prevUnlockedRef = useRef(new Set<string>());
  const [newlyUnlocked, setNewlyUnlocked] = useState(new Set<string>());

  useEffect(() => {
    const prev = prevUnlockedRef.current;
    const justUnlocked = new Set(
      [...unlockedIds].filter((id) => !prev.has(id))
    );
    if (justUnlocked.size > 0) {
      setNewlyUnlocked(justUnlocked);
    }
    prevUnlockedRef.current = new Set(unlockedIds);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantityKg]);

  const unlockedCount = unlockedIds.size;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-heading font-semibold text-foreground">
            Achievements
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            ({unlockedCount}/{BADGES.length} unlocked)
          </span>
        </div>
        {unlockedCount === BADGES.length && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-semibold"
          >
            ALL UNLOCKED 🎉
          </motion.div>
        )}
      </div>

      {/* Progress track */}
      <div className="relative h-1 bg-border/20 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          animate={{ width: `${(unlockedCount / BADGES.length) * 100}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: `linear-gradient(to right, oklch(0.72 0.18 147), oklch(0.70 0.20 200), oklch(0.68 0.22 320))`,
            boxShadow: "0 0 8px oklch(0.72 0.18 147 / 0.5)",
          }}
        />
      </div>

      {/* Badge grid */}
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 themed-scrollbar">
        {BADGES.map((badge) => (
          <div key={badge.id} className="shrink-0">
            <BadgeItem
              badge={badge}
              isUnlocked={unlockedIds.has(badge.id)}
              isNew={newlyUnlocked.has(badge.id)}
            />
          </div>
        ))}
      </div>

      {/* Next badge hint */}
      {unlockedCount < BADGES.length && (
        <motion.p
          key={unlockedCount}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-[10px] text-muted-foreground font-mono"
        >
          Next:{" "}
          <span className="text-foreground font-semibold">
            {BADGES[unlockedCount].emoji} {BADGES[unlockedCount].label}
          </span>{" "}
          — slide to{" "}
          <span className="text-primary">
            {BADGES[unlockedCount].thresholdKg >= 1000
              ? `${BADGES[unlockedCount].thresholdKg / 1000}t`
              : `${BADGES[unlockedCount].thresholdKg}kg`}
          </span>
        </motion.p>
      )}
    </div>
  );
}
