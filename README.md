# AETHER - Smart Wood Design

> Design sospeso nell'aria. Artigianato digitale by AT Studio.

![Astro](https://img.shields.io/badge/Astro-5.17-FF5D01?logo=astro)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css)
![Three.js](https://img.shields.io/badge/Three.js-Latest-000000?logo=three.js)

## 🎯 Project Overview

AETHER is a **Platinum-level experiential e-commerce platform** for luxury smart wood tables. This project combines cutting-edge web technologies to create an immersive, award-worthy experience.

### Key Features

- 🎨 **Pixel-Perfect Design** - Based on detailed UX/UI specifications
- 🌐 **Single Canvas Architecture** - Persistent WebGL rendering across pages
- ⚡ **Smooth Animations** - GSAP + Lenis for buttery-smooth interactions
- 🎮 **3D Configurator** - Real-time material & lighting customization
- 📱 **Fully Responsive** - Mobile-first approach with elegant breakpoints
- 🌍 **i18n Ready** - Multi-language support structure
- 🚀 **Performance Optimized** - Core Web Vitals compliant

## 🛠 Tech Stack

### Core Framework
- **Astro 5.17** - Static Site Generation with Islands Architecture
- **React 19** - UI Islands for interactive components
- **TypeScript** - Type-safe development

### Styling & UI
- **TailwindCSS v4** - Utility-first CSS with custom design tokens
- **CSS Clamp** - Fluid typography and responsive spacing

### 3D & Animation
- **Three.js** - WebGL rendering engine
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **GSAP** - Professional-grade animation library
- **Lenis** - Smooth scroll implementation

### State Management
- **Nanostores** - Minimalist state management (Astro-friendly)

## 📁 Project Structure

```
/
├── public/
│   ├── models/          # 3D models (.glb with Draco compression)
│   ├── textures/        # WebP/AVIF textures for 3D
│   ├── sounds/          # Audio files
│   └── fonts/           # Self-hosted fonts (WOFF2)
├── src/
│   ├── components/
│   │   ├── ui/          # Atomic UI components (React)
│   │   ├── canvas/      # WebGL/3D components (R3F)
│   │   ├── dom/         # DOM structural components
│   │   └── sections/    # Page section components
│   ├── layouts/         # Layout templates
│   │   └── MainLayout.astro  # Main persistent layout
│   ├── pages/           # File-based routing
│   ├── store/           # Global state (Nanostores)
│   │   ├── cartStore.ts      # Shopping cart logic
│   │   ├── configStore.ts    # Configuration state
│   │   └── sceneStore.ts     # 3D scene state
│   ├── lib/             # Utilities & helpers
│   │   ├── constants.ts      # Hardcoded values
│   │   ├── animation.ts      # GSAP configurations
│   │   └── 3d-helpers.ts     # Three.js utilities
│   ├── data/            # JSON data files
│   │   └── products.json     # Product catalog
│   ├── types/           # TypeScript definitions
│   └── styles/          # Global CSS
└── astro.config.mjs
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server will start at `http://localhost:4321/`

## 🎨 Design System

### Color Palette

```css
/* Primary Surfaces */
--at-stone: #F2F0EB;      /* Light mode background */
--at-graphite: #1C1B1A;   /* Dark mode background */

/* Accent & Materials */
--at-oak: #96705B;        /* Wood accent color */
--at-light: #F5D0A9;      /* LED warm light */
--at-copper: #B87333;     /* Copper details */

/* Tech Indicators */
--tech-emerald: #6EE7B7;  /* Energy efficiency */
--tech-cyan: #67E8F9;     /* Connectivity */
```

### Typography

- **Headings**: Playfair Display (Serif)
- **Body**: Inter (Sans-serif)
- **Fluid Scaling**: CSS Clamp for responsive typography

### Animation Principles

- **Curtain Transitions**: `power4.inOut` @ 1.2s
- **Element Reveals**: `power2.out` @ 1.0s
- **Magnetic Interactions**: `elastic.out(1, 0.3)` @ 0.4s

## 🏗 Architecture

### Single Canvas Pattern

The site uses a **single persistent `<Canvas>`** component that lives in `MainLayout.astro`. This prevents expensive 3D reloads during navigation.

```typescript
// Scene switching via global state
setActiveScene('HERO');      // Homepage
setActiveScene('CONFIGURATOR'); // Config page
setActiveScene('NONE');      // Pages without 3D
```

### State Management Flow

```
User Action (React Component)
    ↓
Nanostore Update (Global State)
    ↓
3D Scene Listener (R3F Component)
    ↓
Visual Update (Three.js)
```

## 📊 Data Layer

Products, materials, and shipping zones are defined in `src/data/products.json`. This file serves as a mock database and can be easily replaced with a CMS integration (Shopify, WordPress, Strapi).

## 🎯 Roadmap

### Phase 1: Setup & Scaffolding ✅
- [x] Initialize Astro + React + Tailwind
- [x] Create folder structure
- [x] Configure design tokens
- [x] Implement MainLayout with Lenis & ViewTransitions
- [x] Setup global stores (Nanostores)

### Phase 2: Hero Scene & Home Page
- [ ] Implement TableModel 3D component
- [ ] Create scroll-driven camera animations
- [ ] Build home page sections
- [ ] Add day/night theme transition

### Phase 3: Configurator
- [ ] Build configurator UI (Cockpit)
- [ ] Implement material switching
- [ ] Add OrbitControls for table rotation
- [ ] Create pricing engine

### Phase 4: E-Commerce Flow
- [ ] Shopping cart functionality
- [ ] Checkout process
- [ ] Form validation
- [ ] Payment integration preparation

### Phase 5: Content Pages
- [ ] About page
- [ ] Spaces gallery
- [ ] Contact form
- [ ] Legal pages

### Phase 6: Polish & Optimization
- [ ] Performance tuning
- [ ] SEO optimization
- [ ] Accessibility audit
- [ ] Cross-browser testing

## 🧪 Testing

```bash
# Type checking
npm run astro check

# Build test
npm run build
```

## 📝 License

© 2026 AT Studio. All rights reserved.

**Producer**: AT Studio (Switzerland)  
**Manufacturer**: Segnobianco S.r.l. (Italy)

---

**Built with 💎 for Awwwards Platinum Level**
