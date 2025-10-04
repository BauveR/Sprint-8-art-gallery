export type AnimationType = "rotate" | "slideX" | "slideY" | "scale";

export interface SvgElement {
  src: string;
  position: string;
  size: string;
  opacity: string;
  animation: {
    type: AnimationType;
    from: number;
    delay: number;
  };
  continuousRotate?: boolean;
  coinFlipOnHover?: boolean;
  invertColorOnHover?: boolean;
}

export const welcomeSvgElementsMobile: SvgElement[] = [
  {
    src: "/piedra-arte-03.svg",
    position: "top-78 left-1/2 -translate-x-1/2",
    size: "w-70 h-70 sm:w-40 sm:h-40",
    opacity: "opacity-100",
    animation: { type: "rotate", from: 180, delay: 0.2 },
    coinFlipOnHover: true,
  },
  {
    src: "/piedra-arte-04.svg",
    position: "top-150 left-50 -translate-x-1/2 -translate-y-1/2",
    size: "w-120 h-120 sm:w-48 sm:h-48",
    opacity: "opacity-100",
    animation: { type: "slideX", from: -100, delay: 0.4 },
  },
  {
    src: "/piedra-arte-05.svg",
    position: "bottom-10 left-1/2 -translate-x-1/2",
    size: "w-200 h-200 sm:w-36 sm:h-36",
    opacity: "opacity-100",
    animation: { type: "slideX", from: 100, delay: 0.6 },
    continuousRotate: true,
  },
];

export const welcomeSvgElements: SvgElement[] = [
  {
    src: "/piedra-arte-02.svg",
    position: "top-210 left-428",
    size: "w-180 h-180",
    opacity: "opacity-100",
    animation: { type: "rotate", from: -180, delay: 0.2 },
    invertColorOnHover: true,
  },
  {
    src: "/piedra-arte-03.svg",
    position: "top-0 right-275",
    size: "w-190 h-190",
    opacity: "opacity-100",
    animation: { type: "rotate", from: 180, delay: 0.4 },
    coinFlipOnHover: true,
  },
  {
    src: "/piedra-arte-04.svg",
    position: "top-60 left-220",
    size: "w-220 h-220",
    opacity: "opacity-100",
    animation: { type: "slideX", from: -100, delay: 0.6 },
  },
  {
    src: "/piedra-arte-05.svg",
    position: "bottom-65 right-240",
    size: "w-140 h-140",
    opacity: "opacity-100",
    animation: { type: "slideX", from: 100, delay: 0.8 },
    continuousRotate: true,
  },
  {
    src: "/piedra-arte-06.svg",
    position: "top-200 left-190",
    size: "w-140 h-140",
    opacity: "opacity-100",
    animation: { type: "slideY", from: -50, delay: 1 },
  },
  {
    src: "/piedra-arte-07.svg",
    position: "bottom-0 left-187",
    size: "w-170 h-170",
    opacity: "opacity-100",
    animation: { type: "slideY", from: 50, delay: 1.2 },
  },
  {
    src: "/piedra-arte-08.svg",
    position: "bottom-30 left-60",
    size: "w-155 h-155",
    opacity: "opacity-100",
    animation: { type: "scale", from: 0, delay: 1.4 },
  },
  {
    src: "/piedra-arte-09.svg",
    position: "bottom-170 right-480",
    size: "w-160 h-160",
    opacity: "opacity-100",
    animation: { type: "rotate", from: -90, delay: 1.6 },
  },
  {
    src: "/piedra-arte-10.svg",
    position: "bottom-160 left-420",
    size: "w-180 h-180",
    opacity: "opacity-100",
    animation: { type: "scale", from: 0.5, delay: 1.8 },
  },
];
