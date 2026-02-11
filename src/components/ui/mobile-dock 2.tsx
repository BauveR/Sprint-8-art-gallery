import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence
} from 'framer-motion';
import React, { useRef, useState } from 'react';

export type DockItemData = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
};

function DockItem({
  icon,
  label,
  onClick,
  mouseX,
  className = ''
}: DockItemData & { mouseX: ReturnType<typeof useMotionValue<number>> }) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-100, 0, 100], [48, 72, 48]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 200,
    damping: 15
  });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      ref={ref}
      style={{ width }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex aspect-square cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors ${className}`}
    >
      {/* Icon */}
      <div className="flex items-center justify-center text-white">
        {icon}
      </div>

      {/* Label Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white shadow-xl"
          >
            {label}
            {/* Arrow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-black/90" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function MobileDock({ items, className = '' }: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="w-full flex justify-center px-4 pb-4">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`flex gap-3 items-center rounded-2xl bg-black/20 backdrop-blur-xl border border-white/20 px-4 py-3 shadow-2xl ${className}`}
      >
        {items.map((item, index) => (
          <DockItem key={index} mouseX={mouseX} {...item} />
        ))}
      </motion.div>
    </div>
  );
}
