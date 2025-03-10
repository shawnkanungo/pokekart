import React, { useState, useEffect } from 'react';
import { useSphere } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const POWER_UPS = {
  MUSHROOM: { name: 'Mushroom', effect: 'speed', duration: 5, color: 0xff0000 },
  STAR: { name: 'Star', effect: 'invincibility', duration: 8, color: 0xffff00 },
  THUNDER: { name: 'Thunder', effect: 'attack', duration: 3, color: 0x00ffff }
};

export function PowerUps() {
  const [powerUps, setPowerUps] = useState([]);

  // Initialize power-ups
  useEffect(() => {
    const positions = [
      new THREE.Vector3(-15, 0.5, -15),
      new THREE.Vector3(15, 0.5, -15),
      new THREE.Vector3(15, 0.5, 15),
      new THREE.Vector3(-15, 0.5, 15)
    ];

    const newPowerUps = positions.map(pos => ({
      position: pos,
      type: Object.values(POWER_UPS)[Math.floor(Math.random() * Object.keys(POWER_UPS).length)],
      visible: true
    }));

    setPowerUps(newPowerUps);
  }, []);

  // Animate power-ups
  useFrame((state, delta) => {
    setPowerUps(prev => prev.map(powerUp => ({
      ...powerUp,
      position: {
        ...powerUp.position,
        y: 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      }
    })));
  });

  return (
    <>
      {powerUps.map((powerUp, index) => (
        powerUp.visible && (
          <PowerUp
            key={index}
            position={powerUp.position}
            type={powerUp.type}
            onCollect={() => {
              setPowerUps(prev => prev.map((p, i) => 
                i === index ? { ...p, visible: false } : p
              ));
            }}
          />
        )
      ))}
    </>
  );
}

function PowerUp({ position, type, onCollect }) {
  const [ref, api] = useSphere(() => ({
    mass: 0,
    position: [position.x, position.y, position.z],
    args: [0.5],
    material: {
      friction: 0.3,
      restitution: 0.6
    }
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={type.color}
        emissive={type.color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
} 