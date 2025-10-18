import { useEffect, useRef, useState } from "react";

export default function LogoLoop() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [logoCount, setLogoCount] = useState(20);

  useEffect(() => {
    // Calcular cuántos logos necesitamos basado en el ancho de la pantalla
    const calculateLogoCount = () => {
      if (scrollRef.current) {
        const screenWidth = window.innerWidth;
        // Asumiendo que cada logo tiene aproximadamente 100px de ancho
        const logosNeeded = Math.ceil(screenWidth / 100) * 2 + 5;
        setLogoCount(logosNeeded);
      }
    };

    calculateLogoCount();
    window.addEventListener("resize", calculateLogoCount);
    return () => window.removeEventListener("resize", calculateLogoCount);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div
        ref={scrollRef}
        className="flex animate-logo-scroll whitespace-nowrap py-3"
      >
        {/* Primera serie de logos */}
        {Array.from({ length: logoCount }).map((_, index) => (
          <div
            key={`logo-${index}`}
            className="inline-flex items-center justify-center px-6 flex-shrink-0"
          >
            <img
              src="/piedra  svgs-01.svg"
              alt="Logo"
              className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
              draggable={false}
            />
          </div>
        ))}

        {/* Segunda serie de logos para loop infinito */}
        {Array.from({ length: logoCount }).map((_, index) => (
          <div
            key={`logo-duplicate-${index}`}
            className="inline-flex items-center justify-center px-6 flex-shrink-0"
          >
            <img
              src="/piedra  svgs-01.svg"
              alt="Logo"
              className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
