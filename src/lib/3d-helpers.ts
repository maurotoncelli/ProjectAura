/**
 * 3D Helper Functions for Three.js
 */

import * as THREE from 'three';

/**
 * Load texture with error handling
 */
export function loadTexture(path: string, loader: THREE.TextureLoader): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = false;
        resolve(texture);
      },
      undefined,
      (error) => {
        console.error(`Error loading texture: ${path}`, error);
        reject(error);
      }
    );
  });
}

/**
 * Dispose of Three.js objects properly to prevent memory leaks
 */
export function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => disposeMaterial(material));
        } else {
          disposeMaterial(child.material);
        }
      }
    }
  });
}

/**
 * Dispose of material and its textures
 */
function disposeMaterial(material: THREE.Material) {
  // Dispose textures
  Object.keys(material).forEach((key) => {
    const value = (material as any)[key];
    if (value && typeof value === 'object' && 'minFilter' in value) {
      value.dispose();
    }
  });
  material.dispose();
}

/**
 * Create emissive material for LED strips
 */
export function createLEDMaterial(color: string, intensity: number = 4) {
  return new THREE.MeshStandardMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: intensity,
    toneMapped: false,
    roughness: 1,
  });
}

/**
 * Create glass material for table legs
 */
export function createGlassMaterial() {
  return new THREE.MeshPhysicalMaterial({
    transmission: 1,
    roughness: 0,
    thickness: 1.5,
    color: '#ffffff',
    transparent: true,
    opacity: 0.9,
  });
}

/**
 * Create wood material
 */
export function createWoodMaterial(texture?: THREE.Texture) {
  return new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.8,
    metalness: 0.1,
    envMapIntensity: 0.5,
  });
}
