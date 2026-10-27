// Luxury Awwwards-grade Bezier Curves
export const EASE_EDITORIAL = [0.16, 1, 0.3, 1];     // Power4.out / Expo.out: weighted, decisive deceleration
export const EASE_IN_OUT = [0.76, 0, 0.24, 1];       // Power4.inOut: dramatic section shifts
export const EASE_SPRING = [0.34, 1.56, 0.64, 1];    // Back.out: spring-like bounce
export const EASE_SMOOTH = [0.22, 1, 0.36, 1];       // Natural smooth

/**
 * Standard fadeIn transition with luxury deceleration
 */
export const fadeIn = (direction, delay = 0, opacity = true, duration = 0.75) => {
  const yOffset =
    direction === 'up'
      ? 28
      : direction === 'down'
      ? -28
      : direction === 'up1'
      ? 16
      : 0;
  const xOffset =
    direction === 'left' ? 28 : direction === 'right' ? -28 : 0;

  return {
    hidden: {
      y: yOffset,
      x: xOffset,
      opacity: opacity ? 0 : 1,
      scale: 0.98,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: EASE_EDITORIAL,
      },
    },
  };
};

/**
 * Editorial headline masked line-reveal variant
 */
export const heroHeadlineVariants = {
  hidden: {
    y: '108%',
    opacity: 0,
    rotateZ: 1.2,
  },
  show: (customDelay = 0) => ({
    y: '0%',
    opacity: 1,
    rotateZ: 0,
    transition: {
      duration: 0.85,
      delay: customDelay,
      ease: EASE_EDITORIAL,
    },
  }),
};

/**
 * Staggered container for grids and chip lists
 */
export const staggerContainer = (staggerChildren = 0.06, delayChildren = 0.04) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/**
 * Organic doodle entrance with tactile spring stamp settle
 */
export const doodleEntrance = (delay = 0, initialRotate = -10) => ({
  hidden: {
    opacity: 0,
    scale: 0.35,
    rotate: initialRotate,
    y: 12,
  },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    y: 0,
    transition: {
      type: 'spring',
      damping: 18,
      stiffness: 190,
      mass: 0.85,
      delay,
    },
  },
});

/**
 * 3D Editorial Card Entrance with perspective depth
 */
export const cardEntrance = (index = 0) => ({
  hidden: {
    opacity: 0,
    y: 32,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.68,
      delay: Math.min(0.06 * index, 0.32),
      ease: EASE_EDITORIAL,
    },
  },
});

/**
 * Status banner & section presence transitions
 */
export const statusPresence = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: EASE_EDITORIAL,
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.98,
    transition: {
      duration: 0.28,
      ease: EASE_SMOOTH,
    },
  },
};

/**
 * Modal Backdrop & Surface Animation Presets
 */
export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.28, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const modalPanel = {
  hidden: {
    opacity: 0,
    scale: 0.93,
    y: 24,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 28,
      stiffness: 340,
      mass: 0.9,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 16,
    transition: {
      duration: 0.2,
      ease: EASE_EDITORIAL,
    },
  },
};
