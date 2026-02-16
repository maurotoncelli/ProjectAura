import { atom } from 'nanostores';
import type { Product, Material, ShippingZone } from '../types/product';
import productsData from '../data/products.json';

export const selectedProduct = atom<Product | null>(null);
// Default material: Noce Canaletto (index 2)
export const selectedMaterial = atom<Material | null>(productsData.materials[2] as Material);
export const selectedShipping = atom<ShippingZone | null>(productsData.shipping[0] as ShippingZone);
export const isDayMode = atom<boolean>(true);
export const isMenuOpen = atom<boolean>(false);
export const isPageTransitioning = atom<boolean>(false);
// LED color hue (0-360). Default ~30 = warm amber (#F5D0A9).
// Updated by the mood-slider in the configurator cockpit.
export const ledColorHue = atom<number>(30);

export function setProduct(product: Product) {
  selectedProduct.set(product);
}

export function setMaterial(material: Material) {
  selectedMaterial.set(material);
}

export function setShipping(shipping: ShippingZone) {
  selectedShipping.set(shipping);
}

export function toggleDayNightMode() {
  isDayMode.set(!isDayMode.get());
}

export function setDayMode(isDay: boolean) {
  isDayMode.set(isDay);
}

export function toggleMenu() {
  isMenuOpen.set(!isMenuOpen.get());
}

export function openMenu() {
  isMenuOpen.set(true);
}

export function closeMenu() {
  isMenuOpen.set(false);
}

export function startPageTransition() {
  isPageTransitioning.set(true);
}

export function endPageTransition() {
  isPageTransitioning.set(false);
}

export function setLedColorHue(hue: number) {
  ledColorHue.set(hue);
}

/**
 * Reset all configurator state to defaults.
 * Called on page transitions to prevent stale values from previous visits.
 */
export function resetConfigDefaults() {
  isDayMode.set(true);
  ledColorHue.set(30);
  selectedMaterial.set(productsData.materials[2] as Material);
}
