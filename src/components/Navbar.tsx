'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Github, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

export function Navbar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Nav');
  const { setTheme, theme } = useTheme();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLocale = () => {
    const nextLocale = locale === 'ko' ? 'en' : 'ko';
    router.replace(pathname, { locale: nextLocale });
  };

  const scrollToSection = (sectionId: string) => {
    // 만약 현재 경로가 /work 라면 스크롤 처리, 아니라면 이동 후 스크롤
    if (pathname.includes('/work')) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false);
      }
    } else {
      router.push(`/work#${sectionId}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { id: 'projects', label: t('projects') },
    { id: 'skills', label: t('skills') },
    { id: 'contact', label: t('contact') },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-4 bg-background/80 backdrop-blur-md border-b border-border' 
          : 'py-6 bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex justify-between items-center">
          {/* Logo */}
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => router.push('/')}
            className="text-sm font-black tracking-widest uppercase hover:opacity-50 transition-opacity"
          >
            Stjoo0925
          </motion.button>

          {/* Desktop Navigation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden md:flex items-center gap-10"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4"
          >
            <a
              href="https://github.com/Stjoo0925"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="relative p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors w-10 h-10 flex items-center justify-center"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
              <Moon className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
            </button>
            
            <button 
              onClick={toggleLocale} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {locale === 'ko' ? 'EN' : 'KO'}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-40 bg-background border-b border-border p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-left text-lg font-medium py-2"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
