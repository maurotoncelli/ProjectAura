/**
 * HeroScene — The Hero 3D scene.
 * Camera fixed (driven by GSAP scroll via nanostores bridge).
 * No OrbitControls. Uses shared TableModel and LightingController.
 */
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@nanostores/react';
import { tableRotation, tableScale, DEFAULT_TABLE_ROTATION } from '../../store/sceneStore';
import { CAMERA_PRESETS } from '../../lib/constants';
import { lerp } from '../../lib/3d-helpers';
import TableModel from './TableModel';
import LightingController from './LightingController';

export default function HeroScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Read scroll-driven transforms from nanostores
  const rotation = useStore(tableRotation);
  const scale = useStore(tableScale);

  // Set camera to hero preset + initial table rotation on mount
  useEffect(() => {
    const preset = CAMERA_PRESETS.HERO_INITIAL;
    camera.position.set(...preset.position);
    (camera as THREE.PerspectiveCamera).fov = preset.fov;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    camera.lookAt(...preset.target);

    // Set initial rotation imperatively (NOT via JSX prop).
    // JSX rotation prop + useStore re-renders + useFrame = conflict.
    if (groupRef.current) {
      groupRef.current.rotation.set(...DEFAULT_TABLE_ROTATION);
    }
  }, [camera]);

  // Apply scroll-driven rotation and scale smoothly.
  // rotation/scale come from nanostores (written by GSAP ScrollTrigger).
  useFrame(() => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    const speed = 0.12;

    g.rotation.x = lerp(g.rotation.x, rotation[0], speed);
    g.rotation.y = lerp(g.rotation.y, rotation[1], speed);
    g.rotation.z = lerp(g.rotation.z, rotation[2], speed);

    const s = scale;
    g.scale.x = lerp(g.scale.x, s, speed);
    g.scale.y = lerp(g.scale.y, s, speed);
    g.scale.z = lerp(g.scale.z, s, speed);
  });

  return (
    <>
      {/* No rotation/scale JSX props — useFrame is the sole controller */}
      <group ref={groupRef}>
        <TableModel />
      </group>

      {/* No floor in Hero — the table animates freely during scroll (zoom, rotation,
          belly-view). A floor would clip through the model during these transforms.
          Shadows and LED bounce are handled only in the Configurator scene. */}
      <LightingController variant="hero" />
    </>
  );
}
