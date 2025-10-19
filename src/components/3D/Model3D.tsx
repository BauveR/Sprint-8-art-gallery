import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Configurar Draco decoder para archivos comprimidos
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

interface ModelProps {
  modelPath: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  scrollRotation?: { x: number; y: number };
}

function Model({ modelPath, autoRotate = true, rotationSpeed = 0.5, scrollRotation }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef<THREE.Group>(null);

  // Modificar materiales para que sea menos plástico
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;

        if (material) {
          // Hacer el material más mate y natural (menos plástico)
          if (material.roughness !== undefined) {
            material.roughness = 0.9; // Más rugoso = menos brillo plástico
          }
          if (material.metalness !== undefined) {
            material.metalness = 0.1; // Menos metálico
          }
          // Reducir el brillo especular
          if (material.envMapIntensity !== undefined) {
            material.envMapIntensity = 0.3;
          }
          material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      if (scrollRotation) {
        // Rotación basada en scroll (diagonal) - más suave
        meshRef.current.rotation.x = THREE.MathUtils.lerp(
          meshRef.current.rotation.x,
          scrollRotation.x,
          0.03
        );
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          scrollRotation.y,
          0.03
        );
      } else if (autoRotate) {
        // Auto-rotación normal
        meshRef.current.rotation.y += delta * rotationSpeed;
      }
    }
  });

  return <primitive ref={meshRef} object={scene} scale={80} />;
}

export default function Model3D({
  modelPath,
  autoRotate = true,
  rotationSpeed = 0.5,
  className = ''
}: ModelProps & { className?: string }) {
  const [scrollRotation, setScrollRotation] = useState<{ x: number; y: number } | undefined>(undefined);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 1000; // Scroll máximo para alcanzar posición diagonal completa

      // Normalizar el scroll entre 0 y 1
      const scrollProgress = Math.min(scrollY / maxScroll, 1);

      // Rotación Y: gira continuamente
      const rotationY = (scrollY / 900) * Math.PI;

      // Rotación X: empieza en 0 y termina inclinado en diagonal (máximo 45 grados = Math.PI/4)
      const rotationX = scrollProgress * (Math.PI / 4);

      setScrollRotation({ x: rotationX, y: rotationY });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={className}>
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={1.8} />
        <hemisphereLight intensity={1.2} color="#ffffff" groundColor="#808080" />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow={false} />
        <directionalLight position={[-10, -10, -5]} intensity={0.8} castShadow={false} />
        <directionalLight position={[5, 0, 5]} intensity={0.6} castShadow={false} />
        <directionalLight position={[0, 15, 0]} intensity={1} castShadow={false} />
        <pointLight position={[0, 8, 0]} intensity={1.5} />
        <pointLight position={[0, -5, 0]} intensity={0.8} />
        <Model
          modelPath={modelPath}
          autoRotate={!scrollRotation && autoRotate}
          rotationSpeed={rotationSpeed}
          scrollRotation={scrollRotation}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
