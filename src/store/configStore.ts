import { atom } from 'nanostores';
import type { Product, Material, ShippingZone } from '../types/product';
import productsData from '../data/products.json';

export const selectedProduct = atom<Product | null>(null);
export const selectedMaterial = atom<Material | null>(productsData.materials[0] as Material);
export const selectedShipping = atom<ShippingZone | null>(productsData.shipping[0] as ShippingZone);
export const isDayMode = atom<boolean>(true);
export const isMenuOpen = atom<boolean>(false);
export const isPageTransitioning = atom<boolean>(false);

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
