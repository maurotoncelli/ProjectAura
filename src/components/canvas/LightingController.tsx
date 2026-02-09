/**
 * LightingController — Manages scene lighting based on isDayMode.
 * Animates transitions between day (ambient sun) and night (LED glow) using useFrame + lerp.
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@nanostores/react';
import { isDayMode } from '../../store/configStore';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface LightingControllerProps {
  /** Whether to enable shadows on directional light */
  shadows?: boolean;
  /** Whether this is the hero (uses RectAreaLight) or config (uses PointLight) scene */
  variant?: 'hero' | 'configurator';
}

export default function LightingController({ shadows = false, variant = 'hero' }: LightingControllerProps) {
  const dayMode = useStore(isDayMode);

  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const pointRef = useRef<THREE.PointLight>(null);

  // Target intensities based on day/night
  const targetAmbient = dayMode ? (variant === 'hero' ? 0.8 : 0.6) : 0.05;
  const targetDir = dayMode ? (variant === 'hero' ? 1.0 : 1.2) : 0;
  const targetLed = dayMode ? 0 : (variant === 'hero' ? 5 : 3);

  useFrame(() => {
    const speed = 0.05; // Smooth transition speed

    if (ambientRef.current) {
      ambientRef.current.intensity = lerp(ambientRef.current.intensity, targetAmbient, speed);
    }
    if (dirRef.current) {
      dirRef.current.intensity = lerp(dirRef.current.intensity, targetDir, speed);
    }
    if (pointRef.current) {
      pointRef.current.intensity = lerp(pointRef.current.intensity, targetLed, speed);
      // Warm LED color
      if (!dayMode) {
        pointRef.current.color.lerp(new THREE.Color(0xF5D0A9), speed);
      }
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={dayMode ? 0.8 : 0.05} />
      <directionalLight
        ref={dirRef}
        position={[5, 10, 7]}
        intensity={dayMode ? 1.0 : 0}
        castShadow={shadows}
        shadow-mapSize-width={shadows ? 2048 : 512}
        shadow-mapSize-height={shadows ? 2048 : 512}
      />
      <pointLight
        ref={pointRef}
        position={[0, 0.7, 0]}
        intensity={dayMode ? 0 : 3}
        color={0xF5D0A9}
        distance={5}
      />
    </>
  );
}
