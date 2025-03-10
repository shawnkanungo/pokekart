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

export function Game() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <Physics>
            <Environment preset="sunset" />
            <PerspectiveCamera makeDefault position={[0, 5, 10]} />
            <OrbitControls />
            
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
    </div>
  );
} 