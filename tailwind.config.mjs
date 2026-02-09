/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Primary Surfaces
        'at-stone': '#F2F0EB',
        'at-graphite': '#1C1B1A',
        
        // Accent & Materials
        'at-oak': '#96705B',
        'at-light': '#F5D0A9',
        'at-copper': '#B87333',
        
        // Text Colors
        'at-text': '#2D2A26',
        'at-text-inverted': '#FFFFFF',
        'at-text-muted': '#9CA3AF',
        
        // Tech Indicators (Ologrammi)
        'tech-emerald': '#6EE7B7',
        'tech-cyan': '#67E8F9',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      fontSize: {
        // Fluid Typography using CSS Clamp
        'fluid-hero': 'clamp(4rem, 15vw, 12rem)',
        'fluid-h2': 'clamp(3rem, 8vw, 7rem)',
      },
      spacing: {
        // Custom spacing per il Blueprint
        '18': '4.5rem', // 72px
        '88': '22rem', // 352px
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '3rem',
      },
      zIndex: {
        '9990': '9990',
        '10000': '10000',
        '10001': '10001',
        '10002': '10002',
        '20005': '20005',
      },
    },
  },
  plugins: [],
}
