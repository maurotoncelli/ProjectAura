/**
 * MobileMenu — Hamburger menu for mobile viewports.
 * Full-screen overlay with animated slide.
 * Pauses Lenis scroll when open.
 */
import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { isMenuOpen, openMenu, closeMenu } from '../../store/configStore';
import { Z_INDEX } from '../../lib/constants';
import siteData from '../../data/site.json';
import { DEFAULT_LANG, getLangFromPath, localizeHref } from '../../i18n/index';

export default function MobileMenu() {
  const open = useStore(isMenuOpen);
  const [lang, setLang] = useState(DEFAULT_LANG);
  useEffect(() => {
    setLang(getLangFromPath(window.location.pathname));
  }, []);

  const toggle = useCallback(() => {
    if (open) closeMenu();
    else openMenu();
  }, [open]);

  // Lock scroll when menu is open
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) closeMenu();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <>
      {/* Hamburger Button — visible only on mobile */}
      <button
        className="md:hidden fixed top-8 right-8 flex flex-col gap-1.5 p-2"
        style={{ zIndex: Z_INDEX.MOBILE_MENU, mixBlendMode: open ? 'normal' : 'difference' }}
        onClick={toggle}
        aria-label="Menu"
      >
        <span
          className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${open ? 'opacity-0' : ''}`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`}
        />
      </button>

      {/* Fullscreen Overlay */}
      <div
        className={`fixed inset-0 bg-at-graphite flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: Z_INDEX.CART_LIGHTBOX }}
      >
        <nav className="flex flex-col items-center gap-8">
          {siteData.nav.links.map((link) => (
            <a
              key={link.href}
              href={localizeHref(link.href, lang)}
              className="text-white text-3xl font-light uppercase tracking-widest hover:text-at-oak transition no-underline"
              onClick={() => closeMenu()}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
