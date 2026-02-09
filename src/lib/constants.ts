/**
 * Constants & Configuration Values
 * Single Source of Truth for hardcoded values
 */

// 3D Model Configuration
export const TABLE_PARTS = {
  glassLegs: ['Gamba_Vetro_DX', 'Gamba_Vetro_SX'],
  woodTop: ['Tavolo_Top_01', 'Tavolo_Top_02'],
  ledStrips: ['Led_Strip_01', 'Led_Strip_02'],
  techBox: ['Tech_Box_Under'],
  blockers: ['tappabuchi'],
};

// Camera Presets (from Blueprint Tecnico)
export const CAMERA_PRESETS = {
  HERO_INITIAL: {
    position: [0, 0.5, 4.5] as [number, number, number],
    target: [0, 0.3, 0] as [number, number, number],
    fov: 45,
  },
  CONFIGURATOR: {
    position: [0, 2.5, 4.5] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    fov: 35,
  },
};

// Table States (from Blueprint Tecnico - Sezione 2.2)
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

// Z-Index Stratigraphy (from Blueprint Tecnico - Sezione 5)
export const Z_INDEX = {
  CANVAS_CONFIG: 0,
  CONTENT_STANDARD: 10,
  CANVAS_HERO: 15,
  GLASS_ELEMENTS: 20,
  OVERLAY_SECTIONS: 30,
  COCKPIT_INTERACTIVE: 100,
  NOISE_OVERLAY: 9990,
  TRANSITION_CURTAIN: 10000,
  PRELOADER: 10001,
  CART_LIGHTBOX: 10002,
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
  TABLE_LOWPOLY: '/models/Tavolo_lowpoly.glb',
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
