/**
 * i18n — Translation helper and language utilities.
 * Uses JSON dictionaries for each supported language.
 */
import itDict from './it.json';
import enDict from './en.json';

export const SUPPORTED_LANGS = ['it', 'en'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = 'it';

const dictionaries: Record<Lang, Record<string, string>> = {
  it: itDict,
  en: enDict,
};

/**
 * Translate a key for a given language.
 * Falls back to Italian if key not found in target language.
 */
export function t(key: string, lang: Lang = DEFAULT_LANG): string {
  return dictionaries[lang]?.[key] ?? dictionaries[DEFAULT_LANG]?.[key] ?? key;
}

/**
 * Check if a language code is supported.
 */
export function isValidLang(lang: string): lang is Lang {
  return SUPPORTED_LANGS.includes(lang as Lang);
}

/**
 * Get the language from a URL pathname (e.g. /it/about -> 'it')
 */
export function getLangFromPath(pathname: string): Lang {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  return isValidLang(first) ? first : DEFAULT_LANG;
}

/**
 * Prepend the current language prefix to a path.
 * Handles paths that already have a lang prefix (no-op) and root '/'.
 * E.g. localizeHref('/about', 'it') -> '/it/about'
 *      localizeHref('/', 'it')      -> '/it/'
 *      localizeHref('/it/about', 'it') -> '/it/about' (already localized)
 */
export function localizeHref(href: string, lang: Lang): string {
  // Already has a valid lang prefix — return as-is
  const segments = href.split('/').filter(Boolean);
  if (segments.length > 0 && isValidLang(segments[0])) {
    return href;
  }
  // Prepend lang: '/about' -> '/it/about', '/' -> '/it/'
  const clean = href.startsWith('/') ? href : `/${href}`;
  return `/${lang}${clean}`;
}
