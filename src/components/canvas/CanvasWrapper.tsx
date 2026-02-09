/**
 * CanvasWrapper — The single persistent R3F Canvas.
 * Lives in MainLayout with transition:persist. Never unmounts.
 * Renders Experience (Scene Manager) as its only child.
 *
 * IMPORTANT: Opacity is driven EXCLUSIVELY by React (via isCanvasVisible store).
 * NEVER use GSAP to animate #r3f-canvas-root opacity — React will override it on re-render.
 * CSS transition-opacity handles the smooth fade.
 */
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@nanostores/react';
import { activeScene, isCanvasVisible } from '../../store/sceneStore';
import { Z_INDEX, CAMERA_PRESETS } from '../../lib/constants';
import Experience from './Experience';

export default function CanvasWrapper() {
  const scene = useStore(activeScene);
  const canvasVisible = useStore(isCanvasVisible);
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);

  // Adaptive quality based on GPU tier (detect-gpu)
  useEffect(() => {
    import('detect-gpu').then((mod) => {
      const getGPUTier = mod.getGPUTier || (mod as any).default?.getGPUTier;
      if (!getGPUTier) return;
      getGPUTier().then((gpuTier: { tier: number }) => {
        if (gpuTier.tier <= 1) {
          setDpr([1, 1]);
        } else if (gpuTier.tier === 2) {
          setDpr([1, 1.5]);
        }
      });
    }).catch(() => {});
  }, []);

  // Derived state: should canvas be visible?
  const isVisible = scene !== 'NONE' && canvasVisible;

  // z-index from constants
  const zIndex =
    scene === 'HERO' ? Z_INDEX.CANVAS_HERO :
    scene === 'CONFIGURATOR' ? Z_INDEX.CANVAS_CONFIG :
    0;

  return (
    <div
      id="r3f-canvas-root"
      className="fixed inset-0 transition-opacity duration-500"
      style={{
        zIndex,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <Canvas
        shadows
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.6,
        }}
        camera={{
          fov: CAMERA_PRESETS.HERO_INITIAL.fov,
          near: 0.1,
          far: 100,
          position: CAMERA_PRESETS.HERO_INITIAL.position,
        }}
        frameloop={isVisible ? 'always' : 'never'}
        style={{ background: 'transparent' }}
      >
        <Experience />
      </Canvas>
    </div>
  );
}
