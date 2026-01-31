'use client';

import { useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function Navbar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'ko' ? 'en' : 'ko';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-between items-center glass border-none m-4 rounded-3xl">
      <div className="text-xl font-bold tracking-tighter">ANTIGRAVITY.</div>
      <div className="flex gap-4 items-center">
        <Button variant="ghost" size="sm" onClick={toggleLocale} className="flex gap-2 rounded-full">
          <Globe className="h-4 w-4" />
          {locale.toUpperCase()}
        </Button>
      </div>
    </nav>
  );
}
