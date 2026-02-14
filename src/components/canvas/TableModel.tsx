/**
 * TableModel — The shared GLTF table model.
 * Used by both HeroScene and ConfiguratorScene (zero duplication).
 * Reads selectedMaterial and isDayMode from configStore for material switching.
 * Uses TABLE_PARTS from constants for semantic node mapping.
 * Textures are loaded dynamically from the selectedMaterial data (products.json).
 */
import { useRef, useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@nanostores/react';
import { selectedMaterial, isDayMode, ledColorHue } from '../../store/configStore';
import { TABLE_PARTS, MODEL_PATHS } from '../../lib/constants';

// Color tints per wood type (multiplied on top of texture).
// 0xffffff = no tint, texture renders at full brightness.
// Lower values darken the texture — use sparingly.
const WOOD_COLORS: Record<string, number> = {
  rovere: 0xffffff,   // neutral — texture at full brightness
  cipresso: 0xfcf8f0, // very subtle warm tint — Wood014 texture carries its own color
  noce: 0xdecfbe,     // light warm tint — Wood018 texture is already naturally dark
};

// Shared texture loader (reused across loads)
const textureLoader = new THREE.TextureLoader();

/** Load and configure a texture from a given path */
function loadTexture(path: string): THREE.Texture {
  const tex = textureLoader.load(path);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface TableModelProps {
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export default function TableModel({ castShadow = false, receiveShadow = false }: TableModelProps) {
  const { scene } = useGLTF(MODEL_PATHS.TABLE_LOWPOLY);
  const groupRef = useRef<THREE.Group>(null);
  const material = useStore(selectedMaterial);
  const dayMode = useStore(isDayMode);
  const hue = useStore(ledColorHue);

  // Track loaded textures for cleanup
  const loadedTexturesRef = useRef<THREE.Texture[]>([]);

  // Create materials once (wood texture set to default; updated dynamically via useEffect)
  const materials = useMemo(() => {
    const defaultColor = loadTexture('/textures/wood_oak_color.jpg');
    const defaultNormal = loadTexture('/textures/wood_oak_normal.jpg');
    const defaultRough = loadTexture('/textures/wood_oak_roughness.jpg');
    loadedTexturesRef.current = [defaultColor, defaultNormal, defaultRough];

    return {
      wood: new THREE.MeshStandardMaterial({
        map: defaultColor,
        normalMap: defaultNormal,
        normalScale: new THREE.Vector2(1.5, 1.5), // Accentuate wood grain relief
        roughnessMap: defaultRough,
        roughness: 0.95,       // Very matte — real wood, not lacquered
        metalness: 0.0,        // Zero metalness — no plastic sheen
        color: 0xffffff,
        envMapIntensity: 0.3,  // Minimal environment reflections
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.0,
        roughness: 0.02,
        transmission: 0.98,
        transparent: true,
        opacity: 0.15,
        thickness: 1.5,
        ior: 1.52,
        envMapIntensity: 1.0,
      }),
      led: new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x000000,
        emissiveIntensity: 0,
        toneMapped: false,  // Pure colors, not compressed by ACES — enables bloom trigger
        roughness: 1,       // Max diffusion for soft glow
      }),
      blocker: new THREE.MeshStandardMaterial({
        color: 0x6B5B4B,   // Warm dark wood tone — fills gaps seamlessly
        roughness: 0.95,    // Very matte like the wood
        metalness: 0.0,
        envMapIntensity: 0.1,
      }),
    };
  }, []);

  // Clone the scene to avoid mutating the cached original
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Center and normalize
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.0 / maxDim;
    clone.scale.setScalar(scale);
    clone.position.set(-center.x * scale, -center.y * scale + 0.4, -center.z * scale);

    // Traverse and assign materials based on TABLE_PARTS
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name;

        if (castShadow) mesh.castShadow = true;
        if (receiveShadow) mesh.receiveShadow = true;

        if (TABLE_PARTS.woodPlanks.some(n => name.includes(n)) ||
            name.toLowerCase().includes('asselegno') || name.toLowerCase().includes('legno') || name.toLowerCase().includes('tavolo')) {
          mesh.material = materials.wood;
        } else if (TABLE_PARTS.glassLegs.some(n => name.includes(n)) ||
                   name.toLowerCase().includes('vetro') || name.toLowerCase().includes('glass') || name.toLowerCase().includes('gamba')) {
          mesh.material = materials.glass;
        } else if (TABLE_PARTS.ledStrips.some(n => name.includes(n)) ||
                   name.toLowerCase().includes('led') || name.toLowerCase().includes('strip')) {
          mesh.material = materials.led.clone();
        } else if (TABLE_PARTS.blockers.some(n => name.includes(n)) ||
                   name.toLowerCase().includes('tappa')) {
          mesh.material = materials.blocker;
          mesh.visible = true;
        } else {
          // Fallback: assign wood material to unknown meshes
          mesh.material = materials.wood;
        }
      }
    });

    return clone;
  }, [scene, materials, castShadow, receiveShadow]);

  // Cleanup: dispose textures, materials and cloned scene on unmount
  useEffect(() => {
    return () => {
      // Dispose all dynamically loaded textures
      loadedTexturesRef.current.forEach(tex => tex.dispose());
      loadedTexturesRef.current = [];

      // Dispose all base materials
      Object.values(materials).forEach(mat => mat.dispose());

      // Dispose cloned LED material instances
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material && mesh.material !== materials.wood &&
              mesh.material !== materials.glass && mesh.material !== materials.led &&
              mesh.material !== materials.blocker) {
            (mesh.material as THREE.Material).dispose();
          }
        }
      });
    };
  }, [materials, clonedScene]);

  // React to material changes: load new textures from data layer and apply color tint
  useEffect(() => {
    if (!material) return;

    // Apply color tint
    const color = WOOD_COLORS[material.id] || 0xffffff;
    materials.wood.color.set(color);

    // Load textures defined in the material data (products.json)
    const newTextures: THREE.Texture[] = [];

    if (material.texturePath) {
      const colorTex = loadTexture(material.texturePath);
      // Dispose previous color map
      materials.wood.map?.dispose();
      materials.wood.map = colorTex;
      newTextures.push(colorTex);
    }

    if (material.textureNormal) {
      const normalTex = loadTexture(material.textureNormal);
      materials.wood.normalMap?.dispose();
      materials.wood.normalMap = normalTex;
      newTextures.push(normalTex);
    }

    if (material.textureRoughness) {
      const roughTex = loadTexture(material.textureRoughness);
      (materials.wood as any).roughnessMap?.dispose();
      materials.wood.roughnessMap = roughTex;
      newTextures.push(roughTex);
    }

    materials.wood.needsUpdate = true;

    // Track new textures for cleanup
    loadedTexturesRef.current = newTextures;

    return () => {
      // Cleanup previous textures when material changes again
      newTextures.forEach(tex => tex.dispose());
    };
  }, [material, materials]);

  // React to day/night + LED hue changes (LED emissive color)
  useEffect(() => {
    // Convert hue (0-360) to THREE.Color — saturation 0.9, lightness 0.6 for vivid glow
    const ledColor = new THREE.Color().setHSL(hue / 360, 0.9, 0.6);

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (!mat || !mat.emissive) return;

        const isLed = TABLE_PARTS.ledStrips.some(n => mesh.name.includes(n)) ||
          mesh.name.toLowerCase().includes('led') || mesh.name.toLowerCase().includes('strip');

        if (isLed) {
          mat.toneMapped = false; // Always keep LED colors pure
          if (dayMode) {
            mat.emissive.set(0x000000);
            mat.emissiveIntensity = 0;
            mat.color.set(0x111111);
          } else {
            mat.emissive.copy(ledColor);
            mat.emissiveIntensity = 5;
            mat.color.copy(ledColor);
          }
        }
      }
    });
  }, [dayMode, hue, clonedScene]);

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Pre-cache the model
useGLTF.preload(MODEL_PATHS.TABLE_LOWPOLY);
