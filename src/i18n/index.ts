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
