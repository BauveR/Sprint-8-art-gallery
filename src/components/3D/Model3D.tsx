import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

interface ModelProps {
  modelPath: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  scale?: number | { mobile?: number; tablet?: number; desktop?: number };
  initialRotation?: { x?: number; y?: number; z?: number };
  position?: [number, number, number] | { mobile?: [number, number, number]; tablet?: [number, number, number]; desktop?: [number, number, number] };
}

function Model({ modelPath, autoRotate = true, rotationSpeed = 0.5, scale = 80, initialRotation, position = [0, 0, 0] }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (meshRef.current && initialRotation) {
      if (initialRotation.x !== undefined) meshRef.current.rotation.x = initialRotation.x;
      if (initialRotation.y !== undefined) meshRef.current.rotation.y = initialRotation.y;
      if (initialRotation.z !== undefined) meshRef.current.rotation.z = initialRotation.z;
    }
  }, [initialRotation]);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material) {
          if (material.roughness !== undefined) material.roughness = 0.9;
          if (material.metalness !== undefined) material.metalness = 0.1;
          if (material.envMapIntensity !== undefined) material.envMapIntensity = 0.3;
          material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame((_state, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return <primitive ref={meshRef} object={scene} scale={scale} position={position} />;
}

const noEvents = () => ({
  enabled: false,
  priority: 0,
  compute: () => {},
  connected: undefined,
  handlers: {} as any,
  connect: () => {},
  disconnect: () => {},
  update: () => {},
});

export default function Model3D({
  modelPath,
  autoRotate = true,
  rotationSpeed = 0.5,
  scale = 80,
  initialRotation,
  position = [0, 0, 0],
  className = ''
}: ModelProps & { className?: string }) {
  const [currentScale, setCurrentScale] = useState<number>(80);
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>([0, 0, 0]);
  const eventSourceRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const updateResponsiveProps = () => {
      const width = window.innerWidth;
      if (typeof scale === 'object') {
        if (width < 768) setCurrentScale(scale.mobile ?? 60);
        else if (width < 1024) setCurrentScale(scale.tablet ?? 70);
        else setCurrentScale(scale.desktop ?? 80);
      } else {
        setCurrentScale(scale);
      }
      if (Array.isArray(position)) {
        setCurrentPosition(position);
      } else {
        if (width < 768) setCurrentPosition(position.mobile ?? [0, 0, 0]);
        else if (width < 1024) setCurrentPosition(position.tablet ?? [0, 0, 0]);
        else setCurrentPosition(position.desktop ?? [0, 0, 0]);
      }
    };
    updateResponsiveProps();
    window.addEventListener('resize', updateResponsiveProps);
    return () => window.removeEventListener('resize', updateResponsiveProps);
  }, [scale, position]);

  return (
    <div ref={eventSourceRef} className={className} style={{ pointerEvents: 'none' }}>
      <Canvas
        gl={{
          alpha: true,
          antialias: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: "high-performance",
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        performance={{ min: 0.5 }}
        style={{ background: 'transparent' }}
        eventSource={eventSourceRef}
        events={noEvents}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={2} />
        <hemisphereLight intensity={1.2} color="#ffffff" groundColor="#808080" />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow={false} />
        <Model
          modelPath={modelPath}
          autoRotate={autoRotate}
          rotationSpeed={rotationSpeed}
          scale={currentScale}
          initialRotation={initialRotation}
          position={currentPosition}
        />
      </Canvas>
    </div>
  );
}
