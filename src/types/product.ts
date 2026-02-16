export interface SpecRow {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  model: string;
  modelNumber: string;
  subtitle: string;
  badge?: string;
  basePrice: number;
  displayPrice: string;
  currency: 'EUR';
  seats: string;
  weight: string;
  image: string;
  dimensions: {
    length: number;
    depth: number;
    height: number;
    topThickness: number;
    display: string;
  };
  specs: {
    ledStrips: number;
    ledLength: string;
    battery: string;
    cable: string;
    glassThickness: string;
    glassSize: string;
  };
  specRows: SpecRow[];
}

export interface Material {
  id: string;
  name: string;
  displayName: string;
  hex: string;
  threeColor: string;
  priceModifier: number;
  texturePath: string;
  textureNormal?: string;
  textureRoughness?: string;
  textureDisplacement?: string;
  textureScaleY?: number;
  thumbnail: string;
  description: string;
  shortDescription: string;
  specs: {
    grain: string;
    hardness: string;
    reflect: string;
    finish: string;
    janka: string;
    seasoning: string;
    origin: string;
  };
}

export interface ShippingZone {
  code: string;
  name: string;
  cost: number;
}

export interface CartItem {
  product: Product;
  material: Material;
  shippingZone: ShippingZone;
  quantity: number;
}

export interface ConfigState {
  selectedProduct: Product | null;
  selectedMaterial: Material | null;
  selectedShipping: ShippingZone | null;
  isDayMode: boolean;
}

export type SceneType = 'HERO' | 'CONFIGURATOR' | 'NONE';
