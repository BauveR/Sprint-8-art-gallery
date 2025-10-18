import { motion } from "framer-motion";
import LiquidEther from "../backgrounds/LiquidEther";

export default function WelcomeSection() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Fondo LiquidEther */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Capa de degradado blanco a transparente */}
      <div className="absolute inset-0 z-[5]
  bg-gradient-to-t from-white/100 from-0% via-white/60
   via-30% to-transparent to-50%" />

      {/* SVG con degradado radial */}
      <motion.div
        className="relative z-10 w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px]"
        style={{
          maskImage: 'url(/piedra-arte-05.svg)',
          WebkitMaskImage: 'url(/piedra-arte-05.svg)',
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          background: 'oklch(84.1% 0.238 128.85)'
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
    </section>
  );
}
