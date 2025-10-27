// Temporary mock for framer-motion to allow dev server to run
// TODO: Reinstall framer-motion when compatibility issues are resolved

import React, { useState, useEffect } from 'react';

export const motion = new Proxy({} as any, {
  get: (target, prop) => {
    return React.forwardRef((props: any, ref: any) => {
      const {
        children,
        className,
        style,
        onClick,
        onHoverStart,
        onHoverEnd,
        onFocus,
        onBlur,
        role,
        tabIndex,
        initial,
        animate,
        transition,
        whileInView,
        viewport,
        ...rest
      } = props;

      const [isAnimated, setIsAnimated] = useState(false);
      const [isInView, setIsInView] = useState(false);
      const elementRef = React.useRef<any>(null);

      // Combine refs
      React.useImperativeHandle(ref, () => elementRef.current);

      // Handle whileInView animations with Intersection Observer
      useEffect(() => {
        if (whileInView && elementRef.current) {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                setIsInView(true);
                if (viewport?.once) {
                  observer.disconnect();
                }
              } else if (!viewport?.once) {
                setIsInView(false);
              }
            },
            {
              threshold: viewport?.amount || 0.1
            }
          );

          observer.observe(elementRef.current);
          return () => observer.disconnect();
        } else {
          // For regular animations without whileInView
          setIsAnimated(true);
        }
      }, [whileInView, viewport]);

      // Determine which animation state to use
      const targetAnimation = whileInView ? (isInView ? whileInView : initial) : (isAnimated ? animate : initial);

      // Check if this is an infinite rotation animation
      const isInfiniteRotation = transition?.rotate?.repeat === Infinity ||
                                  (typeof transition === 'object' && transition?.repeat === Infinity);

      // Build CSS transition/animation string
      let cssAnimation = '';
      let cssTransition = '';

      if (isInfiniteRotation) {
        // For infinite rotation, use CSS animation with keyframes
        const rotateDuration = transition?.rotate?.duration || transition?.duration || 20;
        const rotateEasing = transition?.rotate?.ease || 'linear';
        cssAnimation = `spin-infinite ${rotateDuration}s ${rotateEasing} infinite`;
      } else {
        const duration = transition?.duration || 0.5;
        const delay = transition?.delay || 0;
        const easing = Array.isArray(transition?.ease)
          ? `cubic-bezier(${transition.ease.join(',')})`
          : 'ease-out';
        cssTransition = `all ${duration}s ${easing} ${delay}s`;
      }

      // Merge styles: base style + animation values
      const mergedStyle = {
        ...style,
        ...(cssAnimation ? { animation: cssAnimation } : { transition: cssTransition }),
        opacity: targetAnimation?.opacity !== undefined ? targetAnimation.opacity : (style?.opacity || 1),
        filter: targetAnimation?.filter !== undefined ? targetAnimation.filter : (style?.filter || undefined),
        clipPath: targetAnimation?.clipPath !== undefined ? targetAnimation.clipPath : (style?.clipPath || undefined),
        transform: [
          style?.transform,
          targetAnimation?.x !== undefined ? `translateX(${targetAnimation.x}px)` : '',
          targetAnimation?.y !== undefined ? `translateY(${targetAnimation.y}px)` : '',
          targetAnimation?.scale !== undefined ? `scale(${targetAnimation.scale})` : '',
          !isInfiniteRotation && targetAnimation?.rotate !== undefined ? `rotate(${targetAnimation.rotate}deg)` : '',
        ].filter(Boolean).join(' ') || undefined,
      };

      return React.createElement(
        typeof prop === 'string' ? prop : 'div',
        {
          ref: elementRef,
          className,
          style: mergedStyle,
          onClick,
          onMouseEnter: onHoverStart,
          onMouseLeave: onHoverEnd,
          onFocus,
          onBlur,
          role,
          tabIndex,
          ...rest
        },
        children
      );
    });
  }
});

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => children;

export const useMotionValue = (initialValue: any) => ({
  get: () => initialValue,
  set: () => {},
  on: () => () => {},
});

export const useTransform = () => ({ get: () => 0, set: () => {} });
export const useSpring = () => ({ get: () => 0, set: () => {} });
export const useScroll = () => ({ scrollY: { get: () => 0, set: () => {}, on: () => () => {} } });
export const useInView = () => false;
