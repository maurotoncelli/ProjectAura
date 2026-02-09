/**
 * HeroScene — The Hero 3D scene.
 * Camera fixed (driven by GSAP scroll via nanostores bridge).
 * No OrbitControls. Uses shared TableModel and LightingController.
 */
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@nanostores/react';
import { tableRotation, tableScale } from '../../store/sceneStore';
import { CAMERA_PRESETS, TABLE_STATES } from '../../lib/constants';
import TableModel from './TableModel';
import LightingController from './LightingController';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function HeroScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Read scroll-driven transforms from nanostores
  const rotation = useStore(tableRotation);
  const scale = useStore(tableScale);

  // Set camera to hero preset on mount
  useEffect(() => {
    const preset = CAMERA_PRESETS.HERO_INITIAL;
    camera.position.set(...preset.position);
    (camera as THREE.PerspectiveCamera).fov = preset.fov;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    camera.lookAt(...preset.target);
  }, [camera]);

  // Apply scroll-driven rotation and scale smoothly
  useFrame(() => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    const speed = 0.08;

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
      <group ref={groupRef} rotation={TABLE_STATES.HERO_IDLE.rotation}>
        <TableModel />
      </group>
      <LightingController variant="hero" />
    </>
  );
}
