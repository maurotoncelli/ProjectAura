/**
 * TableModel — The shared GLTF table model (v2).
 * Used by both HeroScene and ConfiguratorScene (zero duplication).
 * Reads selectedMaterial and isDayMode from configStore for material switching.
 * Uses TABLE_PARTS from constants for semantic node mapping.
 * Textures are loaded dynamically from the selectedMaterial data (products.json).
 *
 * Model: tavololowpoly_versione2.glb
 * Mesh hierarchy: Table_master > Table_top, Table_Legs, Table_LEDs
 */
import { useRef, useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@nanostores/react';
import { selectedMaterial, isDayMode, ledColorHue } from '../../store/configStore';
import { TABLE_PARTS, MODEL_PATHS } from '../../lib/constants';

// Per-material appearance overrides.
// color: tint multiplied on texture (0xffffff = no tint).
// roughness / envMapIntensity / normalScale: surface feel per wood.
const WOOD_PROPS: Record<string, { color: number; roughness: number; envMapIntensity: number; normalScale: number }> = {
  rovere:   { color: 0xffffff, roughness: 0.95, envMapIntensity: 0.3, normalScale: 1.5 },
  cipresso: { color: 0xfcf8f0, roughness: 0.95, envMapIntensity: 0.3, normalScale: 1.5 },
  noce:     { color: 0xdecfbe, roughness: 1.0,  envMapIntensity: 0.08, normalScale: 2.0 },
};

// Shared texture loader (reused across loads)
const textureLoader = new THREE.TextureLoader();

/**
 * Load and configure a texture from a given path.
 * @param path - URL to the texture image
 * @param scaleY - optional V-axis repeat (corresponds to Blender Mapping Scale Y)
 * @param isSRGB - whether to set SRGBColorSpace (true for Color maps, false for data maps)
 */
function loadTexture(path: string, scaleY?: number, isSRGB = true): THREE.Texture {
  const tex = textureLoader.load(path);
  tex.flipY = false;
  tex.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;

  if (scaleY && scaleY !== 1) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, scaleY);
  }

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
    const defaultScaleY = 1.8; // Noce Canaletto default
    const defaultColor = loadTexture('/textures/WoodFloor043_1K-JPG_Color.jpg', defaultScaleY, true);
    const defaultNormal = loadTexture('/textures/WoodFloor043_1K-JPG_NormalGL.jpg', defaultScaleY, false);
    const defaultRough = loadTexture('/textures/WoodFloor043_1K-JPG_Roughness.jpg', defaultScaleY, false);
    loadedTexturesRef.current = [defaultColor, defaultNormal, defaultRough];

    return {
      wood: new THREE.MeshStandardMaterial({
        map: defaultColor,
        normalMap: defaultNormal,
        normalScale: new THREE.Vector2(1.5, 1.5),
        roughnessMap: defaultRough,
        roughness: 0.95,
        metalness: 0.0,
        color: 0xffffff,
        envMapIntensity: 0.3,
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
        toneMapped: false,
        roughness: 1,
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

        if (TABLE_PARTS.woodPlanks.some(n => name.includes(n))) {
          mesh.material = materials.wood;
        } else if (TABLE_PARTS.glassLegs.some(n => name.includes(n))) {
          mesh.material = materials.glass;
        } else if (TABLE_PARTS.ledStrips.some(n => name.includes(n))) {
          mesh.material = materials.led.clone();
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
      loadedTexturesRef.current.forEach(tex => tex.dispose());
      loadedTexturesRef.current = [];

      Object.values(materials).forEach(mat => mat.dispose());

      // Dispose cloned LED material instances
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material && mesh.material !== materials.wood &&
              mesh.material !== materials.glass && mesh.material !== materials.led) {
            (mesh.material as THREE.Material).dispose();
          }
        }
      });
    };
  }, [materials, clonedScene]);

  // React to material changes: load new textures from data layer and apply per-material appearance
  useEffect(() => {
    if (!material) return;

    const props = WOOD_PROPS[material.id] || WOOD_PROPS.rovere;
    materials.wood.color.set(props.color);
    materials.wood.roughness = props.roughness;
    materials.wood.envMapIntensity = props.envMapIntensity;
    materials.wood.normalScale.set(props.normalScale, props.normalScale);

    const scaleY = material.textureScaleY || 1;
    const newTextures: THREE.Texture[] = [];

    if (material.texturePath) {
      const colorTex = loadTexture(material.texturePath, scaleY, true);
      materials.wood.map?.dispose();
      materials.wood.map = colorTex;
      newTextures.push(colorTex);
    }

    if (material.textureNormal) {
      const normalTex = loadTexture(material.textureNormal, scaleY, false);
      materials.wood.normalMap?.dispose();
      materials.wood.normalMap = normalTex;
      newTextures.push(normalTex);
    }

    if (material.textureRoughness) {
      const roughTex = loadTexture(material.textureRoughness, scaleY, false);
      (materials.wood as any).roughnessMap?.dispose();
      materials.wood.roughnessMap = roughTex;
      newTextures.push(roughTex);
    }

    materials.wood.needsUpdate = true;
    loadedTexturesRef.current = newTextures;

    return () => {
      newTextures.forEach(tex => tex.dispose());
    };
  }, [material, materials]);

  // React to day/night + LED hue changes (LED emissive color)
  useEffect(() => {
    const ledColor = new THREE.Color().setHSL(hue / 360, 0.9, 0.6);

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (!mat || !mat.emissive) return;

        const isLed = TABLE_PARTS.ledStrips.some(n => mesh.name.includes(n));

        if (isLed) {
          mat.toneMapped = false;
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
