import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment, Grid, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { UserProfile, DressSuggestion } from '../types';
import { ArrowLeft } from 'lucide-react';

// Procedural Mannequin Component
const Mannequin = ({ measurements, dressColor }: { measurements: UserProfile['measurements']; dressColor: string }) => {
  const group = useRef<THREE.Group>(null);

  // Normalize measurements to a base scale (assuming ~36 inches is "standard" unit 1.0 for visualization)
  // These are purely visual scaling factors to represent proportion, not exact CAD.
  const getScale = (val: string) => {
    const num = parseFloat(val) || 30;
    return num / 30; // base scale
  };

  const bustScale = getScale(measurements.bust);
  const waistScale = getScale(measurements.waist);
  const hipsScale = getScale(measurements.hips);

  useFrame((state) => {
    if (group.current) {
        // Subtle breathing animation
        group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group ref={group}>
      {/* Head */}
      <mesh position={[0, 3.8, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#e2c4b8" roughness={0.5} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 32]} />
        <meshStandardMaterial color="#e2c4b8" roughness={0.5} />
      </mesh>

      {/* Torso / Dress Top */}
      <mesh position={[0, 2.2, 0]}>
         {/* Procedural dress shape: Wider at bust, narrower at waist */}
        <cylinderGeometry args={[0.7 * bustScale, 0.5 * waistScale, 1.6, 32]} />
        <meshStandardMaterial color={dressColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Skirt / Dress Bottom */}
      <mesh position={[0, 0.4, 0]}>
        {/* Procedural skirt shape: Waist to Hips/Hem */}
        <cylinderGeometry args={[0.52 * waistScale, 1.0 * hipsScale, 2.0, 32]} />
        <meshStandardMaterial color={dressColor} roughness={0.3} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Arms (Simplified) */}
      <mesh position={[-0.9 * bustScale, 2.4, 0]} rotation={[0, 0, 0.2]}>
         <cylinderGeometry args={[0.15, 0.12, 2.2, 32]} />
         <meshStandardMaterial color="#e2c4b8" roughness={0.5} />
      </mesh>
       <mesh position={[0.9 * bustScale, 2.4, 0]} rotation={[0, 0, -0.2]}>
         <cylinderGeometry args={[0.15, 0.12, 2.2, 32]} />
         <meshStandardMaterial color="#e2c4b8" roughness={0.5} />
      </mesh>

      {/* Legs */}
       <mesh position={[-0.3 * hipsScale, -1.5, 0]}>
         <cylinderGeometry args={[0.2, 0.15, 2.5, 32]} />
         <meshStandardMaterial color="#e2c4b8" roughness={0.5} />
      </mesh>
       <mesh position={[0.3 * hipsScale, -1.5, 0]}>
         <cylinderGeometry args={[0.2, 0.15, 2.5, 32]} />
         <meshStandardMaterial color="#e2c4b8" roughness={0.5} />
      </mesh>
    </group>
  );
};

interface VirtualTryOnProps {
  userProfile: UserProfile;
  selectedDress: DressSuggestion;
  onBack: () => void;
}

export const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ userProfile, selectedDress, onBack }) => {
  const primaryColor = selectedDress.colorPalette[0] || "#ec4899";

  return (
    <div className="w-full h-[calc(100vh-100px)] relative bg-slate-900">
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-4">
        <button 
            onClick={onBack}
            className="flex items-center text-white bg-slate-800/80 px-4 py-2 rounded-lg backdrop-blur hover:bg-slate-700 transition-colors w-fit"
        >
            <ArrowLeft size={20} className="mr-2" />
            Back to Results
        </button>
        
        <div className="bg-slate-800/80 backdrop-blur p-4 rounded-xl border border-slate-700 max-w-xs">
            <h3 className="text-white font-bold text-lg mb-1">{selectedDress.name}</h3>
            <p className="text-slate-400 text-sm mb-2">{selectedDress.style} Style</p>
            <div className="flex flex-wrap gap-2">
                {selectedDress.colorPalette.map((c, i) => (
                     <div key={i} className="w-6 h-6 rounded-full border border-white/20" style={{backgroundColor: c}}></div>
                ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
                Visualizing fit based on your measurements:
                <br />
                Bust: {userProfile.measurements.bust}" • Waist: {userProfile.measurements.waist}"
            </p>
        </div>
      </div>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
        
        <Stage environment="city" intensity={0.5} adjustCamera={false}>
            <Mannequin measurements={userProfile.measurements} dressColor={primaryColor} />
        </Stage>

        <Grid 
            renderOrder={-1} 
            position={[0, -2.8, 0]} 
            infiniteGrid 
            cellSize={0.6} 
            sectionSize={3} 
            fadeDistance={30} 
            sectionColor="#6d28d9" 
            cellColor="#4c1d95" 
        />
        
        <OrbitControls 
            autoRotate 
            autoRotateSpeed={0.5} 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 1.8} 
            enableZoom={true} 
            makeDefault 
        />
        
        <Environment preset="studio" />
        <ContactShadows position={[0, -2.8, 0]} opacity={0.7} scale={10} blur={2.5} far={4} />
      </Canvas>
    </div>
  );
};