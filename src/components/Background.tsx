'use client';

import Aurora from '@/components/reactbits/Aurora';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { usePathname } from '@/i18n/routing';

export function Background() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';
  const isWork = pathname?.includes('/work');

  // Define color palettes
  const homeColors = isDark 
    ? ['#3A29FF', '#FF94B4', '#FF3232'] 
    : ['#00d2ff', '#3a7bd5', '#00d2ff'];
    
  const workColors = isDark
    ? ['#1a1a1a', '#2c3e50', '#0f2027']  // Very dark, subtle professional mix
    : ['#f5f7fa', '#c3cfe2', '#e0eafc']; // Very light, airy off-white/blue mix

  return (
    <div className="fixed inset-0 z-[-1] transition-colors duration-500 bg-background">
      {/* Aurora Effect with reduced opacity for better text contrast */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <Aurora
          colorStops={isWork ? workColors : homeColors}
          speed={0.5}
        />
      </div>
      
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px] pointer-events-none" />
    </div>
  );
}
