/**
 * Contact Page Animations — Cities horizontal scroll + form interactions.
 * Extracted from contact.astro to eliminate duplication between root and [lang] pages.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initContactPage() {
  const mm = gsap.matchMedia();

  // Horizontal scroll cities
  const citiesSection = document.getElementById('global-grid');
  if (citiesSection) {
    const hContainer = citiesSection.querySelector('.h-scroll-container-contact');
    if (hContainer) {
      const panels = gsap.utils.toArray('.h-scroll-panel', hContainer);
      mm.add('(min-width: 769px)', () => {
        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: citiesSection,
            pin: true,
            scrub: 1,
            end: () => '+=' + (hContainer as HTMLElement).offsetWidth,
          },
        });
      });
    }
  }

  // Form validation visual
  document.querySelectorAll('.minimal-input').forEach(input => {
    input.addEventListener('input', () => {
      const el = input as HTMLInputElement;
      el.classList.toggle('valid', el.value.trim().length > 0);
    });
  });

  // Form submission
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const toast = document.getElementById('order-confirmation-toast');
      if (toast) {
        const h4 = toast.querySelector('h4');
        const p = toast.querySelector('p');
        if (h4) h4.innerText = 'Messaggio Inviato';
        if (p) p.innerText = 'Ti risponderemo entro 24 ore.';
        gsap.to(toast, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.6 });
        setTimeout(() => { gsap.to(toast, { opacity: 0, y: -20, pointerEvents: 'none', duration: 0.6 }); }, 4000);
      }
      (form as HTMLFormElement).reset();
      document.querySelectorAll('.minimal-input').forEach(i => i.classList.remove('valid'));
    });
  }
}
