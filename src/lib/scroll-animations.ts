/**
 * Scroll Animations — Global scroll-driven animations (reveal, parallax, text-clip).
 * Re-callable on each page navigation. Uses gsap.context() for cleanup.
 * Module-level variable replaces window._gsapCtx anti-pattern.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Module-level GSAP context — avoids polluting window global
let currentCtx: ReturnType<typeof gsap.context> | null = null;

// Debounce timer for lazy-image ScrollTrigger refresh
let lazyRefreshTimer: ReturnType<typeof setTimeout> | undefined;

/**
 * Cleanup the current GSAP scroll context (called by page-transitions before swap).
 */
export function cleanupScrollAnimations() {
  if (currentCtx) {
    currentCtx.revert();
    currentCtx = null;
  }
}

export function initScrollAnimations() {
  // Revert any previous gsap context
  cleanupScrollAnimations();

  currentCtx = gsap.context(() => {
    // Reveal on scroll — opacity + optional y shift (UX Narrative Cap. 2: "y: 20 -> 0").
    // When a wrapper contains children with scrub-based parallax (.fluid-element,
    // .section-title), the y shift on the parent disrupts the children's ScrollTrigger
    // position calculations, causing visible bounce as the scrub "catches up".
    // Fix: opacity-only reveal for wrappers with scrub children; full y+opacity for others.
    gsap.utils.toArray('.reveal-on-scroll').forEach((el: any) => {
      const hasScrubChildren = el.querySelector('.fluid-element, .section-title');
      if (hasScrubChildren) {
        gsap.fromTo(el,
          { opacity: 0 },
          { opacity: 1, duration: 1, scrollTrigger: { trigger: el, start: 'top 85%' } }
        );
      } else {
        gsap.fromTo(el,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, scrollTrigger: { trigger: el, start: 'top 85%' } }
        );
      }
    });

    // Text clip animations
    gsap.utils.toArray('.text-clip').forEach((el: any) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => el.classList.add('visible'),
      });
    });

    // Image reveal wrappers — zoom-out effect (Ken Burns style).
    // Scale 1.3 → 1.0. GSAP is the sole controller of transform (no CSS transitions).
    // ease: "none" because Lenis already smooths the scroll (Blueprint Cap. 2.3 / UX Cap. 3).
    // scrub: 1.5 for inertia at stop (Blueprint Cap. 4.5: "Scrub: 1 o 1.5").
    // invalidateOnRefresh: true so positions recalculate when lazy images load and
    // wrappers expand from 0-height to their natural size.
    gsap.utils.toArray('.img-reveal-wrapper').forEach((wrapper: any) => {
      const img = wrapper.querySelector('img');
      if (img) {
        gsap.fromTo(img,
          { scale: 1.3 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: wrapper, start: 'top bottom', end: 'bottom top', scrub: 1.5, invalidateOnRefresh: true } }
        );
      }
    });

    // Lazy-loaded images may not have dimensions when ScrollTrigger calculates positions.
    // Listen for their load events and debounce a single ScrollTrigger.refresh() so
    // all img-reveal ranges recalculate once wrappers have their final height.
    clearTimeout(lazyRefreshTimer);
    document.querySelectorAll('.img-reveal-wrapper img[loading="lazy"]').forEach((img) => {
      if (!(img as HTMLImageElement).complete) {
        img.addEventListener('load', () => {
          clearTimeout(lazyRefreshTimer);
          lazyRefreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
        }, { once: true });
      }
    });

    // Parallax images
    document.querySelectorAll('.parallax-bg, .parallax-img').forEach(img => {
      const speed = (img as HTMLElement).getAttribute('data-speed') || '0.2';
      gsap.to(img, {
        y: (parseFloat(speed) * 100) + '%',
        ease: 'none',
        scrollTrigger: { trigger: (img as HTMLElement).parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Fluid element parallax — deterministic speeds per element type.
    // Single querySelectorAll guarantees deduplication: elements matching multiple
    // selectors (e.g. h2.section-title.fluid-element) appear only ONCE in the NodeList,
    // preventing competing ScrollTriggers on the same `y` property.
    document.querySelectorAll('.fluid-element, .bento-card h3, .section-title').forEach((el) => {
      const speed = el.matches('.fluid-element') ? 15
        : el.matches('.bento-card h3') ? 10
        : 12; // .section-title only
      gsap.to(el, {
        y: -speed,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      });
    });
  });
}
