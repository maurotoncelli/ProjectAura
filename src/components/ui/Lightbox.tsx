/**
 * Lightbox — Full-screen image gallery overlay.
 * Keyboard navigation (Escape, Arrow keys).
 * Touch swipe navigation for mobile.
 * z-index: 10002
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export default function Lightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<HTMLElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Space');
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const close = useCallback(() => {
    setIsOpen(false);
    const lenis = (window as any).lenis;
    if (lenis) lenis.start();
  }, []);

  const navigate = useCallback((direction: number) => {
    setCurrentIndex(prev => {
      const next = prev + direction;
      if (next < 0) return items.length - 1;
      if (next >= items.length) return 0;
      return next;
    });
  }, [items.length]);

  // Update content when index changes
  useEffect(() => {
    const item = items[currentIndex];
    if (!item) return;
    const img = item.querySelector('img')?.src || '';
    const titleEl = item.querySelector('h3');
    const locEl = item.querySelector('.text-white.text-xs');
    setImgSrc(img);
    if (titleEl) setTitle(titleEl.innerText);
    if (locEl) setLocation(locEl.innerText);
    let cat = 'Space';
    if (item.classList.contains('living')) cat = 'Living';
    if (item.classList.contains('office')) cat = 'Office';
    if (item.classList.contains('creative')) cat = 'Creative';
    setCategory(cat);
  }, [currentIndex, items]);

  // Register global open function
  useEffect(() => {
    (window as any).openGalleryDetail = (element: HTMLElement) => {
      const allItems = Array.from(document.querySelectorAll('.gallery-item')) as HTMLElement[];
      setItems(allItems);
      const idx = allItems.indexOf(element);
      setCurrentIndex(idx >= 0 ? idx : 0);
      setIsOpen(true);
      const lenis = (window as any).lenis;
      if (lenis) lenis.stop();
    };

    return () => {
      delete (window as any).openGalleryDetail;
    };
  }, []);

  // Keyboard events
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, close, navigate]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      navigate(diff > 0 ? 1 : -1);
    }
  }, [navigate]);

  return (
    <div
      id="lightbox-overlay"
      className={isOpen ? 'active' : ''}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        className="absolute top-4 right-4 md:top-8 md:right-8 text-white text-xs uppercase tracking-widest z-50 hover:opacity-50 bg-black/30 backdrop-blur-sm border-none px-3 py-2 rounded-full"
        onClick={close}
      >
        Chiudi
      </button>
      <button className="lightbox-nav-btn lightbox-prev" onClick={() => navigate(-1)}>&larr;</button>
      <button className="lightbox-nav-btn lightbox-next" onClick={() => navigate(1)}>&rarr;</button>
      <div className="lightbox-content">
        {imgSrc && <img src={imgSrc} className="lightbox-img" alt="Gallery" style={{ opacity: 1, transform: 'none' }} />}
        <div className="lightbox-caption" style={{ opacity: 1, transform: 'none' }}>
          <p className="text-xs text-at-oak uppercase tracking-widest mb-2 font-bold">{category}</p>
          <h3 className="text-xl md:text-4xl text-white font-serif italic">{title}</h3>
          <p className="text-xs md:text-sm text-at-text-muted mt-1 md:mt-2 uppercase tracking-wide">{location}</p>
        </div>
      </div>
    </div>
  );
}
