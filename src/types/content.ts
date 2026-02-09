/**
 * Content Types — TypeScript interfaces for all page data structures.
 * These contracts serve both JSON files and future CMS API responses.
 */

// ==========================================
// SITE-WIDE
// ==========================================

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteData {
  nav: {
    brand: string;
    links: NavLink[];
    languages: string[];
    defaultLang: string;
    cartLabel: string;
  };
  footer: {
    credits: { design: string; craftsmanship: string };
    copyright: string;
    legalLinks: { label: string; action: string }[];
  };
  cookie: {
    title: string;
    text: string;
    acceptLabel: string;
    essentialLabel: string;
  };
  cart: {
    title: string;
    productName: string;
    defaultDesc: string;
    defaultInitials: string;
    defaultPrice: string;
    disclaimers: { label: string; text: string }[];
    roadmap: {
      title: string;
      steps: { title: string; description: string; style: string }[];
    };
    checkoutLabel: string;
  };
  legal: {
    privacy: { title: string; subtitle: string; lastUpdate: string };
    terms: { title: string; subtitle: string; lastUpdate: string };
  };
  preloader: { line1: string; line2: string };
  toast: { title: string; subtitle: string };
}

// ==========================================
// HOME PAGE
// ==========================================

export interface LedSpecItem {
  value: string;
  label: string;
}

export interface LedSpecRow {
  color: string;
  shadow: string;
  items: LedSpecItem[];
}

export interface LifestyleItem {
  image: string;
  title: string;
}

export interface NextChapter {
  label: string;
  heading: string;
  linkText: string;
  href: string;
  image: string;
}

export interface HomeContent {
  hero: { title: string; subtitle: string; branding: string; workshop: string };
  philosophy: { label: string; number: string; heading: string; headingHtml: string; description: string; image: string; bgImage: string };
  tech: { label: string; heading: string; headingHtml: string; description: string; integrations: string[]; ledSpecs: LedSpecRow[] };
  material: { label: string; heading: string; headingHtml: string; description: string; bgImage: string };
  genesis: { label: string; heading: string; headingHtml: string; description: string; description2: string; image: string; caption: string };
  smartContext: { label: string; heading: string; headingHtml: string; description: string; bgImage: string };
  elementalFlow: { label?: string; heading: string; headingHtml?: string; description?: string; bgImage?: string; image?: string; theme: string }[];
  lifestyle: { label: string; heading: string; headingHtml: string; scrollHint: string; items: LifestyleItem[] };
  estetica: {
    label: string; heading: string; headingHtml: string; subtitle: string;
    grid: {
      mainImage: { src: string; alt: string; label: string };
      topRight: { src: string; alt: string; label: string };
      infoCard: { title: string; subtitle: string };
      bottomRight: { src: string; alt: string };
    };
  };
  heritage: { heading: string; headingHtml: string; description: string; bgImage: string; badge: string };
  details: {
    heading: string; description: string; longDescription: string; image: string;
    cta: { label: string; href: string };
    downloads: { label: string; buttons: string[] };
    b2b: { label: string; heading: string; description: string; buttonLabel: string };
  };
  nextChapter: NextChapter;
}

// ==========================================
// ABOUT PAGE
// ==========================================

export interface TimelineEntry {
  label: string;
  year?: string;
  horizonLabel?: string;
  heading: string;
  description: string;
  image?: string;
  theme?: string;
}

export interface MetodoStep {
  number: string;
  heading: string;
  description?: string;
  bgImage?: string;
}

export interface PolaroidItem {
  image: string;
  alt: string;
  position: string;
  size: string;
  rotation: string;
  speed: string;
  zIndex: string;
}

export interface CronacheItem {
  image: string;
  alt: string;
  caption: string;
}

export interface ManifestoLine {
  text: string;
  highlight: boolean;
  color?: string;
}

