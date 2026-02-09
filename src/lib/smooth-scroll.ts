/**
 * Smooth Scroll — Lenis initialization and GSAP ticker sync.
 * Single source of truth for scroll behavior.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Force manual scroll restoration
if (typeof window !== 'undefined' && history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

let lenisInstance: Lenis | null = null;

export function initSmoothScroll(): Lenis {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    // @ts-ignore - Lenis types may vary
    direction: 'vertical',
    smooth: true,
  });

  lenisInstance.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time: number) => { lenisInstance!.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export { gsap, ScrollTrigger, ScrollToPlugin };
