import React, { useState, useEffect } from 'react';
import { useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ITEMS = {
  POKEBALL: { name: 'Pokéball', effect: 'catch', color: 0xff0000 },
  POTION: { name: 'Potion', effect: 'heal', color: 0x00ff00 },
  BERRY: { name: 'Berry', effect: 'boost', color: 0xff00ff }
};

export function Items() {
  const [items, setItems] = useState([]);

  // Initialize items
  useEffect(() => {
    const positions = [
      new THREE.Vector3(-10, 0.5, -10),
      new THREE.Vector3(10, 0.5, -10),
      new THREE.Vector3(10, 0.5, 10),
      new THREE.Vector3(-10, 0.5, 10)
    ];

    const newItems = positions.map(pos => ({
      position: pos,
      type: Object.values(ITEMS)[Math.floor(Math.random() * Object.keys(ITEMS).length)],
      visible: true
    }));

    setItems(newItems);
  }, []);

  // Animate items
  useFrame((state, delta) => {
    setItems(prev => prev.map(item => ({
      ...item,
      position: {
        ...item.position,
        y: 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      }
    })));
  });

  return (
    <>
      {items.map((item, index) => (
        item.visible && (
          <Item
            key={index}
            position={item.position}
            type={item.type}
            onCollect={() => {
              setItems(prev => prev.map((i, idx) => 
                idx === index ? { ...i, visible: false } : i
              ));
            }}
          />
        )
      ))}
    </>
  );
}

function Item({ position, type, onCollect }) {
  const [ref, api] = useBox(() => ({
    mass: 0,
    position: [position.x, position.y, position.z],
    args: [0.5, 0.5, 0.5],
    material: {
      friction: 0.3,
      restitution: 0.6
    }
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial
        color={type.color}
        emissive={type.color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
} 