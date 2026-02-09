/**
 * Scroll Animations — Global scroll-driven animations (reveal, parallax, text-clip).
 * Re-callable on each page navigation. Uses gsap.context() for cleanup.
 * Module-level variable replaces window._gsapCtx anti-pattern.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Module-level GSAP context — avoids polluting window global
let currentCtx: ReturnType<typeof gsap.context> | null = null;

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
    // Reveal on scroll
    gsap.utils.toArray('.reveal-on-scroll').forEach((el: any) => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, scrollTrigger: { trigger: el, start: 'top 85%' } }
      );
    });

    // Text clip animations
    gsap.utils.toArray('.text-clip').forEach((el: any) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => el.classList.add('visible'),
      });
    });

    // Image reveal wrappers
    gsap.utils.toArray('.img-reveal-wrapper').forEach((wrapper: any) => {
      const img = wrapper.querySelector('img');
      if (img) {
        gsap.fromTo(img,
          { scale: 1.3 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: wrapper, start: 'top bottom', end: 'bottom top', scrub: true } }
        );
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

    // Fluid element parallax
    document.querySelectorAll('.fluid-element, .bento-card h3, .section-title').forEach((el) => {
      const speed = 10 + Math.random() * 20;
      gsap.to(el, {
        y: -speed,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      });
    });
  });
}
