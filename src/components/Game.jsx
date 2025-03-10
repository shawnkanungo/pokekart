import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Car } from './Car';
import { Track } from './Track';
import { PowerUps } from './PowerUps';
import { Items } from './Items';
import { Checkpoints } from './Checkpoints';
import { HUD } from './HUD';
import { ControlPanel } from './ControlPanel';

export function Game() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <Physics>
            <Environment preset="sunset" />
            <PerspectiveCamera makeDefault position={[0, 1, 2]} />
            <OrbitControls 
              minDistance={1}
              maxDistance={5}
              target={[0, 0, 0]}
            />
            
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
            />
            
            {/* Game Elements */}
            <Track />
            <Car />
            <PowerUps />
            <Items />
            <Checkpoints />
          </Physics>
        </Suspense>
      </Canvas>
      <HUD />
      <ControlPanel />
    </div>
  );
} 