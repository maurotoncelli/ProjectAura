import { atom } from 'nanostores';
import type { SceneType } from '../types/product';

// Default hero rotation: slight X tilt for perspective, Y=π/2 to show the LONG side
// (the model's long axis is along Z; rotating 90° on Y brings it to face the camera)
export const DEFAULT_TABLE_ROTATION: [number, number, number] = [0.1, Math.PI / 2, 0];
export const DEFAULT_TABLE_SCALE = 1.0;

export const activeScene = atom<SceneType>('HERO');
export const isCanvasVisible = atom<boolean>(true);
export const cameraPosition = atom<[number, number, number]>([0, 0.5, 4.5]);
export const cameraTarget = atom<[number, number, number]>([0, 0.3, 0]);
export const tableRotation = atom<[number, number, number]>([...DEFAULT_TABLE_ROTATION]);
export const tableScale = atom<number>(DEFAULT_TABLE_SCALE);

export function setActiveScene(scene: SceneType) {
  activeScene.set(scene);
}

export function setCanvasVisible(visible: boolean) {
  isCanvasVisible.set(visible);
}

/**
 * Reset table transform to hero idle defaults.
 * Called on page transitions and initial load to prevent stale state.
 */
export function resetTableState() {
  tableRotation.set([...DEFAULT_TABLE_ROTATION]);
  tableScale.set(DEFAULT_TABLE_SCALE);
}

export function setCameraPosition(position: [number, number, number]) {
  cameraPosition.set(position);
}

export function setCameraTarget(target: [number, number, number]) {
  cameraTarget.set(target);
}

export function setTableRotation(rotation: [number, number, number]) {
  tableRotation.set(rotation);
}

export function setTableScale(scale: number) {
  tableScale.set(scale);
}
