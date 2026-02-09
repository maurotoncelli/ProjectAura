/**
 * About Page Animations — Chronos horizontal scroll + marquee.
 * Extracted from about.astro to eliminate duplication between root and [lang] pages.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAboutPage() {
  const mm = gsap.matchMedia();

  // Chronos horizontal scroll
  const chronosSection = document.getElementById('chronos-section');
  if (chronosSection) {
    const hContainer = chronosSection.querySelector('.h-scroll-container');
    if (hContainer) {
      const panels = gsap.utils.toArray('.h-scroll-panel', hContainer);
      mm.add('(min-width: 769px)', () => {
        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: chronosSection,
            pin: true,
            scrub: 1,
            end: () => '+=' + (hContainer as HTMLElement).offsetWidth,
          },
        });
      });
    }
  }

  // Marquee
  gsap.to('.animate-marquee', { xPercent: -50, repeat: -1, duration: 20, ease: 'linear' });
}
