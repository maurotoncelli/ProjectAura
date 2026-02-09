/**
 * CanvasWrapper — The single persistent R3F Canvas.
 * Lives in MainLayout with transition:persist. Never unmounts.
 * Renders Experience (Scene Manager) as its only child.
 * z-index controlled via CSS class based on active scene.
 */
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@nanostores/react';
import { activeScene } from '../../store/sceneStore';
import { Z_INDEX, CAMERA_PRESETS } from '../../lib/constants';
import Experience from './Experience';

export default function CanvasWrapper() {
  const scene = useStore(activeScene);
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);

  // Adaptive quality based on GPU tier (detect-gpu)
  useEffect(() => {
    import('detect-gpu').then((mod) => {
      // detect-gpu is CJS — handle both default and named export
      const getGPUTier = mod.getGPUTier || (mod as any).default?.getGPUTier;
      if (!getGPUTier) return;
      getGPUTier().then((gpuTier: { tier: number }) => {
        if (gpuTier.tier <= 1) {
          setDpr([1, 1]); // Low-end GPU: cap at 1x pixel ratio
        } else if (gpuTier.tier === 2) {
          setDpr([1, 1.5]); // Mid-range: cap at 1.5x
        }
        // Tier 3 keeps default [1, 2]
      });
    }).catch(() => {
      // detect-gpu failed (SSR or unsupported env) — keep defaults
    });
  }, []);

  // z-index from constants stratigraphy (inline style — Tailwind JIT can't detect dynamic z-[...])
  const zIndex =
    scene === 'HERO' ? Z_INDEX.CANVAS_HERO :
    scene === 'CONFIGURATOR' ? Z_INDEX.CANVAS_CONFIG :
    0;
  const pointerClass = scene === 'NONE' ? 'pointer-events-none' : '';

  return (
    <div
      id="r3f-canvas-root"
      className={`fixed inset-0 ${pointerClass} transition-opacity duration-500`}
      style={{ zIndex, opacity: scene === 'NONE' ? 0 : 1 }}
    >
      <Canvas
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        camera={{
          fov: CAMERA_PRESETS.HERO_INITIAL.fov,
          near: 0.1,
          far: 100,
          position: CAMERA_PRESETS.HERO_INITIAL.position,
        }}
        frameloop={scene === 'NONE' ? 'never' : 'always'}
        style={{ background: 'transparent' }}
      >
        <Experience />
      </Canvas>
    </div>
  );
}
