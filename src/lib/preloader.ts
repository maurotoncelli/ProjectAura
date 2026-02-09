/**
 * Preloader — First-visit preloader sequence and direct-load fallback.
 * Uses custom events instead of window globals for inter-component communication.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';
import { EASINGS } from './constants';

export function initPreloader(lenis: Lenis) {
  window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    const isHome = document.body.dataset.page === 'home';
    const preloader = document.getElementById('preloader');
    const alreadyVisited = sessionStorage.getItem('aether-visited');

    if (isHome && !alreadyVisited && preloader) {
      // Full preloader sequence on home page (first visit only)
      lenis.stop();
      document.body.style.overflow = 'hidden';
      sessionStorage.setItem('aether-visited', '1');

      const tl = gsap.timeline();
      tl.to('#preloader-text-1', { opacity: 1, duration: 1.5, ease: EASINGS.REVEAL })
        .to('#preloader-text-1', { opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=0.5')
        .to('#preloader-text-2', { opacity: 1, scale: 1, duration: 1.5, ease: EASINGS.REVEAL })
        .to('#preloader-text-2', { opacity: 0, scale: 1.1, duration: 0.8, ease: 'power2.in' }, '+=0.8')
        .to('#preloader', { yPercent: -100, duration: 1.2, ease: EASINGS.CURTAIN })
        .to('#custom-cursor', { opacity: 1, duration: 0.5 }, '-=0.5')
        .add(() => {
          lenis.start();
          document.body.style.overflow = '';
          window.dispatchEvent(new CustomEvent('preloader-complete'));
          ScrollTrigger.refresh();
          // Fire cookie banner event after delay (clean event-based communication)
          setTimeout(() => window.dispatchEvent(new CustomEvent('cookie-banner:show')), 3500);
        }, '-=0.5');

    } else {
      // Direct page load (no transition, no preloader)
      if (preloader) preloader.style.display = 'none';
      document.body.style.overflow = '';
      const cursor = document.getElementById('custom-cursor');
      if (cursor) cursor.style.opacity = '1';
      lenis.start();
      window.dispatchEvent(new CustomEvent('preloader-complete'));
      ScrollTrigger.refresh();
      setTimeout(() => window.dispatchEvent(new CustomEvent('cookie-banner:show')), 2000);
    }
  });
}
