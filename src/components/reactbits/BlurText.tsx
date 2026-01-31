'use client';

import { motion } from 'framer-motion';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export default function BlurText({
  text,
  className = '',
  delay = 0,
  duration = 0.8,
}: BlurTextProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {text}
    </motion.span>
  );
}
