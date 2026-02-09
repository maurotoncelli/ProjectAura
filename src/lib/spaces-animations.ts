/**
 * Spaces Page Animations — Gallery filter + lightbox trigger.
 * Extracted from spaces.astro to eliminate duplication between root and [lang] pages.
 *
 * Uses gsap.context() for proper cleanup during page transitions.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let ctx: ReturnType<typeof gsap.context> | null = null;

export function cleanupSpacesPage() {
  if (ctx) {
    ctx.revert();
    ctx = null;
  }
}

export function initSpacesPage() {
  cleanupSpacesPage();

  ctx = gsap.context(() => {
    // Gallery filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const category = (btn as HTMLElement).dataset.filter || 'all';

        document.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('active', 'border-b', 'border-black', 'text-at-graphite');
          b.classList.add('text-gray-400');
        });
        btn.classList.add('active', 'border-b', 'border-black');
        btn.classList.remove('text-gray-400');

        const items = document.querySelectorAll('.gallery-item') as NodeListOf<HTMLElement>;
        gsap.to(items, {
          opacity: 0, scale: 0.95, duration: 0.4,
          onComplete: () => {
            items.forEach(item => {
              item.style.display = (category === 'all' || item.classList.contains(category)) ? 'block' : 'none';
            });
            const visible = category === 'all'
              ? items
              : document.querySelectorAll('.gallery-item.' + category);
            gsap.fromTo(visible, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, clearProps: 'scale' });
            ScrollTrigger.refresh();
          },
        });
      });
    });

    // Gallery item click -> lightbox
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        if ((window as any).openGalleryDetail) {
          (window as any).openGalleryDetail(item);
        }
      });
    });
  });
}
