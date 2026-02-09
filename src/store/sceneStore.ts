import { atom } from 'nanostores';
import type { SceneType } from '../types/product';

export const activeScene = atom<SceneType>('HERO');
export const cameraPosition = atom<[number, number, number]>([0, 0.5, 4.5]);
export const cameraTarget = atom<[number, number, number]>([0, 0.3, 0]);
export const tableRotation = atom<[number, number, number]>([0.1, 0, 0]);
export const tableScale = atom<number>(1.0);

export function setActiveScene(scene: SceneType) {
  activeScene.set(scene);
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
