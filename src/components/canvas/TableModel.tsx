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
import { selectedMaterial, isDayMode } from '../../store/configStore';
import { TABLE_PARTS, MODEL_PATHS } from '../../lib/constants';

// Color tints per wood type (applied on top of texture for differentiation)
const WOOD_COLORS: Record<string, number> = {
  rovere: 0xcccccc,   // neutral — texture does the work
  cipresso: 0xddd8c8, // warm light tint
  noce: 0x4A3728,     // dark walnut tint
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
        roughnessMap: defaultRough,
        roughness: 0.8,
        color: 0xcccccc,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.0,
        roughness: 0.05,
        transmission: 0.92,
        transparent: true,
        opacity: 0.3,
        thickness: 0.5,
        ior: 1.5,
      }),
      led: new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x000000,
        emissiveIntensity: 0,
      }),
      tech: new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.5,
        metalness: 0.8,
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

        if (TABLE_PARTS.woodTop.some(n => name.includes(n)) ||
            name.toLowerCase().includes('top') || name.toLowerCase().includes('wood') || name.toLowerCase().includes('tavolo')) {
          mesh.material = materials.wood;
        } else if (TABLE_PARTS.glassLegs.some(n => name.includes(n)) ||
                   name.toLowerCase().includes('vetro') || name.toLowerCase().includes('glass') || name.toLowerCase().includes('gamba')) {
          mesh.material = materials.glass;
        } else if (TABLE_PARTS.ledStrips.some(n => name.includes(n)) ||
                   name.toLowerCase().includes('led') || name.toLowerCase().includes('strip') || name.toLowerCase().includes('light')) {
          mesh.material = materials.led.clone();
        } else if (TABLE_PARTS.techBox.some(n => name.includes(n)) ||
                   name.toLowerCase().includes('tech') || name.toLowerCase().includes('box')) {
          mesh.material = materials.tech;
        } else if (TABLE_PARTS.blockers.some(n => name.includes(n)) ||
                   name.toLowerCase().includes('tappa')) {
          mesh.visible = false;
        } else {
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
              mesh.material !== materials.glass && mesh.material !== materials.tech) {
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
    const color = WOOD_COLORS[material.id] || 0xcccccc;
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

  // React to day/night mode changes (LED emissive)
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (!mat || !mat.emissive) return;

        const isLed = TABLE_PARTS.ledStrips.some(n => mesh.name.includes(n)) ||
          mesh.name.toLowerCase().includes('led') || mesh.name.toLowerCase().includes('strip');

        if (isLed) {
          if (dayMode) {
            mat.emissive.set(0x000000);
            mat.emissiveIntensity = 0;
          } else {
            mat.emissive.set(0xF5D0A9);
            mat.emissiveIntensity = 5;
          }
        }
      }
    });
  }, [dayMode, clonedScene]);

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Pre-cache the model
useGLTF.preload(MODEL_PATHS.TABLE_LOWPOLY);
