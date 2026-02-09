/**
 * Home Page Animations — GSAP <-> R3F Bridge.
 * Extracted from index.astro to eliminate duplication between root and [lang] pages.
 * Handles: table scroll choreography, day/night transitions, horizontal scroll, prefetching.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setTableRotation, setTableScale } from '../store/sceneStore';
import { setDayMode } from '../store/configStore';

gsap.registerPlugin(ScrollTrigger);

export function initHomePage() {
  // ==========================================
  // BRIDGE: GSAP ScrollTrigger -> Nanostores -> R3F
  // Instead of animating Three.js objects directly,
  // we write to nanostores that HeroScene reads in useFrame.
  // ==========================================

  // Table scale ramp: 1.0 -> 1.5 as user scrolls to material section
  const scaleProxy = { value: 1.0 };
  gsap.to(scaleProxy, {
    value: 1.5,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      endTrigger: '#material-section',
      end: 'top center',
      scrub: 1,
      onUpdate: () => setTableScale(scaleProxy.value),
    },
  });

  // Table rotation for dark void (underside view) + scale to 2.5
  const rotProxy = { rx: 0.1, scale: 1.5 };
  const revealTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#dark-void-section',
      start: 'top bottom',
      end: 'center center',
      scrub: 2,
      onUpdate: () => {
        setTableRotation([rotProxy.rx, 0, 0]);
        setTableScale(rotProxy.scale);
      },
    },
  });
  revealTl
    .to(rotProxy, { rx: -Math.PI / 2, ease: 'power1.inOut', duration: 1 }, 0)
    .to(rotProxy, { scale: 2.5, ease: 'power1.inOut', duration: 1 }, 0);

  // ==========================================
  // HERO TEXT ANIMATIONS
  // ==========================================
  function startHeroAnimations() {
    gsap.to('#hero-text-content', { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.2 });
    gsap.to('#hero-price-content', { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.4 });
  }
  window.addEventListener('preloader-complete', startHeroAnimations);

  // ==========================================
  // TECH SECTION PIN + DAY-TO-NIGHT (via nanostores)
  // ==========================================
  const techSection = document.getElementById('tech-section');
  if (techSection) {
    const techTl = gsap.timeline({
      scrollTrigger: {
        trigger: techSection,
        start: 'top top',
        end: '+=2000',
        pin: true,
        scrub: 1,
      },
    });

    techTl
      .to('body', { backgroundColor: '#1C1B1A', color: '#F2F0EB', duration: 1 })
      .to('.glass-nav', { color: '#F2F0EB', duration: 1 }, '<')
      .add(() => setDayMode(false), '<')
      .to('#tech-text', { opacity: 1, y: 0, duration: 1.5 }, '-=0.5');
  }

  // Fixed hero text fade on tech section
  gsap.to('#fixed-hero-text', {
    opacity: 0,
    pointerEvents: 'none',
    scrollTrigger: { trigger: '#tech-section', start: 'top center', end: 'center center', scrub: true },
  });

  // Canvas fade on material section (R3F canvas wrapper)
  ScrollTrigger.create({
    trigger: '#material-section',
    start: 'top center',
    onEnter: () => gsap.to('#r3f-canvas-root', { autoAlpha: 0, duration: 0.5 }),
    onLeaveBack: () => {
      gsap.to('#r3f-canvas-root', { autoAlpha: 1, duration: 0.5 });
      // Restore day mode when scrolling back up
      setDayMode(true);
    },
  });

  // ==========================================
  // THEME SWITCHES
  // ==========================================
  const themeSwitches = [
    { id: '#genesis-section', bg: '#F2F0EB', col: '#2D2A26' },
    { id: '#smart-context-section', bg: '#1C1B1A', col: '#F2F0EB' },
    { id: '#lifestyle-section', bg: '#F2F0EB', col: '#2D2A26' },
  ];
  themeSwitches.forEach(theme => {
    gsap.to('body', {
      backgroundColor: theme.bg,
      color: theme.col,
      scrollTrigger: { trigger: theme.id, start: 'top 60%', end: 'top 40%', scrub: 1 },
    });
  });

  // ==========================================
  // HORIZONTAL SCROLL SECTIONS
  // ==========================================
  const mm = gsap.matchMedia();

  function initHScroll(sectionId: string, containerClass: string) {
    const hSection = document.getElementById(sectionId);
    if (hSection) {
      const hContainer = hSection.querySelector(containerClass);
      if (!hContainer) return;
      const panels = gsap.utils.toArray('.h-scroll-panel', hContainer);
      mm.add('(min-width: 769px)', () => {
        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: hSection,
            pin: true,
            scrub: 1,
            end: () => '+=' + (hContainer as HTMLElement).offsetWidth,
          },
        });
      });
    }
  }

  initHScroll('elemental-flow', '.h-scroll-container-home');

  // Lifestyle horizontal scroll
  function initLifestyleScroll() {
    const lsSection = document.getElementById('lifestyle-section');
    const lsTrack = lsSection?.querySelector('.lifestyle-track') as HTMLElement | null;
    if (lsSection && lsTrack) {
      mm.add('(min-width: 769px)', () => {
        const viewportWidth = (lsTrack.parentElement as HTMLElement).offsetWidth;
        const trackWidth = lsTrack.scrollWidth;
        let scrollAmount = trackWidth - viewportWidth;
        if (scrollAmount < 0) scrollAmount = 0;
        gsap.to(lsTrack, {
          x: -scrollAmount,
          ease: 'none',
          scrollTrigger: {
            trigger: lsSection,
            pin: true,
            scrub: 1,
            end: () => '+=' + (scrollAmount + 500),
          },
        });
      });
    }
  }
  setTimeout(initLifestyleScroll, 100);

  // Marquee
  gsap.to('.animate-marquee', { xPercent: -50, repeat: -1, duration: 20, ease: 'linear' });

  // Prefetch configurator assets
  window.addEventListener(
    'preloader-complete',
    () => {
      const prefetchGlb = document.createElement('link');
      prefetchGlb.rel = 'prefetch';
      prefetchGlb.href = '/models/Tavolo_lowpoly.glb';
      prefetchGlb.as = 'fetch';
      prefetchGlb.setAttribute('crossorigin', 'anonymous');
      document.head.appendChild(prefetchGlb);
      ['/textures/wood_oak_color.jpg', '/textures/wood_oak_normal.jpg', '/textures/wood_oak_roughness.jpg'].forEach(src => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
      });
    },
    { once: true }
  );
}
