/**
 * ConfiguratorScene — The Configurator 3D scene.
 * Camera with OrbitControls. Slow auto-rotation.
 * Floor with ShadowMaterial. Uses shared TableModel and LightingController.
 */
import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@nanostores/react';
import { isDayMode } from '../../store/configStore';
import { CAMERA_PRESETS } from '../../lib/constants';
import TableModel from './TableModel';
import LightingController from './LightingController';

export default function ConfiguratorScene() {
  const { camera, scene } = useThree();
  const dayMode = useStore(isDayMode);
  const controlsRef = useRef<any>(null);

  // Set camera to configurator preset on mount
  useEffect(() => {
    const preset = CAMERA_PRESETS.CONFIGURATOR;
    camera.position.set(...preset.position);
    (camera as THREE.PerspectiveCamera).fov = preset.fov;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    camera.lookAt(...preset.target);
  }, [camera]);

  // Set scene background based on day/night — using design token colors
  const DAY_BG = 0xF2F0EB;   // at-stone
  const NIGHT_BG = 0x1C1B1A; // at-graphite
  useEffect(() => {
    scene.background = new THREE.Color(dayMode ? DAY_BG : NIGHT_BG);
    return () => {
      scene.background = null; // Reset when unmounting
    };
  }, [dayMode, scene]);

  return (
    <>
      <group>
        <TableModel castShadow receiveShadow />
      </group>

      {/* Floor for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.15} />
      </mesh>

      <LightingController variant="configurator" shadows />

      <OrbitControls
        ref={controlsRef}
        autoRotate
        autoRotateSpeed={0.5}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={2}
        maxDistance={8}
      />
    </>
  );
}
