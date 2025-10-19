import { motion, useScroll, useTransform } from "framer-motion";
import LiquidEther from "../backgrounds/LiquidEther";

export default function WelcomeSection() {
  const { scrollY } = useScroll();
  const lineScale = useTransform(scrollY, [0, 200], [1, 0]);
  const lineOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center px-6 touch-pan-y">
      {/* Fondo LiquidEther */}
      <div className="absolute inset-0 z-0 w-full h-full">
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

      {/* Capa de degradado blanco a transparente */}
      <div className="absolute inset-0 z-[5] pointer-events-none
  bg-gradient-to-t from-white/100 from-0% via-white/60 via-30% to-transparent to-50%
  dark:from-slate-950/100 dark:via-slate-950/60 dark:to-transparent" />

      {/* SVG con degradado radial */}
      <motion.div
        className="relative z-10 w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] translate-y-[10%] md:-translate-y-[5%]"
        style={{
          maskImage: 'url(/piedra-arte-05.svg)',
          WebkitMaskImage: 'url(/piedra-arte-05.svg)',
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          background: '#F08E05'
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
      <motion.div
        className="relative z-10 max-w-3xl mt-8 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-300 leading-relaxed text-justify">
          Stone is a material we've lived alongside in countless ways—from dwelling in caves and adorning our bodies to venerating monoliths. It's been a constant thread throughout human history and culture since our earliest days. 
        </p>
      </motion.div>

      {/* Línea vertical animada para scroll */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[100] w-[2.5px] bg-gradient-to-b from-gray-500 dark:from-blue-400 to-transparent"
        style={{
          height: '17vh',
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
