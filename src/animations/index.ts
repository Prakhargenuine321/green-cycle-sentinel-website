import { Variants } from "framer-motion";

/**
 * Green Cycle Sentinel - Standardized Framer Motion Transition Presets & Variants
 */

// Premium easing curve (easeOutQuart - sleek, modern deceleration)
export const EASE_PRESET: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Interactive spring physics configurations
export const SPRING_PRESETS = {
  gentle: {
    type: "spring",
    stiffness: 100,
    damping: 15,
  },
  interactive: {
    type: "spring",
    stiffness: 260,
    damping: 20,
  },
  bouncy: {
    type: "spring",
    stiffness: 400,
    damping: 15,
  },
} as const;

// Transition presets
export const TRANSITION_PRESETS = {
  default: {
    duration: 0.6,
    ease: EASE_PRESET,
  },
  fast: {
    duration: 0.3,
    ease: EASE_PRESET,
  },
  slow: {
    duration: 1.0,
    ease: EASE_PRESET,
  },
} as const;

// Staggered layout entrances
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Stagger child base animation
export const staggerChildFadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_PRESET,
    },
  },
};

// Standalone motion configurations
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_PRESET,
    },
  },
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_PRESET,
    },
  },
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const scaleUp: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: EASE_PRESET,
    },
  },
};

export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: EASE_PRESET,
    },
  },
};

export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: EASE_PRESET,
    },
  },
};
