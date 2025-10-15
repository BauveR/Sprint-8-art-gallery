import { AnimationType } from "../config/welcomeSvgs";

interface AnimationConfig {
  type: AnimationType;
  from: number;
}

interface MotionProps {
  initial: Record<string, number>;
  whileInView: Record<string, number>;
}

const animationMap: Record<AnimationType, (from: number) => MotionProps> = {
  rotate: (from) => ({
    initial: { opacity: 0, scale: 0, rotate: from },
    whileInView: { opacity: 1, scale: 1, rotate: 0 },
  }),
  slideX: (from) => ({
    initial: { opacity: 0, x: from },
    whileInView: { opacity: 1, x: 0 },
  }),
  slideY: (from) => ({
    initial: { opacity: 0, y: from },
    whileInView: { opacity: 1, y: 0 },
  }),
  scale: (from) => ({
    initial: { opacity: 0, scale: from },
    whileInView: { opacity: 1, scale: 1 },
  }),
};

export function getAnimationProps(animation: AnimationConfig): MotionProps {
  const mapper = animationMap[animation.type];
  return mapper ? mapper(animation.from) : { initial: { opacity: 0 }, whileInView: { opacity: 1 } };
}
