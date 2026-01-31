'use client';

import { motion } from 'framer-motion';

interface ShinyTextProps {
  text: string;
  className?: string;
  shimmerWidth?: number;
  speed?: number;
}

export default function ShinyText({
  text,
  className = '',
  shimmerWidth = 200,
  speed = 3,
}: ShinyTextProps) {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      style={{
        background: `linear-gradient(
          90deg,
          currentColor 0%,
          currentColor 40%,
          rgba(255,255,255,0.8) 50%,
          currentColor 60%,
          currentColor 100%
        )`,
        backgroundSize: `${shimmerWidth}% 100%`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
      animate={{
        backgroundPosition: ['200% center', '-200% center'],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {text}
    </motion.span>
  );
}
