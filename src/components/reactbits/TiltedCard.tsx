'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface TiltedCardProps {
  children: ReactNode;
  className?: string;
  rotationFactor?: number;
  springConfig?: { stiffness?: number; damping?: number };
}

export default function TiltedCard({
  children,
  className = '',
  rotationFactor = 15,
  springConfig = { stiffness: 150, damping: 20 },
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  
  const rotateX = useTransform(springY, [-0.5, 0.5], [rotationFactor, -rotationFactor]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-rotationFactor, rotationFactor]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const normalizedX = (e.clientX - centerX) / rect.width;
    const normalizedY = (e.clientY - centerY) / rect.height;
    
    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {children}
    </motion.div>
  );
}
