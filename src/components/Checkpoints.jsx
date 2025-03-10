import React, { useState, useEffect } from 'react';
import { useSphere } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Checkpoints() {
  const [checkpoints, setCheckpoints] = useState([]);
  const [lapCount, setLapCount] = useState(0);
  const [lastCheckpoint, setLastCheckpoint] = useState(-1);

  // Track points for checkpoints
  const trackPoints = [
    new THREE.Vector3(-400, 0.2, 0),
    new THREE.Vector3(-200, 0.2, 0),
    new THREE.Vector3(-100, 0.2, -100),
    new THREE.Vector3(0, 0.2, -200),
    new THREE.Vector3(200, 0.2, -200),
    new THREE.Vector3(300, 0.2, -100),
    new THREE.Vector3(400, 0.2, 0),
    new THREE.Vector3(400, 0.2, 200),
    new THREE.Vector3(300, 0.2, 300),
    new THREE.Vector3(200, 0.2, 400),
    new THREE.Vector3(0, 0.2, 400),
    new THREE.Vector3(-200, 0.2, 300),
    new THREE.Vector3(-300, 0.2, 200),
    new THREE.Vector3(-300, 0.2, 0),
    new THREE.Vector3(-400, 0.2, 0)
  ];

  // Initialize checkpoints
  useEffect(() => {
    const newCheckpoints = trackPoints.map((point, index) => ({
      position: point,
      passed: false,
      radius: 20
    }));

    setCheckpoints(newCheckpoints);
  }, []);

  // Animate checkpoints
  useFrame((state, delta) => {
    setCheckpoints(prev => prev.map(checkpoint => ({
      ...checkpoint,
      position: {
        ...checkpoint.position,
        y: 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      }
    })));
  });

  // Handle checkpoint passing
  const handleCheckpointPass = (index) => {
    setCheckpoints(prev => prev.map((checkpoint, i) => 
      i === index ? { ...checkpoint, passed: true } : checkpoint
    ));

    if (index === 0 && lastCheckpoint === checkpoints.length - 1) {
      setLapCount(prev => {
        const newLapCount = prev + 1;
        if (newLapCount >= 3) {
          alert('Race Complete!');
          resetGame();
        }
        return newLapCount;
      });
    }

    setLastCheckpoint(index);
  };

  // Reset game
  const resetGame = () => {
    setLapCount(0);
    setLastCheckpoint(-1);
    setCheckpoints(prev => prev.map(checkpoint => ({
      ...checkpoint,
      passed: false
    })));
  };

  return (
    <>
      {checkpoints.map((checkpoint, index) => (
        <Checkpoint
          key={index}
          position={checkpoint.position}
          passed={checkpoint.passed}
          radius={checkpoint.radius}
          onPass={() => handleCheckpointPass(index)}
        />
      ))}
    </>
  );
}

function Checkpoint({ position, passed, radius, onPass }) {
  const [ref, api] = useSphere(() => ({
    mass: 0,
    position: [position.x, position.y, position.z],
    args: [radius],
    material: {
      friction: 0.3,
      restitution: 0.6
    }
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={passed ? 0x00ff00 : 0xffd700}
        emissive={passed ? 0x00ff00 : 0xffd700}
        emissiveIntensity={passed ? 1 : 0.5}
      />
    </mesh>
  );
} 