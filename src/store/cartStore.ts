import { atom, computed } from 'nanostores';
import type { CartItem } from '../types/product';

export const cartItems = atom<CartItem[]>([]);
export const isCartOpen = atom<boolean>(false);

export const cartTotal = computed(cartItems, (items) => {
  return items.reduce((total, item) => {
    const basePrice = item.product.basePrice;
    const materialMod = item.material.priceModifier;
    const shippingCost = item.shippingZone.cost;
    return total + (basePrice + materialMod + shippingCost) * item.quantity;
  }, 0);
});

export const cartCount = computed(cartItems, (items) => {
  return items.reduce((count, item) => count + item.quantity, 0);
});

export function addToCart(item: CartItem) {
  cartItems.set([...cartItems.get(), item]);
  isCartOpen.set(true);
}

export function removeFromCart(index: number) {
  const items = cartItems.get();
  cartItems.set(items.filter((_, i) => i !== index));
}

export function clearCart() {
  cartItems.set([]);
}

export function toggleCart() {
  isCartOpen.set(!isCartOpen.get());
}

export function openCart() {
  isCartOpen.set(true);
}

export function closeCart() {
  isCartOpen.set(false);
}
