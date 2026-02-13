/**
 * VideoModal — Opens the full craftsmanship video in true browser fullscreen.
 * Triggered via window.openVideoModal(). Exits fullscreen on close or Escape.
 * Locks body scroll while open (same pattern as LegalModal).
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Z_INDEX } from '../../lib/constants';

export default function VideoModal({ src }: { src: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    // Request fullscreen after a short delay to allow React to render the video
    setTimeout(() => {
      const container = containerRef.current;
      if (container?.requestFullscreen) {
        container.requestFullscreen().catch(() => {
          // Fullscreen denied by browser — still show the modal overlay as fallback
        });
      }
    }, 100);
  }, []);

  // Register global open/close for Astro components
  useEffect(() => {
    const w = window as any;
    w.openVideoModal = open;
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

  // Listen for fullscreen exit (user presses Escape or exits via browser controls)
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
      {/* Close button */}
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

      {/* Full-screen video */}
      {isOpen && (
        <video
          ref={videoRef}
          src={src}
          controls
          autoPlay
          playsInline
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
}
