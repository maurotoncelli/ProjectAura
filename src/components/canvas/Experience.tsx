/**
 * Experience — Scene Manager.
 * Reads activeScene from sceneStore and conditionally renders
 * the appropriate scene (HeroScene or ConfiguratorScene).
 */
import { useStore } from '@nanostores/react';
import { activeScene } from '../../store/sceneStore';
import HeroScene from './HeroScene';
import ConfiguratorScene from './ConfiguratorScene';

export default function Experience() {
  const scene = useStore(activeScene);

  return (
    <>
      {scene === 'HERO' && <HeroScene />}
      {scene === 'CONFIGURATOR' && <ConfiguratorScene />}
    </>
  );
}
