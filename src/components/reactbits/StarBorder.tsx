'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StarBorderProps {
  children: ReactNode;
  className?: string;
  color?: string;
  speed?: number;
}

export default function StarBorder({
  children,
  className = '',
  color = '#8B5CF6',
  speed = 3,
}: StarBorderProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${color} 60deg, transparent 120deg)`,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      
      {/* Inner content with background */}
      <div className="relative bg-background rounded-xl m-[1px]">
        {children}
      </div>
    </div>
  );
}