export interface AboutContent {
  hero: { heading: string; headingHtml: string; founded: string; description: string };
  dualIdentity: {
    atStudio: { logo: string; heading: string; headingHtml: string; description: string; image: string };
    segnobianco: { logo: string; heading: string; headingHtml: string; description: string; image: string };
  };
  timeline: TimelineEntry[];
  metodo: { label: string; steps: MetodoStep[] };
  elements: { label: string; heading: string; subtitle: string; polaroids: PolaroidItem[] };
  ethos: { label: string; heading: string; headingHtml: string; bgImage: string; image: string };
  cronache: { label: string; heading: string; headingHtml: string; items: CronacheItem[] };
  manifesto: ManifestoLine[];
  vision: { label: string; marquee: string; quote: string; quoteHtml: string; image: string };
  cta: { heading: string; buttonLabel: string; href: string };
  nextChapter: NextChapter;
}

// ==========================================
// SPACES PAGE
// ==========================================

export interface GalleryFilter {
  label: string;
  value: string;
}

export interface GalleryItem {
  category: string;
  image: string;
  location: string;
  title: string;
  grayscale?: boolean;
}

export interface SpacesContent {
  header: { label: string; heading: string; headingHtml: string };
  filters: GalleryFilter[];
  items: GalleryItem[];
  cta: { label: string; heading: string; headingHtml: string; buttonLabel: string; href: string };
  nextChapter: NextChapter;
}

// ==========================================
// CONFIGURATOR PAGE
// ==========================================

export interface ViaggioStep {
  week: string;
  heading: string;
  description: string;
  style: string;
  side: string;
}

export interface ConfigSection {
  id: string;
  number: string;
  heading: string;
  description: string;
  image: string;
  layout: string;
  hasInput?: boolean;
  inputPlaceholder?: string;
  inputMaxLength?: number;
}

export interface ShippingOption {
  code: string;
  label: string;
  cost: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ConfigSection02 {
  label: string;
  heading: string;
  headingHtml: string;
  description: string;
  image: string;
  inputPlaceholder: string;
  inputMaxLength: number;
  inputHint: string;
}

export interface ConfigSectionGeneric {
  label: string;
  heading: string;
  headingHtml: string;
  description: string;
  image: string;
}

export interface ConfigOltreLo {
  label: string;
  heading: string;
  headingHtml: string;
  description: string;
  disclaimer: string;
  image: string;
}

export interface ConfigAnimaDigitale {
  label: string;
  heading: string;
  headingHtml: string;
  description: string;
  toggleLabelOff: string;
  toggleLabelOn: string;
  dayImage: string;
  nightImage: string;
}

export interface ConfiguratorContent {
  hero: { heading: string };
  cockpit: { defaultLabel: string; ledLabel: string };
  confronta: { label: string; heading: string; taxNote: string };
  materia: { label: string; materialImages: Record<string, string> };
  animaDigitale: ConfigAnimaDigitale;
  sezione01: ConfigSectionGeneric;
  sezione02: ConfigSection02;
  oltreLo: ConfigOltreLo;
  viaggio: { label: string; heading: string; steps: ViaggioStep[] };
  summary: { title: string; fields: string[]; disclaimer: string; legalDisclaimer: { label: string; text: string } };
  shippingOptions: ShippingOption[];
  legal: { termsCheckbox: string; withdrawalCheckbox: string };
  buttons: { acconto: string; saldo: string; order: string; designer: string };
  faq: { label: string; items: FAQItem[] };
  nextChapter: NextChapter;
}

// ==========================================
// CONTACT PAGE
// ==========================================

export interface FormField {
  type: string;
  placeholder: string;
  required: boolean;
}

export interface OfficeInfo {
  name: string;
  address: string;
}

export interface CityProfile {
  country: string;
  city: string;
  description: string;
  image: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface ContactContent {
  form: {
    label: string; heading: string; headingHtml: string; subheading: string; responseTime: string;
    fields: FormField[];
    privacyCheckbox: string;
    submitLabel: string;
  };
  info: {
    email: { label: string; value: string };
    showroom: { label: string; value: string };
    social: SocialLink[];
  };
  offices: { label: string; items: OfficeInfo[] };
  cities: CityProfile[];
  toast: { title: string; subtitle: string };
}
