/**
 * CartSidebar — Slide-in cart drawer with backdrop blur.
 * Reads from cartStore for reactive state.
 * z-index: 10002
 */
import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { isCartOpen, closeCart, cartItems } from '../../store/cartStore';
import { Z_INDEX } from '../../lib/constants';
import siteData from '../../data/site.json';

export default function CartSidebar() {
  const open = useStore(isCartOpen);
  const items = useStore(cartItems);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    closeCart();
  }, []);

  useEffect(() => {
    if (sidebarRef.current) {
      if (open) {
        sidebarRef.current.classList.remove('translate-x-full');
      } else {
        sidebarRef.current.classList.add('translate-x-full');
      }
    }
  }, [open]);

  // Also listen to legacy cart-btn-label clicks
  useEffect(() => {
    const btn = document.getElementById('cart-btn-label');
    const handler = () => {
      if (isCartOpen.get()) {
        closeCart();
      } else {
        isCartOpen.set(true);
      }
    };
    btn?.addEventListener('click', handler);
    return () => btn?.removeEventListener('click', handler);
  }, []);

  const cart = siteData.cart;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        id="cart-backdrop"
        className={open ? 'active' : ''}
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        id="cart-sidebar"
        className="fixed top-0 right-0 h-full w-full md:w-[500px] transform translate-x-full transition-transform duration-500 shadow-2xl flex flex-col"
        style={{ zIndex: Z_INDEX.CART_LIGHTBOX, backgroundColor: 'var(--color-at-stone)' }}
      >
        <div className="p-8 pt-20 md:pt-8 flex flex-row-reverse md:flex-row justify-between items-center border-b border-at-border">
          <h2 className="text-xl font-bold">{cart.title}</h2>
          <button onClick={handleClose} className="text-2xl text-at-graphite">&times;</button>
        </div>

        <div className="p-8 flex-grow overflow-y-auto pb-32">
          <div className="flex gap-6 mb-12">
            <div className="w-24 h-24 bg-at-border rounded-sm"></div>
            <div>
              <h3 className="font-bold text-xl">{cart.productName}</h3>
              <p id="cart-desc" className="text-sm text-at-text-muted uppercase tracking-wide">{cart.defaultDesc}</p>
              <p id="cart-initials" className="text-xs text-at-text-muted uppercase tracking-wide mt-1">{cart.defaultInitials}</p>
              <p id="cart-price" className="mt-2 font-mono">{cart.defaultPrice}</p>
            </div>
          </div>

          <div className="mb-8 text-xs text-at-text-muted space-y-4 pt-4">
            {cart.disclaimers.map((disclaimer, i) => (
              <p key={i}>
                <span className="font-bold uppercase tracking-widest text-at-text-muted">{disclaimer.label}</span><br />
                {disclaimer.text}
              </p>
            ))}
          </div>

          <div className="bg-white p-8 rounded-sm mt-8 border border-at-border">
            <p className="text-xs uppercase tracking-widest text-at-text-muted mb-8">{cart.roadmap.title}</p>
            <div className="space-y-8 relative pl-2">
              {cart.roadmap.steps.map((step, i) => (
                <div key={i} className="relative pl-10 animate-step opacity-50">
                  <div className={`absolute left-2 top-1.5 w-3 h-3 transform -translate-x-1/2 ${step.style === 'filled' ? 'bg-at-graphite rounded-full' : 'border-2 border-at-graphite bg-white rounded-full'}`}></div>
                  <h4 className="font-bold text-sm uppercase tracking-wide text-at-walnut">{step.title}</h4>
                  <p className="text-[10px] text-at-walnut mt-1">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-at-border bg-white">
          <button className="w-full bg-at-graphite text-white py-5 font-bold tracking-[0.2em] text-sm uppercase transition hover:bg-at-graphite/90">
            {cart.checkoutLabel}
          </button>
        </div>
      </div>
    </>
  );
}
