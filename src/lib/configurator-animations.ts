/**
 * Configurator Page Animations — UI interactions + nanostores writes.
 * Extracted from configurator.astro to eliminate duplication between root and [lang] pages.
 * Uses root version as master (most complete).
 */
import { setProduct, setMaterial, setShipping, setDayMode, isDayMode } from '../store/configStore';
import { addToCart } from '../store/cartStore';
import productsData from '../data/products.json';
import type { Product, Material, ShippingZone } from '../types/product';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Load product/material data for store integration
const storeProducts = productsData.products as Product[];
const storeMaterials = productsData.materials as Material[];
const storeShipping = productsData.shipping as ShippingZone[];

export function initConfigPage() {
  // ==========================================
  // 3D is now handled by R3F ConfiguratorScene
  // This script only handles UI interactions + nanostores writes
  // ==========================================

  // COCKPIT VISIBILITY
  const cockpit = document.getElementById('config-cockpit');
  ScrollTrigger.create({
    trigger: 'body',
    start: '200px top',
    onEnter: () => { if (cockpit) { cockpit.style.opacity = '1'; cockpit.style.pointerEvents = 'auto'; } },
    onLeaveBack: () => { if (cockpit) { cockpit.style.opacity = '0'; cockpit.style.pointerEvents = 'none'; } },
  });

  ScrollTrigger.create({
    trigger: '#config-sheet',
    start: 'top 60%',
    onEnter: () => { if (cockpit) gsap.to(cockpit, { opacity: 0, pointerEvents: 'none', duration: 0.3 }); },
    onLeaveBack: () => { if (cockpit) gsap.to(cockpit, { opacity: 1, pointerEvents: 'auto', duration: 0.3 }); },
  });

  // R3F canvas fade when sheet covers 3D viewer
  ScrollTrigger.create({
    trigger: '#config-sheet',
    start: 'top 15%',
    onEnter: () => gsap.to('#r3f-canvas-root', { opacity: 0, duration: 0.3 }),
    onLeaveBack: () => gsap.to('#r3f-canvas-root', { opacity: 1, duration: 0.3 }),
  });

  // ==========================================
  // STATE — synced with nanostores
  // ==========================================
  let selectedModel = '250';
  let selectedMaterial = 'Rovere';
  let basePrice = 2800;

  // Initialize nanostores with defaults
  const defaultProduct = storeProducts.find(p => p.modelNumber === '250');
  const defaultMaterial = storeMaterials.find(m => m.id === 'rovere');
  if (defaultProduct) setProduct(defaultProduct);
  if (defaultMaterial) setMaterial(defaultMaterial);
  setDayMode(true);

  const modelPrices: Record<string, number> = { '250': 2800, '270': 3400, '330': 4200 };
  const matPriceModifiers: Record<string, number> = { 'Rovere': 0, 'Cipresso': 400, 'Noce': 800 };
  const matData: Record<string, any> = {
    'Rovere': { name: 'Rovere Antico', desc: 'La forza della persistenza. Caratterizzato da una venatura fiammata e una tonalità calda che matura con la luce. È un legno che non teme il tempo, ma lo usa per diventare più profondo. Ideale per chi cerca un equilibrio tra design scandinavo e calore mediterraneo. Origine: Foreste certificate, stagionatura naturale 36 mesi.', grain: 'Fine', hardness: 'Alta', reflect: 'Opaco' },
    'Cipresso': { name: 'Cipresso Toscano', desc: 'L\'eleganza dell\'unicità. Ogni nodo è una costellazione irripetibile, un segno del carattere di un albero che ha sfidato il vento toscano per decenni. La sua resina naturale lo rende resistente all\'umidità, perfetto per chi vive gli spazi senza precauzioni. Origine: Toscana, stagionatura naturale 18 mesi.', grain: 'Nodosa', hardness: 'Media', reflect: 'Satinato' },
    'Noce': { name: 'Noce Canaletto', desc: 'Il prestigio dell\'ombra. Venatura scura e profonda che si nobilita con il tempo, riflessi cioccolato che cambiano con la luce. È il legno che sceglie chi sa aspettare, perché ogni anno che passa lo rende più prezioso. Origine: Nord America, stagionatura naturale 36 mesi.', grain: 'Lineare', hardness: 'Alta', reflect: 'Lucido' }
  };

  const materialDisplayNames: Record<string, string> = { 'Rovere': 'Rovere Antico', 'Cipresso': 'Cipresso Toscano', 'Noce': 'Noce Canaletto' };

  function updatePrice() {
    basePrice = modelPrices[selectedModel] + (matPriceModifiers[selectedMaterial] || 0);
    const shippingSel = document.getElementById('shipping-selector') as HTMLSelectElement;
    const shippingCostsLocal: Record<string, number> = { IT: 0, DE: 350, FR: 350, AT: 350, CH: 600, ES: 400, UK: 500, EU: 450 };
    const shippingCost = shippingSel?.value ? (shippingCostsLocal[shippingSel.value] || 0) : 0;
    const totalPrice = basePrice + shippingCost;

    const summaryTotal = document.getElementById('summary-total');
    const summaryModel = document.getElementById('summary-model');
    const summaryMaterial = document.getElementById('summary-material');
    const cartPrice = document.getElementById('cart-price');
    const cartDesc = document.getElementById('cart-desc');
    if (summaryTotal) summaryTotal.innerText = '€ ' + totalPrice.toLocaleString('it-IT');
    if (summaryModel) summaryModel.innerText = 'AETHER ' + selectedModel;
    if (summaryMaterial) summaryMaterial.innerText = materialDisplayNames[selectedMaterial] || selectedMaterial;
    if (cartPrice) cartPrice.innerText = '€ ' + totalPrice.toLocaleString('it-IT');
    if (cartDesc) cartDesc.innerText = selectedMaterial + ' / ' + (selectedModel === '250' ? '240cm' : selectedModel === '270' ? '270cm' : '330cm');

    const cartBtn = document.getElementById('cart-btn-label');
    if (cartBtn) cartBtn.innerText = 'Carrello (1)';
  }

  function selectMaterial(mat: string) {
    selectedMaterial = mat;
    const storeMat = storeMaterials.find(m => m.id === mat.toLowerCase());
    if (storeMat) setMaterial(storeMat);
    updatePrice();

    document.querySelectorAll('.mat-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.mat-btn[data-material="${mat}"]`)?.classList.add('active');

    const data = matData[mat];
    if (data) {
      const name = document.getElementById('mat-detail-name');
      const desc = document.getElementById('mat-detail-desc');
      const grain = document.getElementById('spec-grain');
      const hard = document.getElementById('spec-hard');
      const reflect = document.getElementById('spec-reflect');
      if (name) name.innerText = data.name + '.';
      if (desc) desc.innerText = data.desc;
      if (grain) grain.innerText = data.grain;
      if (hard) hard.innerText = data.hardness;
      if (reflect) reflect.innerText = data.reflect;
    }

    const cockpitLabel = document.getElementById('cockpit-label');
    if (cockpitLabel) cockpitLabel.innerText = materialDisplayNames[mat] || mat;

    const stackIds = ['rovere', 'cipresso', 'noce'];
    stackIds.forEach(id => {
      const el = document.getElementById('material-stack-' + id);
      if (!el) return;
      if (id === mat.toLowerCase()) {
        el.className = 'stack-img active';
        el.style.transform = 'scale(1) rotate(0deg)';
        el.style.opacity = '1';
      } else {
        const idx = stackIds.indexOf(id);
        const matIdx = stackIds.indexOf(mat.toLowerCase());
        const diff = Math.abs(idx - matIdx);
        if (diff === 1) {
          el.className = 'stack-img behind-1';
          el.style.transform = 'scale(0.95) rotate(3deg)';
          el.style.opacity = '0.8';
        } else {
          el.className = 'stack-img behind-2';
          el.style.transform = 'scale(0.9) rotate(-3deg)';
          el.style.opacity = '0.6';
        }
      }
    });

    document.querySelectorAll('.material-btn-bottom').forEach(b => {
      const bEl = b as HTMLElement;
      if (bEl.dataset.mat === mat.toLowerCase()) {
        bEl.classList.add('active');
      } else {
        bEl.classList.remove('active');
      }
    });
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================

  document.querySelectorAll('.mat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mat = (btn as HTMLElement).dataset.material;
      if (mat) selectMaterial(mat);
    });
  });

  document.querySelectorAll('.material-btn-bottom').forEach(btn => {
    btn.addEventListener('click', () => {
      const mat = (btn as HTMLElement).dataset.mat;
      const matNames: Record<string, string> = { 'rovere': 'Rovere', 'cipresso': 'Cipresso', 'noce': 'Noce' };
      if (mat && matNames[mat]) selectMaterial(matNames[mat]);
    });
  });

  document.querySelectorAll('.comparison-card').forEach(card => {
    card.addEventListener('click', () => {
      const model = (card as HTMLElement).dataset.model;
      if (!model) return;
      selectedModel = model;
      document.querySelectorAll('.comparison-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      updatePrice();
      const storeProduct = storeProducts.find(p => p.modelNumber === model);
      if (storeProduct) setProduct(storeProduct);
    });
  });

  // Day/Night toggle
  let isNight = !isDayMode.get();
  const dnTrack = document.getElementById('dn-switch-track');
  if (dnTrack) {
    dnTrack.addEventListener('click', () => {
      isNight = !isNight;
      setDayMode(!isNight);
      document.body.classList.toggle('active-night', isNight);
      const cockpitEl = document.getElementById('config-cockpit');
      if (cockpitEl) cockpitEl.classList.toggle('dark-mode', isNight);

      const iconSun = document.getElementById('icon-sun-sm');
      const iconMoon = document.getElementById('icon-moon-sm');
      const dnThumb = document.getElementById('dn-switch-thumb');
      if (iconSun && iconMoon) {
        iconSun.classList.toggle('hidden', isNight);
        iconMoon.classList.toggle('hidden', !isNight);
      }
      if (dnThumb) {
        dnThumb.style.transform = isNight ? 'translateX(24px)' : 'translateX(0)';
      }
    });
  }

  // Atmosphere toggle
  const atmosToggle = document.getElementById('atmos-toggle');
  if (atmosToggle) {
    atmosToggle.addEventListener('click', () => {
      const day = document.getElementById('atmos-day');
      const night = document.getElementById('atmos-night');
      const thumb = atmosToggle.querySelector('.toggle-thumb') as HTMLElement;
      if (!day || !night || !thumb) return;
      const isCurrentlyDay = day.style.opacity !== '0';
      if (isCurrentlyDay) {
        day.style.opacity = '0'; night.style.opacity = '1';
        thumb.style.transform = 'translateX(24px)';
      } else {
        day.style.opacity = '1'; night.style.opacity = '0';
        thumb.style.transform = 'translateX(0px)';
      }
    });
  }

  // LED Mood slider
  const moodSlider = document.getElementById('mood-slider') as HTMLInputElement;
  if (moodSlider) {
    moodSlider.addEventListener('input', () => {
      const _hue = parseInt(moodSlider.value);
    });
  }

  // Initials input
  const initialsInput = document.getElementById('initials-input') as HTMLInputElement;
  if (initialsInput) {
    initialsInput.addEventListener('input', () => {
      const summaryInitials = document.getElementById('summary-initials');
      const cartInitials = document.getElementById('cart-initials');
      const val = initialsInput.value.toUpperCase() || '--';
      if (summaryInitials) summaryInitials.innerText = val;
      if (cartInitials) cartInitials.innerText = 'Sigla: ' + val + ' | Dest: --';
    });
  }

  // Shipping selector
  const shippingCosts: Record<string, number> = { IT: 0, DE: 350, FR: 350, AT: 350, CH: 600, ES: 400, UK: 500, EU: 450 };
  const shippingSelector = document.getElementById('shipping-selector') as HTMLSelectElement;
  if (shippingSelector) {
    shippingSelector.addEventListener('change', () => {
      const shippingCost = shippingCosts[shippingSelector.value] || 0;
      const total = basePrice + shippingCost;
      const summaryTotal = document.getElementById('summary-total');
      if (summaryTotal) summaryTotal.innerText = '€ ' + total.toLocaleString('it-IT');
      const storeShip = storeShipping.find(s => s.code === shippingSelector.value);
      if (storeShip) setShipping(storeShip);
    });
  }

  // Legal checkboxes
  function checkLegal() {
    const cb1 = (document.getElementById('order-terms') as HTMLInputElement)?.checked;
    const cb2 = (document.getElementById('order-withdrawal') as HTMLInputElement)?.checked;
    const enabled = cb1 && cb2;
    const btnAcconto = document.getElementById('btn-acconto') as HTMLButtonElement;
    const btnSaldo = document.getElementById('btn-saldo') as HTMLButtonElement;
    const btnOrder = document.getElementById('btn-order') as HTMLButtonElement;
    if (btnAcconto) { btnAcconto.style.opacity = enabled ? '1' : '0.45'; btnAcconto.style.pointerEvents = enabled ? 'auto' : 'none'; }
    if (btnSaldo) { btnSaldo.style.opacity = enabled ? '1' : '0.45'; btnSaldo.style.pointerEvents = enabled ? 'auto' : 'none'; }
    if (btnOrder) { btnOrder.style.opacity = enabled ? '1' : '0.55'; btnOrder.style.pointerEvents = enabled ? 'auto' : 'none'; }
  }
  checkLegal();
  document.getElementById('order-terms')?.addEventListener('change', checkLegal);
  document.getElementById('order-withdrawal')?.addEventListener('change', checkLegal);

  // Order button
  document.getElementById('btn-order')?.addEventListener('click', () => {
    const currentProduct = storeProducts.find(p => p.modelNumber === selectedModel);
    const currentMaterial = storeMaterials.find(m => m.id === selectedMaterial.toLowerCase());
    const shippingSel = document.getElementById('shipping-selector') as HTMLSelectElement;
    const currentShipping = storeShipping.find(s => s.code === (shippingSel?.value || 'IT')) || storeShipping[0];

    if (currentProduct && currentMaterial && currentShipping) {
      addToCart({ product: currentProduct, material: currentMaterial, shippingZone: currentShipping, quantity: 1 });
    }

    const toast = document.getElementById('order-confirmation-toast');
    if (toast) {
      const h4 = toast.querySelector('h4');
      const p = toast.querySelector('p');
      if (h4) h4.innerText = 'Unico. Come te.';
      if (p) p.innerText = 'Configurazione Salvata — AETHER ' + selectedModel;
      gsap.to(toast, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.6 });
      setTimeout(() => { gsap.to(toast, { opacity: 0, y: -20, pointerEvents: 'none', duration: 0.6 }); }, 4000);
    }
  });

  // Zoom container
  const zoomContainer = document.getElementById('materia-zoom-container') as HTMLElement;
  const zoomLens = document.getElementById('zoom-lens') as HTMLElement;
  if (zoomContainer && zoomLens) {
    zoomContainer.addEventListener('mousemove', (e) => {
      const rect = zoomContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      zoomLens.style.left = (x - 75) + 'px';
      zoomLens.style.top = (y - 75) + 'px';
      const activeImg = zoomContainer.querySelector('.stack-img.active') as HTMLImageElement;
      if (activeImg) {
        zoomLens.style.backgroundImage = `url(${activeImg.src})`;
        zoomLens.style.backgroundSize = '400%';
        zoomLens.style.backgroundPosition = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
      }
    });
  }
}
