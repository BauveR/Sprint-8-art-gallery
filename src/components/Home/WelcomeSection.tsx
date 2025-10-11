import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { welcomeSvgElements, welcomeSvgElementsMobile } from "../../config/welcomeSvgs";
import { getAnimationProps } from "../../lib/animations";

export default function WelcomeSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const elements = isMobile ? welcomeSvgElementsMobile : welcomeSvgElements;

  return (
    <section className="relative min-h-screen overflow-hidden bg-white dark:bg-white">
      <div className="absolute inset-0">
        {elements.map((element, index) => {
          if (element.coinFlipOnHover) {
            return <CoinFlipImage key={index} element={element} isMobile={isMobile} />;
          }

          const animationProps = getAnimationProps(element.animation);

          // Para pantallas grandes: bloquear posición (sin animación de entrada)
          // Para móvil: mantener animaciones de entrada
          const initialState = isMobile ? animationProps.initial : animationProps.whileInView;

          return (
            <motion.img
              key={index}
              src={element.src}
              alt=""
              className={`absolute ${element.position} ${element.size} ${element.opacity} ${
                element.hoverColorChange ? "cursor-pointer hover-orange-filter transition-all duration-200" : "pointer-events-none"
              }`}
              initial={initialState}
              animate={
                element.continuousRotate
                  ? { ...animationProps.whileInView, rotate: 360 }
                  : element.bounceDownEffect
                  ? { ...animationProps.whileInView, y: [0, 10, 0] }
                  : animationProps.whileInView
              }
              transition={
                element.continuousRotate
                  ? {
                      duration: isMobile ? 1 : 0, // Sin transición inicial en desktop
                      delay: isMobile ? element.animation.delay : 0,
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                        delay: isMobile ? element.animation.delay + 1 : 0,
                      },
                    }
                  : element.bounceDownEffect
                  ? {
                      duration: isMobile ? 1 : 0, // Sin transición inicial en desktop
                      delay: isMobile ? element.animation.delay : 0,
                      y: {
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: isMobile ? element.animation.delay + 3.9 : 0,
                      },
                    }
                  : isMobile
                  ? { duration: 1, delay: element.animation.delay }
                  : { duration: 0 } // Sin transición en desktop
              }
            />
          );
        })}
      </div>
    </section>
  );
}

function CoinFlipImage({ element }: { element: any }) {
  const [rotateY, setRotateY] = useState(0);
  const [isStopping, setIsStopping] = useState(false);
  const animationProps = getAnimationProps(element.animation);

  const handleHover = () => {
    setRotateY(0);
    setIsStopping(false);

    // Después de 1.2 segundos, detener gradualmente
    setTimeout(() => {
      setIsStopping(true);
      setRotateY(360); // Completar una vuelta final
    }, 1200);
  };

  return (
    <motion.img
      src={element.src}
      alt=""
      className={`absolute ${element.position} ${element.size} ${element.opacity} cursor-pointer`}
      style={{ transformStyle: "preserve-3d" }}
      initial={animationProps.initial}
      animate={{
        ...animationProps.whileInView,
        rotateY: rotateY,
      }}
      onHoverStart={handleHover}
      transition={{
        ...animationProps.initial,
        duration: 1,
        delay: element.animation.delay,
        rotateY: isStopping
          ? { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
          : {
              duration: 0.6,
              repeat: Infinity,
              ease: "linear",
            },
      }}
    />
  );
}
