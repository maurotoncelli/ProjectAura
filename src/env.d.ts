/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { gsap as GSAPType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

declare global {
  interface Window {
    gsap: typeof GSAPType;
    ScrollTrigger: typeof ScrollTriggerType;
  }
}

export {};
