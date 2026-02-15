/**
 * Cursor — Custom cursor initialization and interaction management.
 * Handles dot/circle followers, magnetic effects, and scroll-mode states.
 */
import { gsap } from 'gsap';
import { MAGNETIC_STRENGTH, EASINGS } from './constants';

let cDot: HTMLElement | null = null;
let cCircle: HTMLElement | null = null;

export function initCursor() {
  // Skip cursor initialization entirely on touch devices (no mouse pointer)
  if (window.matchMedia('(pointer: coarse)').matches) return;

  cDot = document.querySelector('.c-dot') as HTMLElement;
  cCircle = document.querySelector('.c-circle') as HTMLElement;

  if (!cDot || !cCircle) return;

  const xSetDot = gsap.quickTo(cDot, 'x', { duration: 0.1, ease: 'power3' });
  const ySetDot = gsap.quickTo(cDot, 'y', { duration: 0.1, ease: 'power3' });
  const xSetCircle = gsap.quickTo(cCircle, 'x', { duration: 0.6, ease: 'power3' });
  const ySetCircle = gsap.quickTo(cCircle, 'y', { duration: 0.6, ease: 'power3' });

  window.addEventListener('mousemove', (e) => {
    xSetDot(e.clientX); ySetDot(e.clientY);
    xSetCircle(e.clientX); ySetCircle(e.clientY);
  });
}

export function initCursorInteractions() {
  // Skip cursor interactions entirely on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  if (!cDot || !cCircle) {
    cDot = document.querySelector('.c-dot') as HTMLElement;
    cCircle = document.querySelector('.c-circle') as HTMLElement;
  }
  if (!cDot || !cCircle) return;

  const circle = cCircle;

  // Hover states on interactive elements
  const interactives = document.querySelectorAll(
    'a, button, input, select, .clickable, .gallery-item, .config-option, .toggle-track, summary, .zoom-container, .cb-container, .mat-btn, .mood-slider, .next-chapter-footer'
  );
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => circle.classList.add('magnetic'));
    el.addEventListener('mouseleave', () => circle.classList.remove('magnetic'));
  });

  // Scroll context for horizontal sections
  const scrollSections = ['#elemental-flow', '#lifestyle-section', '#chronos-section', '#global-grid'];
  scrollSections.forEach(id => {
    const section = document.querySelector(id);
    if (section) {
      section.addEventListener('mouseenter', () => circle.classList.add('scroll-mode'));
      section.addEventListener('mouseleave', () => circle.classList.remove('scroll-mode'));
    }
  });

  // Magnetic effects on small interactive elements
  const magneticEls = document.querySelectorAll(
    'nav button, nav a, .fixed-ui button, .material-btn-bottom, .lightbox-nav-btn, .toggle-track, #cart-btn-label, #current-lang-display, .mat-btn'
  );
  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e: Event) => {
      const me = e as MouseEvent;
      const rect = (el as HTMLElement).getBoundingClientRect();
      const x = me.clientX - rect.left - rect.width / 2;
      const y = me.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * MAGNETIC_STRENGTH.BUTTON, y: y * MAGNETIC_STRENGTH.BUTTON, duration: 0.5, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: EASINGS.MAGNETIC });
    });
  });
}
