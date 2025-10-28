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
  scale?: number | { mobile?: number; tablet?: number; desktop?: number };
  initialRotation?: { x?: number; y?: number; z?: number };
  position?: [number, number, number] | { mobile?: [number, number, number]; tablet?: [number, number, number]; desktop?: [number, number, number] };
}

function Model({ modelPath, autoRotate = true, rotationSpeed = 0.5, scrollRotation, scale = 80, initialRotation, position = [0, 0, 0] }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef<THREE.Group>(null);

  // Aplicar rotación inicial
  useEffect(() => {
    if (meshRef.current && initialRotation) {
      if (initialRotation.x !== undefined) meshRef.current.rotation.x = initialRotation.x;
      if (initialRotation.y !== undefined) meshRef.current.rotation.y = initialRotation.y;
      if (initialRotation.z !== undefined) meshRef.current.rotation.z = initialRotation.z;
    }
  }, [initialRotation]);

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
      const initialX = initialRotation?.x ?? 0;
      const initialY = initialRotation?.y ?? 0;

      if (scrollRotation) {
        // Rotación basada en scroll (diagonal) - más suave, sumando la rotación inicial
        meshRef.current.rotation.x = THREE.MathUtils.lerp(
          meshRef.current.rotation.x,
          scrollRotation.x + initialX,
          0.03
        );
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          scrollRotation.y + initialY,
          0.03
        );
      } else if (autoRotate) {
        // Auto-rotación normal, manteniendo la rotación inicial en Y
        meshRef.current.rotation.y += delta * rotationSpeed;
      }
    }
  });

  return <primitive ref={meshRef} object={scene} scale={scale} position={position} />;
}

export default function Model3D({
  modelPath,
  autoRotate = true,
  rotationSpeed = 0.5,
  scale = 80,
  initialRotation,
  position = [0, 0, 0],
  className = ''
}: ModelProps & { className?: string }) {
  const [scrollRotation, setScrollRotation] = useState<{ x: number; y: number } | undefined>(undefined);
  const [currentScale, setCurrentScale] = useState<number>(80);
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>([0, 0, 0]);

  // Calcular scale y position responsive
  useEffect(() => {
    const updateResponsiveProps = () => {
      const width = window.innerWidth;

      // Calcular scale
      if (typeof scale === 'object') {
        if (width < 768) {
          setCurrentScale(scale.mobile ?? 60);
        } else if (width < 1024) {
          setCurrentScale(scale.tablet ?? 70);
        } else {
          setCurrentScale(scale.desktop ?? 80);
        }
      } else {
        setCurrentScale(scale);
      }

      // Calcular position
      if (Array.isArray(position)) {
        setCurrentPosition(position);
      } else {
        if (width < 768) {
          setCurrentPosition(position.mobile ?? [0, 0, 0]);
        } else if (width < 1024) {
          setCurrentPosition(position.tablet ?? [0, 0, 0]);
        } else {
          setCurrentPosition(position.desktop ?? [0, 0, 0]);
        }
      }
    };

    updateResponsiveProps();
    window.addEventListener('resize', updateResponsiveProps);
    return () => window.removeEventListener('resize', updateResponsiveProps);
  }, [scale, position]);

  useEffect(() => {
    // Solo activar scroll rotation en desktop (pantallas >= 768px)
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // En móvil, no activar scroll rotation
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 1000; // Scroll máximo para alcanzar posición diagonal completa

      // Normalizar el scroll entre 0 y 1
      const scrollProgress = Math.min(scrollY / maxScroll, 1);

      // Rotación Y: gira continuamente (más lento)
      const rotationY = (scrollY / 2500) * Math.PI;

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
          antialias: false, // Desactivar para mejor rendimiento
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: "high-performance", // Optimizar para performance
        }}
        dpr={Math.min(window.devicePixelRatio, 2)} // Limitar pixel ratio
        performance={{ min: 0.5 }} // Degradar calidad si FPS es bajo
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={2} />
        <hemisphereLight intensity={1.2} color="#ffffff" groundColor="#808080" />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow={false} />
        <Model
          modelPath={modelPath}
          autoRotate={!scrollRotation && autoRotate}
          rotationSpeed={rotationSpeed}
          scrollRotation={scrollRotation}
          scale={currentScale}
          initialRotation={initialRotation}
          position={currentPosition}
        />
        <OrbitControls
          enabled={false}
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
