/**
 * Animation Utilities & Reusable GSAP Configurations
 */

import { EASINGS } from './constants';

// Curtain Transition Configuration
export const curtainTransition = {
  duration: 1.2,
  ease: EASINGS.CURTAIN,
};

// Reveal Animation Configuration
export const revealAnimation = {
  duration: 1.0,
  ease: EASINGS.REVEAL,
};

// Magnetic Element Configuration
export const magneticConfig = {
  ease: EASINGS.MAGNETIC,
  duration: 0.4,
};

// Parallax Scroll Configuration
export const parallaxConfig = {
  ease: EASINGS.SMOOTH_SCROLL,
  scrub: 1.5,
};

/**
 * Lerp (Linear Interpolation) utility
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Clamp utility
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map range utility
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Get mouse position relative to element
 */
export function getMousePosition(event: MouseEvent, element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left - rect.width / 2,
    y: event.clientY - rect.top - rect.height / 2,
  };
}
