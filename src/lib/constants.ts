/**
 * Constants & Configuration Values
 * Single Source of Truth for hardcoded values
 */

// 3D Model Configuration — names extracted from tavololowpoly_versione2.glb
export const TABLE_PARTS = {
  glassLegs: ['Table_Legs'],
  woodPlanks: ['Table_top'],
  ledStrips: ['Table_LEDs'],
  blockers: [],
};

// Camera Presets (from Blueprint Tecnico)
export const CAMERA_PRESETS = {
  HERO_INITIAL: {
    position: [0, 0.5, 4.5] as [number, number, number],
    target: [0, 0.3, 0] as [number, number, number],
    fov: 45,
  },
  CONFIGURATOR: {
    position: [0, 2.0, 3.5] as [number, number, number],
    target: [0, 0.3, 0] as [number, number, number],
    fov: 38,
  },
};

// Table States (from Blueprint Tecnico - Sezione 2.2)
// Y rotation = π/2 → long side faces camera. Slight X tilt (0.1) for perspective.
export const TABLE_STATES = {
  PRELOADER: {
    scale: [0.9, 0.9, 0.9] as [number, number, number],
    rotation: [0.1, 0, 0] as [number, number, number],
    position: [0, 0, 0] as [number, number, number],
  },
  HERO_IDLE: {
    scale: [1.0, 1.0, 1.0] as [number, number, number],
    rotation: [0.1, 0, 0] as [number, number, number],
    position: [0, 0, 0] as [number, number, number],
  },
  PHILOSOPHY_ZOOM: {
    scale: [1.5, 1.5, 1.5] as [number, number, number],
    rotation: [0.1, 0, 0] as [number, number, number],
    position: [0, 0, 0] as [number, number, number],
  },
  TECH_DARK: {
    scale: [2.5, 2.5, 2.5] as [number, number, number],
    rotation: [-Math.PI / 2, 0, 0] as [number, number, number],
    position: [0, 0.5, 0] as [number, number, number],
  },
};

// Z-Index Stratigraphy (revised for correct layering)
// Canvas is ALWAYS behind page content so HTML scrolls OVER the 3D.
// Hero section is transparent → 3D shows through.
// Opaque sections (Tech, Material) naturally cover the canvas.
export const Z_INDEX = {
  CANVAS_CONFIG: 1,
  CANVAS_HERO: 1,
  CONTENT_STANDARD: 10,
  GLASS_ELEMENTS: 20,
  OVERLAY_SECTIONS: 30,
  COCKPIT_INTERACTIVE: 100,
  NOISE_OVERLAY: 9990,
  FIXED_UI: 9999,
  TRANSITION_CURTAIN: 10000,
  PRELOADER: 10001,
  CART_BACKDROP: 10001,
  CART_LIGHTBOX: 10002,
  MOBILE_MENU: 10003,
  ORDER_TOAST: 10005,
  VIDEO_MODAL: 10500,
  LEGAL_MODAL: 11000,
  COOKIE_CONSENT: 15000,
  CUSTOM_CURSOR: 20005,
};

// Animation Easings (from design-tokens.json)
export const EASINGS = {
  CURTAIN: 'power4.inOut',
  REVEAL: 'power2.out',
  MAGNETIC: 'elastic.out(1, 0.3)',
  SMOOTH_SCROLL: 'none',
};

// Magnetic Interaction Strengths
export const MAGNETIC_STRENGTH = {
  BUTTON: 0.4,
  LARGE_CARD: 0.1,
};

// Spacing (from Blueprint Tecnico - Sezione 1)
export const SPACING = {
  SECTION_PADDING_STANDARD: 'py-32 md:py-48',
  SECTION_PADDING_TIGHT: 'py-24 md:py-32',
  ELEMENT_GAP_TITLE_SUBTITLE: 'mb-6',
  ELEMENT_GAP_TITLE_PARAGRAPH: 'mb-12',
  ELEMENT_GAP_PARAGRAPH_CTA: 'mt-16',
};

// Model Paths
export const MODEL_PATHS = {
  TABLE_LOWPOLY: '/models/tavololowpoly_versione2.glb',
  TABLE_HIGHRES: '/models/Tavolo_Aether_v2.glb',
};

// Texture Base Path
export const TEXTURE_BASE_PATH = '/textures/';

// Company Information
export const COMPANY = {
  producer: {
    name: 'AT Studio',
    address: 'Rue En Segrin 10, 2016 Cortaillod, NE',
    country: 'Switzerland',
  },
  manufacturer: {
    name: 'Segnobianco S.r.l.',
    address: 'Via I Maggio 10, 56037 Peccioli, PI',
    country: 'Italy',
  },
};
