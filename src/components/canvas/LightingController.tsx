/**
 * LightingController — Manages scene lighting based on isDayMode.
 * Animates transitions between day (ambient sun + hemisphere) and night (LED glow + bounce).
 * THREE.Color objects are cached outside the frame loop to avoid per-frame allocations.
 *
 * Day setup:  AmbientLight (fill) + DirectionalLight (sun) + HemisphereLight (sky/ground)
 * Night setup: Minimal ambient + LED bounce PointLights (warm glow on floor/glass)
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@nanostores/react';
import { isDayMode, ledColorHue } from '../../store/configStore';
import { lerp } from '../../lib/3d-helpers';

// Cached colors — NEVER allocate inside useFrame
const NEUTRAL_COLOR = new THREE.Color(0xffffff);
const SKY_COLOR = new THREE.Color(0xF2F0EB);     // at-stone (warm sky)
const GROUND_COLOR = new THREE.Color(0x96705B);   // at-oak (warm ground bounce)
// Reusable color object for hue-to-color conversion (avoids per-frame allocation)
const _hueColor = new THREE.Color();

interface LightingControllerProps {
  /** Whether to enable shadows on directional light */
  shadows?: boolean;
  /** Whether this is the hero or configurator scene */
  variant?: 'hero' | 'configurator';
}

export default function LightingController({ shadows = false, variant = 'hero' }: LightingControllerProps) {
  const dayMode = useStore(isDayMode);
  const hue = useStore(ledColorHue);

  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  // LED bounce lights (2 point lights positioned under the table, one per side)
  const ledBounce1Ref = useRef<THREE.PointLight>(null);
  const ledBounce2Ref = useRef<THREE.PointLight>(null);

  // Target intensities based on day/night
  // Configurator night gets a soft "moonlight" directional (0.4) to reveal table volumes
  const targetAmbient = dayMode ? 0.8 : (variant === 'configurator' ? 0.35 : 0.15);
  const targetDir = dayMode ? (variant === 'hero' ? 2.8 : 3.0) : (variant === 'configurator' ? 0.4 : 0);
  const targetHemi = dayMode ? 1.0 : (variant === 'configurator' ? 0.2 : 0.08);
  const targetLedBounce = dayMode ? 0 : (variant === 'hero' ? 6 : 5);

  // Convert hue (0-360) to THREE.Color for LED bounce lights
  // Saturation 0.8, Lightness 0.65 gives vibrant but not neon colors
  _hueColor.setHSL(hue / 360, 0.8, 0.65);

  useFrame(() => {
    const speed = 0.08; // Smooth transition speed

    if (ambientRef.current) {
      ambientRef.current.intensity = lerp(ambientRef.current.intensity, targetAmbient, speed);
    }
    if (dirRef.current) {
      dirRef.current.intensity = lerp(dirRef.current.intensity, targetDir, speed);
    }
    if (hemiRef.current) {
      hemiRef.current.intensity = lerp(hemiRef.current.intensity, targetHemi, speed);
    }
    // LED bounce lights — animate intensity + color toward current hue
    [ledBounce1Ref, ledBounce2Ref].forEach(ref => {
      if (ref.current) {
        ref.current.intensity = lerp(ref.current.intensity, targetLedBounce, speed);
        if (!dayMode) {
          ref.current.color.lerp(_hueColor, speed);
        } else {
          ref.current.color.lerp(NEUTRAL_COLOR, speed);
        }
      }
    });
  });

  return (
    <>
      {/* Base ambient fill — 0.15 at night for soft penumbra on the table */}
      <ambientLight ref={ambientRef} intensity={dayMode ? 0.8 : 0.15} />

      {/* Directional "sun" light — main shadow caster */}
      <directionalLight
        ref={dirRef}
        position={[5, 10, 7]}
        intensity={dayMode ? 2.8 : 0.0}
        castShadow={shadows}
        shadow-mapSize-width={shadows ? 2048 : 512}
        shadow-mapSize-height={shadows ? 2048 : 512}
        shadow-camera-far={50}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0001}
      />

      {/* Hemisphere light — warm sky + warm ground bounce for natural daylight feel */}
      <hemisphereLight
        ref={hemiRef}
        args={[SKY_COLOR, GROUND_COLOR, dayMode ? 1.0 : 0.08]}
      />

      {/* LED bounce light 1 — positioned under table, front side.
          High intensity + wide distance for visible warm pool on floor and glass legs. */}
      <pointLight
        ref={ledBounce1Ref}
        position={[0, 0.15, -0.6]}
        intensity={dayMode ? 0 : 6}
        color={0xF5D0A9}
        distance={5}
        decay={2}
      />
      {/* LED bounce light 2 — positioned under table, back side */}
      <pointLight
        ref={ledBounce2Ref}
        position={[0, 0.15, 0.6]}
        intensity={dayMode ? 0 : 6}
        color={0xF5D0A9}
        distance={5}
        decay={2}
      />
    </>
  );
}
