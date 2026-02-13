/**
 * VideoModal — Opens any video in true browser fullscreen.
 * Triggered via window.openVideoModal(optionalSrc). Falls back to default src prop.
 * Exits fullscreen on close or Escape.
 * Locks body scroll while open (same pattern as LegalModal).
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Z_INDEX } from '../../lib/constants';

export default function VideoModal({ src: defaultSrc }: { src: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSrc, setActiveSrc] = useState(defaultSrc);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const open = useCallback((customSrc?: string) => {
    if (customSrc) setActiveSrc(customSrc);
    else setActiveSrc(defaultSrc);
    setIsOpen(true);
    setTimeout(() => {
      const container = containerRef.current;
      if (container?.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      }
    }, 100);
  }, [defaultSrc]);

  // Register global open/close for Astro components
  useEffect(() => {
    const w = window as any;
    w.openVideoModal = (src?: string) => open(src);
    w.closeVideoModal = close;
    return () => {
      delete w.openVideoModal;
      delete w.closeVideoModal;
    };
  }, [open, close]);

  // Lock scroll when open
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Listen for fullscreen exit
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isOpen) {
        close();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isOpen, close]);

  // Close on Escape (fallback for non-fullscreen)
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, close]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === 'video-modal-backdrop') {
      close();
    }
  };

  return (
    <div
      id="video-modal-backdrop"
      ref={containerRef}
      className="fixed inset-0 bg-black flex items-center justify-center transition-opacity duration-500"
      style={{
        zIndex: Z_INDEX.VIDEO_MODAL,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
      onClick={handleBackdropClick}
    >
      <button
        onClick={close}
        className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors bg-transparent border border-white/20 hover:border-white/50 rounded-full"
        style={{ zIndex: 1 }}
        aria-label="Chiudi video"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {isOpen && (
        <video
          ref={videoRef}
          src={activeSrc}
          controls
          autoPlay
          playsInline
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
}
