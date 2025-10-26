import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import LiquidEther from "../backgrounds/LiquidEther";
import LayerControls, { LayerConfig, Position } from "./LayerControls";

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 CONFIGURACIÓN VISUAL - AJUSTA AQUÍ EL TAMAÑO Y POSICIÓN DE CADA CAPA
// ═══════════════════════════════════════════════════════════════════════════

const initialLayerConfig: LayerConfig = {
  // 📱 CAPA 1 - FONDO (piedra svgs-20.png)
  // Esta es la capa más atrás
  layer1: {
    size: {
      mobile: '100%',    // 📱 Tamaño en móvil (similar a desktop)
      tablet: '110%',    // 📱 Tamaño en tablet (similar a desktop)
      desktop: '120%'    // 🖥️ Tamaño en desktop
    },
    position: {
      mobile: { top: '20%', left: '1%' } as Position,     // 📱 Posición móvil (igual que desktop)
      tablet: { top: '14%', left: '-4%' } as Position,     // 📱 Posición tablet (igual que desktop)
      desktop: { top: '14%', left: '-4%' } as Position    // 🖥️ Posición desktop
    }
  },

  // 📱 CAPA 2 - SEGUNDA CAPA (Piedra art home page-16.svg)
  layer2: {
    size: {
      mobile: '90%',    // 📱 Tamaño en móvil (similar a desktop)
      tablet: '100%',    // 📱 Tamaño en tablet (similar a desktop)
      desktop: '110%'    // 🖥️ Tamaño en desktop
    },
    position: {
      mobile: { top: '20%', right: '5%' } as Position,   // 📱 Posición móvil (igual que desktop)
      tablet: { top: '18%', right: '-9%' } as Position,   // 📱 Posición tablet (igual que desktop)
      desktop: { top: '18%', right: '-9%' } as Position   // 🖥️ Posición desktop
    }
  },

  // 📱 CAPA 3 - TERCERA CAPA (piedra svgs-21.png)
  layer3: {
    size: {
      mobile: '110%',    // 📱 Tamaño en móvil (similar a desktop)
      tablet: '110%',    // 📱 Tamaño en tablet (similar a desktop)
      desktop: '122%'    // 🖥️ Tamaño en desktop
    },
    position: {
      mobile: { bottom: '-20%', left: '-5%' } as Position,   // 📱 Posición móvil (igual que desktop)
      tablet: { bottom: '-15%', left: '-5%' } as Position,   // 📱 Posición tablet (igual que desktop)
      desktop: { bottom: '-15%', left: '-5%' } as Position   // 🖥️ Posición desktop
    }
  },

  // 📱 CAPA 4 - FRENTE (piedra svgs-15.svg) - SIEMPRE CENTRADO
  layer4: {
    size: {
      mobile: '26%',    // 📱 Tamaño en móvil (similar a desktop)
      tablet: '27%',    // 📱 Tamaño en tablet (similar a desktop)
      desktop: '28%'    // 🖥️ Tamaño en desktop
    },
   position: {
      mobile: { bottom: '12%', left: '53%' } as Position,   // 📱 Posición móvil (igual que desktop)
      tablet: { bottom: '17%', left: '61%' } as Position,   // 📱 Posición tablet (igual que desktop)
      desktop: { bottom: '17%', left: '61%' } as Position   // 🖥️ Posición desktop
    }
  },
};

// ═══════════════════════════════════════════════════════════════════════════

