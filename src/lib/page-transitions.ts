/**
 * Page Transitions — Astro View Transitions + Curtain Effect.
 * Handles before-preparation, before-swap, after-swap, and page-load lifecycle.
 */
import { gsap } from 'gsap';
import { EASINGS } from './constants';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';
import { setActiveScene } from '../store/sceneStore';
import { initScrollAnimations, cleanupScrollAnimations } from './scroll-animations';
import { initCursorInteractions } from './cursor';

export function initPageTransitions(lenis: Lenis) {
  // Step 1: BEFORE navigation — Curtain RISES from bottom
  document.addEventListener('astro:before-preparation', (ev: any) => {
    const overlay = document.getElementById('transition-overlay');
    if (!overlay) return;

    const originalLoader = ev.loader;
    ev.loader = async () => {
      lenis.stop();
      gsap.set(overlay, { transformOrigin: 'bottom', scaleY: 0, pointerEvents: 'auto' });
      await new Promise<void>(resolve => {
        gsap.to(overlay, { scaleY: 1, duration: 0.8, ease: EASINGS.CURTAIN, onComplete: resolve });
      });
      await originalLoader();
    };
  });

  // Step 2: BEFORE swap — Clean up old page
  document.addEventListener('astro:before-swap', () => {
    // Revert gsap.context (module-level cleanup, no window global)
    cleanupScrollAnimations();
    ScrollTrigger.getAll().forEach(t => t.kill());
    document.body.style.backgroundColor = '';
    document.body.style.color = '';
    document.body.classList.remove('active-night');

    // Set scene to NONE during transition
    setActiveScene('NONE');
  });

  // Step 3: AFTER swap — Curtain FALLS, reveal new page
  document.addEventListener('astro:after-swap', () => {
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });

    // Set active scene based on new page
    const newPage = document.body.dataset.page;
    if (newPage === 'home') {
      setActiveScene('HERO');
    } else if (newPage === 'configurator') {
      setActiveScene('CONFIGURATOR');
    } else {
      setActiveScene('NONE');
    }

    const overlay = document.getElementById('transition-overlay');
    if (overlay) {
      gsap.set(overlay, { transformOrigin: 'top' });
      const revealTl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { pointerEvents: 'none' });
          lenis.start();
          window.dispatchEvent(new CustomEvent('preloader-complete'));
          ScrollTrigger.refresh();
        }
      });

      revealTl.to(overlay, { scaleY: 0, duration: 0.8, ease: EASINGS.CURTAIN })
        .fromTo('main h1, main h2, main .hero-title, main .fluid-element',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: EASINGS.REVEAL, stagger: 0.1 }, '-=0.4');
    } else {
      lenis.start();
      ScrollTrigger.refresh();
    }
  });

  // Step 4: PAGE LOAD — Re-init per-page animations
  document.addEventListener('astro:page-load', () => {
    initScrollAnimations();
    initCursorInteractions();
  });
}
