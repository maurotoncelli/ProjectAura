/**
 * LanguageSelector — React island for language switching.
 * Replaces the direct DOM manipulation that was in MainLayout's global script.
 * Uses Astro View Transitions navigation for clean page transitions.
 */
import { useState, useEffect, useRef } from 'react';
import { SUPPORTED_LANGS, type Lang } from '../../i18n/index';

interface LanguageSelectorProps {
  currentLang: Lang;
  currentPath: string;
}

export default function LanguageSelector({ currentLang, currentPath }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Build the URL for a given language
  function getUrlForLang(lang: Lang): string {
    // Remove the current lang prefix from the path
    const segments = currentPath.split('/').filter(Boolean);
    const hasLangPrefix = SUPPORTED_LANGS.includes(segments[0] as Lang);
    const basePath = hasLangPrefix ? segments.slice(1).join('/') : segments.join('/');
    return `/${lang}${basePath ? '/' + basePath : '/'}`;
  }

  return (
    <div ref={containerRef} className="relative group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:opacity-50 transition font-normal tracking-widest"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {currentLang.toUpperCase()}
      </button>
      {isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-at-graphite/90 backdrop-blur-md text-white p-4 flex flex-col gap-3 min-w-[80px] text-center border border-white/10 shadow-2xl rounded-sm">
          {SUPPORTED_LANGS.map((lang) => (
            <a
              key={lang}
              href={getUrlForLang(lang)}
              data-astro-prefetch
              onClick={() => setIsOpen(false)}
              className={`hover:text-at-light transition text-xs font-normal tracking-widest no-underline ${
                lang === currentLang ? 'text-at-oak' : 'text-white'
              }`}
            >
              {lang.toUpperCase()}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