export default function WelcomeSection() {
  const { scrollY } = useScroll();
  const lineScale = useTransform(scrollY, [0, 200], [1, 0]);
  const lineOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  // Estado para controlar la configuración de capas en tiempo real
  const [layerConfig, setLayerConfig] = useState(initialLayerConfig);

  // Estado para el efecto parallax
  const sectionRef = useRef<HTMLElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  // Observer combinado: observa Welcome saliendo Y Hero entrando
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const welcomeRect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Buscar la Hero Section (siguiente sección)
      const heroSection = sectionRef.current.nextElementSibling as HTMLElement;

      if (!heroSection) return;

      const heroRect = heroSection.getBoundingClientRect();

      // Calcular visibilidad de Hero Section (0 a 1)
      const heroVisible = Math.max(0, Math.min(1, (windowHeight - heroRect.top) / windowHeight));

      // Calcular cuánto del Welcome ha salido (0 a 1)
      const welcomeScrolledOut = Math.abs(Math.min(welcomeRect.top, 0));
      const welcomeHeight = welcomeRect.height;
      const welcomeExitProgress = Math.min(1, welcomeScrolledOut / (welcomeHeight * 0.8));

      // Activar parallax cuando:
      // 1. Hero Section es visible al menos 30%
      // 2. Welcome está saliendo (más del 50%)
      if (heroVisible >= 0.3 && welcomeExitProgress >= 0.5) {
        // Calcular intensidad del parallax basado en ambos factores
        const intensity = Math.min(heroVisible, welcomeExitProgress);
        const maxOffset = 600;
        setParallaxOffset(intensity * maxOffset);
      } else {
        setParallaxOffset(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden touch-pan-y welcome-section"
      style={{ backgroundColor: '#191E2C' }}
    >
      {/* Panel de Control Visual - Solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <LayerControls
          initialConfig={layerConfig}
          onConfigChange={(config) => setLayerConfig(config)}
        />
      )}

      {/* CSS dinámico para controlar tamaños responsive */}
      <style>{`
        /* Capa 1 */
        .layer-1 {
          width: ${layerConfig.layer1.size.mobile} !important;
          max-width: none !important;
          max-height: none !important;
          pointer-events: none !important;
          transform-origin: center center !important;
        }
        @media (min-width: 768px) {
          .layer-1 {
            width: ${layerConfig.layer1.size.tablet} !important;
            ${layerConfig.layer1.position?.tablet.top !== undefined ? `top: ${layerConfig.layer1.position.tablet.top} !important;` : ''}
            ${layerConfig.layer1.position?.tablet.bottom !== undefined ? `bottom: ${layerConfig.layer1.position.tablet.bottom} !important;` : ''}
            ${layerConfig.layer1.position?.tablet.left !== undefined ? `left: ${layerConfig.layer1.position.tablet.left} !important;` : ''}
            ${layerConfig.layer1.position?.tablet.right !== undefined ? `right: ${layerConfig.layer1.position.tablet.right} !important;` : ''}
          }
        }
        @media (min-width: 1024px) {
          .layer-1 {
            width: ${layerConfig.layer1.size.desktop} !important;
            ${layerConfig.layer1.position?.desktop.top !== undefined ? `top: ${layerConfig.layer1.position.desktop.top} !important;` : ''}
            ${layerConfig.layer1.position?.desktop.bottom !== undefined ? `bottom: ${layerConfig.layer1.position.desktop.bottom} !important;` : ''}
            ${layerConfig.layer1.position?.desktop.left !== undefined ? `left: ${layerConfig.layer1.position.desktop.left} !important;` : ''}
            ${layerConfig.layer1.position?.desktop.right !== undefined ? `right: ${layerConfig.layer1.position.desktop.right} !important;` : ''}
          }
        }

        /* Capa 2 */
        .layer-2 {
          width: ${layerConfig.layer2.size.mobile} !important;
          max-width: none !important;
          max-height: none !important;
          pointer-events: none !important;
          transform-origin: center center !important;
        }
        @media (min-width: 768px) {
          .layer-2 {
            width: ${layerConfig.layer2.size.tablet} !important;
            ${layerConfig.layer2.position?.tablet.top !== undefined ? `top: ${layerConfig.layer2.position.tablet.top} !important;` : ''}
            ${layerConfig.layer2.position?.tablet.bottom !== undefined ? `bottom: ${layerConfig.layer2.position.tablet.bottom} !important;` : ''}
            ${layerConfig.layer2.position?.tablet.left !== undefined ? `left: ${layerConfig.layer2.position.tablet.left} !important;` : ''}
            ${layerConfig.layer2.position?.tablet.right !== undefined ? `right: ${layerConfig.layer2.position.tablet.right} !important;` : ''}
          }
        }
        @media (min-width: 1024px) {
          .layer-2 {
            width: ${layerConfig.layer2.size.desktop} !important;
            ${layerConfig.layer2.position?.desktop.top !== undefined ? `top: ${layerConfig.layer2.position.desktop.top} !important;` : ''}
            ${layerConfig.layer2.position?.desktop.bottom !== undefined ? `bottom: ${layerConfig.layer2.position.desktop.bottom} !important;` : ''}
            ${layerConfig.layer2.position?.desktop.left !== undefined ? `left: ${layerConfig.layer2.position.desktop.left} !important;` : ''}
            ${layerConfig.layer2.position?.desktop.right !== undefined ? `right: ${layerConfig.layer2.position.desktop.right} !important;` : ''}
          }
        }

        /* Capa 3 */
        .layer-3 {
          width: ${layerConfig.layer3.size.mobile} !important;
          max-width: none !important;
          max-height: none !important;
          pointer-events: none !important;
          transform-origin: center center !important;
        }
        @media (min-width: 768px) {
          .layer-3 {
            width: ${layerConfig.layer3.size.tablet} !important;
            ${layerConfig.layer3.position?.tablet.top !== undefined ? `top: ${layerConfig.layer3.position.tablet.top} !important;` : ''}
            ${layerConfig.layer3.position?.tablet.bottom !== undefined ? `bottom: ${layerConfig.layer3.position.tablet.bottom} !important;` : ''}
            ${layerConfig.layer3.position?.tablet.left !== undefined ? `left: ${layerConfig.layer3.position.tablet.left} !important;` : ''}
            ${layerConfig.layer3.position?.tablet.right !== undefined ? `right: ${layerConfig.layer3.position.tablet.right} !important;` : ''}
          }
        }
        @media (min-width: 1024px) {
          .layer-3 {
            width: ${layerConfig.layer3.size.desktop} !important;
            ${layerConfig.layer3.position?.desktop.top !== undefined ? `top: ${layerConfig.layer3.position.desktop.top} !important;` : ''}
            ${layerConfig.layer3.position?.desktop.bottom !== undefined ? `bottom: ${layerConfig.layer3.position.desktop.bottom} !important;` : ''}
            ${layerConfig.layer3.position?.desktop.left !== undefined ? `left: ${layerConfig.layer3.position.desktop.left} !important;` : ''}
            ${layerConfig.layer3.position?.desktop.right !== undefined ? `right: ${layerConfig.layer3.position.desktop.right} !important;` : ''}
          }
        }

        /* Capa 4 */
        .layer-4 {
          width: ${layerConfig.layer4.size.mobile} !important;
          max-width: none !important;
          max-height: none !important;
          pointer-events: none !important;
          transform-origin: center center !important;
        }
        @media (min-width: 768px) {
          .layer-4 {
            width: ${layerConfig.layer4.size.tablet} !important;
            ${layerConfig.layer4.position?.tablet.top !== undefined ? `top: ${layerConfig.layer4.position.tablet.top} !important;` : ''}
            ${layerConfig.layer4.position?.tablet.bottom !== undefined ? `bottom: ${layerConfig.layer4.position.tablet.bottom} !important;` : ''}
            ${layerConfig.layer4.position?.tablet.left !== undefined ? `left: ${layerConfig.layer4.position.tablet.left} !important;` : ''}
            ${layerConfig.layer4.position?.tablet.right !== undefined ? `right: ${layerConfig.layer4.position.tablet.right} !important;` : ''}
          }
        }
        @media (min-width: 1024px) {
          .layer-4 {
            width: ${layerConfig.layer4.size.desktop} !important;
            ${layerConfig.layer4.position?.desktop.top !== undefined ? `top: ${layerConfig.layer4.position.desktop.top} !important;` : ''}
            ${layerConfig.layer4.position?.desktop.bottom !== undefined ? `bottom: ${layerConfig.layer4.position.desktop.bottom} !important;` : ''}
            ${layerConfig.layer4.position?.desktop.left !== undefined ? `left: ${layerConfig.layer4.position.desktop.left} !important;` : ''}
            ${layerConfig.layer4.position?.desktop.right !== undefined ? `right: ${layerConfig.layer4.position.desktop.right} !important;` : ''}
          }
        }
      `}</style>
      {/* Fondo LiquidEther - entre el fondo y el primer SVG */}
      <div className="absolute inset-0 z-[1] w-full h-full">
        <div className="w-full h-full min-w-full min-h-full">
          <LiquidEther
            colors={['#E60A62', '#077EED', '#F08E05']}
            mouseForce={14}
            cursorSize={90}
            isViscous={true}
            viscous={78}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.4}
            autoIntensity={1.1}
            takeoverDuration={0.25}
            autoResumeDelay={1000}
            autoRampDuration={0.6}
          />
        </div>
      </div>

      {/* Capa de degradado para suavizar transición */}
      <div className="absolute inset-0 z-[2] pointer-events-none
        bg-gradient-to-t from-[#191E2C]/80 from-0% via-[#191E2C]/40 via-30% to-transparent to-50%" />

      {/* Layout de dos columnas */}
      <div className="relative z-10 min-h-screen w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 pointer-events-none">

        {/* Columna Izquierda - 60% con capas de imágenes */}
        <div className="w-full md:w-[60%] h-[50vh] md:h-screen relative order-1 md:order-1 px-4 md:px-0">
          <div className="absolute inset-0 flex items-center justify-center">

            {/* Capa 1 (Fondo) - piedra svgs-20.png - Aparece de inmediato */}
            <motion.img
              src="/piedra  svgs-20.png"
              alt="Background layer"
              className="layer-1 absolute h-auto object-contain gpu-accelerated"
              style={{
                ...layerConfig.layer1.position?.mobile,
                zIndex: 3,
                transform: `translateY(-${parallaxOffset}px)`,
                opacity: parallaxOffset > 0 ? Math.max(1 - (parallaxOffset / 300), 0) : 1
              }}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            />

            {/* Capa 2 - Piedra art home page-16.svg - Revelado suave de abajo a arriba (segundo lugar) */}
            <motion.img
              src="/Piedra art home page-16.svg"
              alt="Second layer"
              className="layer-2 absolute h-auto object-contain gpu-accelerated"
              style={{
                ...layerConfig.layer2.position?.mobile,
                zIndex: 4
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            />

            {/* Capa 3 - piedra svgs-21.png - Aparece de inmediato (coordinado con capa 1) */}
            <motion.img
              src="/piedra  svgs-21.png"
              alt="Third layer"
              className="layer-3 absolute h-auto object-contain gpu-accelerated"
              style={{
                ...layerConfig.layer3.position?.mobile,
                zIndex: 5,
                transform: `translateY(-${parallaxOffset}px)`,
                opacity: parallaxOffset > 0 ? Math.max(1 - (parallaxOffset / 300), 0) : 1
              }}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            />

            {/* Capa 4 (Frente) - piedra svgs-15.svg - Revelado suave de abajo a arriba (tercer lugar) */}
            <motion.img
              src="/piedra  svgs-15.svg"
              alt="Front layer"
              className="layer-4 absolute h-auto object-contain gpu-accelerated"
              style={{
                ...layerConfig.layer4.position?.mobile,
                zIndex: 6
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.4,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            />

          </div>
        </div>

        {/* Columna Derecha - 30% con SVG y texto */}
        <div className="w-full md:w-[35%] flex items-center justify-center md:justify-start px-[5%] order-2 md:order-2">
          <motion.div
            className="max-w-md gpu-accelerated"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* SVG con efecto de rotación en color secundario */}
            <motion.img
              src="/piedra  svgs-05.svg"
              alt="Decorative rotating element"
              className="hidden md:block w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 mx-auto mb-8 object-contain pointer-events-auto"
              style={{
                filter: 'brightness(0) saturate(100%) invert(42%) sepia(13%) saturate(1018%) hue-rotate(198deg) brightness(94%) contrast(90%)'
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              transition={{
                opacity: { duration: 1 },
                scale: { duration: 1 },
                rotate: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            />

            {/* Texto descriptivo */}
            <p className="text-sm md:text-base font-bold text-gray-300 leading-relaxed text-center pointer-events-auto">
              Stone is a material we've lived alongside in countless ways—from dwelling in caves and adorning our bodies to venerating monoliths. It's been a constant thread throughout human history and culture since our earliest days.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Línea vertical animada para scroll */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[100] w-[2.5px] bg-gradient-to-b from-[#5F6D9A] to-transparent"
        style={{
          height: '10vh',
          scaleY: lineScale,
          opacity: lineOpacity,
          originY: 1
        }}
        initial={{ scaleY: 0, originY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
      />
    </section>
  );
}
