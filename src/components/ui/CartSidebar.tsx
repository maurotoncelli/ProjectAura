/**
 * CartSidebar — Slide-in cart drawer with backdrop blur.
 * Reads from cartStore for reactive state.
 * z-index: 10002
 */
import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { isCartOpen, closeCart, cartItems, removeFromCart } from '../../store/cartStore';
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
          <div className="flex gap-6 mb-12 relative">
            <div className="w-24 h-24 bg-at-border rounded-sm flex-shrink-0"></div>
            <div className="flex-grow">
              <h3 className="font-bold text-xl">{cart.productName}</h3>
              <p id="cart-desc" className="text-sm text-at-text-muted uppercase tracking-wide">{cart.defaultDesc}</p>
              <p id="cart-initials" className="text-xs text-at-text-muted uppercase tracking-wide mt-1">{cart.defaultInitials}</p>
              <p id="cart-price" className="mt-2 font-mono">{cart.defaultPrice}</p>
            </div>
            <button
              onClick={() => removeFromCart(0)}
              className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-at-text-muted hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
              aria-label="Rimuovi dal carrello"
              title="Rimuovi"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
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
          <div className="mt-4 flex items-center justify-center">
            <a
              href={`tel:${cart.assistancePhone}`}
              className="text-xs md:text-sm font-bold uppercase tracking-widest text-at-text/70 hover:text-at-oak transition flex items-center gap-2 border-b-2 border-transparent hover:border-at-oak pb-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {cart.assistanceLabel}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
