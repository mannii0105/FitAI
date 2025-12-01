import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group>
        <Torus ref={meshRef} args={[1.8, 0.4, 32, 100]} position={[0, 0, -2]}>
          <MeshDistortMaterial
            color="#8b5cf6" // Violet 500
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0}
            metalness={0.1}
            distort={0.3}
            speed={2}
          />
        </Torus>
        <Sphere args={[0.8, 32, 32]} position={[0, 0, -2]}>
             <meshStandardMaterial
                color="#ec4899" // Pink 500
                emissive="#ec4899"
                emissiveIntensity={0.5}
                roughness={0.1}
             />
        </Sphere>
      </group>
    </Float>
  );
};

export const Hero3D = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="cyan" intensity={0.5} />
        <AnimatedShape />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};
