/**
 * Home Page Animations — GSAP <-> R3F Bridge.
 * Extracted from index.astro to eliminate duplication between root and [lang] pages.
 * Handles: table scroll choreography, day/night transitions, horizontal scroll, prefetching.
 *
 * Uses gsap.context() for proper cleanup during page transitions.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setTableRotation, setTableScale, setCanvasVisible, resetTableState, DEFAULT_TABLE_ROTATION } from '../store/sceneStore';
import { setDayMode } from '../store/configStore';

gsap.registerPlugin(ScrollTrigger);

// Module-level GSAP context for proper garbage collection
let ctx: ReturnType<typeof gsap.context> | null = null;
// Reference to the preloader-complete listener (must be removed manually — ctx.revert() only cleans GSAP)
let heroAnimListener: (() => void) | null = null;

/**
 * Cleanup all home page animations. Called automatically by page-transitions
 * via cleanupPageAnimations() or manually before re-init.
 */
export function cleanupHomePage() {
  if (ctx) {
    ctx.revert();
    ctx = null;
  }
  if (heroAnimListener) {
    window.removeEventListener('preloader-complete', heroAnimListener);
    heroAnimListener = null;
  }
}

export function initHomePage() {
  // Revert previous context if any (safety)
  cleanupHomePage();

  // Reset table to hero idle defaults (prevents stale state from previous navigation)
  resetTableState();

  // The base Y rotation from the hero idle state (angled view)
  const baseRy = DEFAULT_TABLE_ROTATION[1];

  ctx = gsap.context(() => {
    // ==========================================
    // BRIDGE: GSAP ScrollTrigger -> Nanostores -> R3F
    // Instead of animating Three.js objects directly,
    // we write to nanostores that HeroScene reads in useFrame.
    // ==========================================

    // Shared matchMedia instance for all responsive animations in this page.
    const mm = gsap.matchMedia();

    // ==========================================
    // TABLE SCROLL CHOREOGRAPHY (responsive)
    // Desktop/Tablet: scale ramp (1→1.5→2.5) + rotation
    // Mobile: rotation only (no scale changes)
    // ==========================================

    // Desktop/Tablet: full scale + rotation choreography
    mm.add('(min-width: 769px)', () => {
      // Table scale ramp: 1.0 -> 1.5 from page top to dark-void start.
      // STOPS at dark-void — the belly-view trigger takes over scale from 1.5 → 2.5.
      const scaleProxy = { value: 1.0 };
      gsap.to(scaleProxy, {
        value: 1.5,
        ease: 'none',
        onUpdate: () => setTableScale(scaleProxy.value),
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          endTrigger: '#dark-void-section',
          end: 'top bottom',
          scrub: 1,
        },
      });

      // Table rotation for dark void (underside view) + scale to 2.5.
      const rotProxy = { rx: DEFAULT_TABLE_ROTATION[0], scale: 1.5 };
      const revealTl = gsap.timeline({
        onUpdate: () => {
          setTableRotation([rotProxy.rx, baseRy, 0]);
          setTableScale(rotProxy.scale);
        },
        scrollTrigger: {
          trigger: '#dark-void-section',
          start: 'top bottom',
          end: 'center center',
          scrub: 1,
        },
      });
      revealTl
        .to(rotProxy, { rx: -Math.PI / 2, ease: 'power1.inOut', duration: 1 }, 0)
        .to(rotProxy, { scale: 2.5, ease: 'power1.inOut', duration: 1 }, 0);
    });

    // Mobile: rotation only, table stays at default scale
    mm.add('(max-width: 768px)', () => {
      const rotProxy = { rx: DEFAULT_TABLE_ROTATION[0] };
      gsap.to(rotProxy, {
        rx: -Math.PI / 2,
        ease: 'power1.inOut',
        onUpdate: () => setTableRotation([rotProxy.rx, baseRy, 0]),
        scrollTrigger: {
          trigger: '#dark-void-section',
          start: 'top bottom',
          end: 'center center',
          scrub: 1,
        },
      });
    });

    // ==========================================
    // HERO TEXT ANIMATIONS
    // ==========================================
    function startHeroAnimations() {
      gsap.to('#hero-text-content', { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.2 });
      gsap.to('#hero-price-content', { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.4 });
    }
    // Store reference for cleanup (ctx.revert() doesn't remove window listeners)
    heroAnimListener = startHeroAnimations;
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

    // Canvas fade on material section — ONLY use setCanvasVisible (nanostore).
    // NEVER use gsap.to('#r3f-canvas-root') for opacity — React controls that
    // via the isCanvasVisible store atom with CSS transition-opacity.
    // Canvas hides when MaterialSection's opaque bg-at-graphite fully covers the viewport.
    // 'top top' = the section's TOP edge reaches the viewport's TOP edge.
    // z-curtain (z-index:30) + opaque background ensure the 3D is visually covered before fade.
    ScrollTrigger.create({
      trigger: '#material-section',
      start: 'top top',
      onEnter: () => {
        setCanvasVisible(false); // Hides canvas + pauses Three.js frameloop
      },
      onLeaveBack: () => {
        setCanvasVisible(true); // Shows canvas + resumes Three.js frameloop
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
        scrollTrigger: { trigger: theme.id, start: 'top 80%', end: 'top 60%', scrub: 1 },
      });
    });

    // ==========================================
    // HORIZONTAL SCROLL SECTIONS
    // ==========================================

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

    // Lifestyle horizontal scroll — initialised SYNCHRONOUSLY (no setTimeout).
    // All pins must be created before ScrollTrigger.refresh() so that elements
    // below them (EsteticaGrid, HeritageSection, DetailsSection) get correct positions.
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

    // Marquee
    gsap.to('.animate-marquee', { xPercent: -50, repeat: -1, duration: 20, ease: 'linear' });

  }); // end gsap.context

  // Prefetch configurator assets (outside context — it's a one-time side effect)
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
