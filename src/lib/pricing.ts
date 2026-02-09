/**
 * Pricing — Pure function for total calculation.
 * Implements the formula from Blueprint Cap. 6.2:
 * Total = basePrice + materialModifier + shippingCost
 */
import type { Product, Material, ShippingZone } from '../types/product';

export function calculateTotal(
  product: Product | null,
  material: Material | null,
  shipping: ShippingZone | null
): number {
  if (!product) return 0;
  const base = product.basePrice;
  const materialMod = material?.priceModifier ?? 0;
  const shippingCost = shipping?.cost ?? 0;
  return base + materialMod + shippingCost;
}

export function formatPrice(amount: number, locale = 'it-IT'): string {
  return '€ ' + amount.toLocaleString(locale);
}
