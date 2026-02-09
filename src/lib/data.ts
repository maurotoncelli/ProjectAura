/**
 * Data Access Layer — Adapter Pattern
 *
 * Single point of access for all content data.
 * Currently reads from local JSON files.
 * To integrate a CMS (Sanity, Strapi, Shopify), replace the function
 * internals with API calls — page templates remain untouched.
 */

import productsData from '../data/products.json';
import siteData from '../data/site.json';
import homeData from '../data/home.json';
import aboutData from '../data/about.json';
import spacesData from '../data/spaces.json';
import configuratorData from '../data/configurator.json';
import contactData from '../data/contact.json';

import type { Product, Material, ShippingZone } from '../types/product';
import type {
  SiteData,
  HomeContent,
  AboutContent,
  SpacesContent,
  ConfiguratorContent,
  ContactContent,
} from '../types/content';

// ==========================================
// PRODUCT DATA
// ==========================================

export function getProducts(): Product[] {
  return productsData.products as Product[];
}

export function getProductByModel(modelNumber: string): Product | undefined {
  return getProducts().find(p => p.modelNumber === modelNumber);
}

export function getMaterials(): Material[] {
  return productsData.materials as Material[];
}

export function getMaterialById(id: string): Material | undefined {
  return getMaterials().find(m => m.id === id);
}

export function getShippingZones(): ShippingZone[] {
  return productsData.shipping as ShippingZone[];
}

// ==========================================
// SITE-WIDE DATA
// ==========================================

export function getSiteData(): SiteData {
  return siteData as SiteData;
}

// ==========================================
// PAGE CONTENT
// ==========================================

export function getHomeContent(): HomeContent {
  return homeData as HomeContent;
}

export function getAboutContent(): AboutContent {
  return aboutData as AboutContent;
}

export function getSpacesContent(): SpacesContent {
  return spacesData as SpacesContent;
}

export function getConfiguratorContent(): ConfiguratorContent {
  return configuratorData as ConfiguratorContent;
}

export function getContactContent(): ContactContent {
  return contactData as ContactContent;
}
