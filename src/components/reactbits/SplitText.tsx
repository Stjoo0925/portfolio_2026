'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  splitType?: 'chars' | 'words';
}

export default function SplitText({
  text,
  className = '',
  delay = 0.03,
  duration = 0.5,
  splitType = 'chars',
}: SplitTextProps) {
  const elements = splitType === 'chars' ? text.split('') : text.split(' ');

  return (
    <span className={className}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration,
            delay: index * delay,
            ease: [0.25, 0.4, 0.25, 1],
          }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {element === ' ' ? '\u00A0' : element}
          {splitType === 'words' && index < elements.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  );
}
