export const springSmooth = { type: 'spring' as const, stiffness: 120, damping: 20 }
export const springBouncy = { type: 'spring' as const, stiffness: 160, damping: 20 }
export const springGentle = { type: 'spring' as const, stiffness: 80, damping: 25 }
export const fadeIn = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as number[] }
export const fadeInSlow = { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as number[] }
