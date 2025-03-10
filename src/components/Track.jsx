import React from 'react';
import { usePlane } from '@react-three/cannon';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function Track() {
  // Ground plane with physics
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: {
      friction: 0.8,
      restitution: 0.2
    }
  }));

  // Load textures
  const grassTexture = useTexture('/textures/grass.jpg');
  const trackTexture = useTexture('/textures/track.jpg');

  // Track points for the racing circuit
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

  // Create track curve
  const curve = new THREE.CatmullRomCurve3(trackPoints);
  const trackGeometry = new THREE.TubeGeometry(curve, 2000, 5, 8, false);

  return (
    <>
      {/* Ground plane */}
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial map={grassTexture} />
      </mesh>

      {/* Track surface */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <primitive object={trackGeometry} />
        <meshStandardMaterial map={trackTexture} />
      </mesh>

      {/* Track barriers */}
      {trackPoints.map((point, index) => {
        if (index < trackPoints.length - 1) {
          const nextPoint = trackPoints[index + 1];
          const direction = nextPoint.clone().sub(point);
          const length = direction.length();
          direction.normalize();

          return (
            <mesh
              key={index}
              position={point}
              rotation={[0, Math.atan2(direction.x, direction.z), 0]}
              scale={[0.2, 0.5, length]}
            >
              <boxGeometry />
              <meshStandardMaterial color="red" />
            </mesh>
          );
        }
        return null;
      })}

      {/* Checkpoints */}
      {trackPoints.map((point, index) => (
        <mesh key={`checkpoint-${index}`} position={[point.x, 0.3, point.z]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="gold"
            emissive="gold"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </>
  );
} 