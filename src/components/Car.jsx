import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function Car() {
  const [speed, setSpeed] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isPOVMode, setIsPOVMode] = useState(false);
  
  // Car physics
  const [ref, api] = useBox(() => ({
    mass: 1500,
    position: [0, 0.5, 0],
    rotation: [0, 0, 0],
    args: [2, 0.5, 4],
    material: {
      friction: 0.8,
      restitution: 0.2
    }
  }));

  // Load car model
  const { nodes, materials } = useGLTF('/models/car.glb');

  // Handle keyboard controls
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      switch(event.keyCode) {
        case 38: // Up arrow
          setSpeed(prev => Math.min(prev + 0.1, 5));
          break;
        case 40: // Down arrow
          setSpeed(prev => Math.max(prev - 0.1, -2.5));
          break;
        case 37: // Left arrow
          setRotation(prev => prev + 0.02);
          break;
        case 39: // Right arrow
          setRotation(prev => prev - 0.02);
          break;
        case 86: // V key
          setIsPOVMode(prev => !prev);
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch(event.keyCode) {
        case 38:
        case 40:
          setSpeed(0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Update car position and rotation
  useFrame((state, delta) => {
    if (!ref.current) return;

    const position = ref.current.position;
    const rotation = ref.current.rotation;

    // Apply movement
    position.x += Math.sin(rotation.y) * speed * delta;
    position.z += Math.cos(rotation.y) * speed * delta;

    // Apply rotation
    rotation.y += rotation * delta;

    // Update physics body
    api.position.set(position.x, position.y, position.z);
    api.rotation.set(rotation.x, rotation.y, rotation.z);

    // Update camera position based on POV mode
    if (isPOVMode) {
      // First-person POV camera (closer to dashboard)
      state.camera.position.x = position.x;
      state.camera.position.y = position.y + 0.8; // Lower eye level
      state.camera.position.z = position.z;
      
      // Make camera look closer in front
      const lookAtX = position.x + Math.sin(rotation.y) * 1;
      const lookAtZ = position.z + Math.cos(rotation.y) * 1;
      state.camera.lookAt(lookAtX, position.y + 0.8, lookAtZ);
    } else {
      // Third-person camera (closer to car)
      state.camera.position.x = position.x;
      state.camera.position.z = position.z + 4; // Reduced from 20 to 4
      state.camera.position.y = 2; // Reduced from 10 to 2
      state.camera.lookAt(position.x, position.y, position.z);
    }
  });

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <primitive object={nodes.Car} />
    </mesh>
  );
}

useGLTF.preload('/models/car.glb'); 