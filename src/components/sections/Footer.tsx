'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Github, Mail, ArrowUp } from 'lucide-react';
import ShinyText from '@/components/reactbits/ShinyText';
import Magnet from '@/components/reactbits/Magnet';
import { useAdmin } from '@/providers/AdminProvider';
import { EditableText } from '@/components/EditableText';
import { updateSiteContent } from '@/app/actions/admin';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';

interface FooterProps {
  data: Record<string, string>;
}

export function Footer({ data }: FooterProps) {
  const locale = useLocale();
  const t = useTranslations('Footer');
  const tContact = useTranslations('Contact');
  const { isEditMode } = useAdmin();

  const handleSave = async (section: string, key: string, value: string) => {
    const result = await updateSiteContent({
      locale,
      section,
      key,
      value
    });
    if (result.success) {
      toast.success('저장되었습니다.');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="py-40 px-6 md:px-12 lg:px-24 relative border-t border-border bg-background">
      <div className="max-w-7xl mx-auto">
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="text-[10px] font-black tracking-[0.4em] uppercase text-accent mb-8">
            <EditableText 
              content={data.available || tContact('available')} 
              isEditMode={isEditMode} 
              onSave={(val) => handleSave('Footer', 'available', val)} 
            />
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-12">
            <ShinyText 
              text={data.contact_title || tContact('title')} 
              className="text-foreground" 
              shimmerWidth={400} 
            />
          </h2>

          {/* 이메일 */}
          <a
            href={`mailto:${data.email || 'stjoo0925@gmail.com'}`}
            className="inline-block text-xl md:text-3xl lg:text-5xl font-light hover:text-accent transition-colors"
          >
            <EditableText 
              content={data.email || "stjoo0925@gmail.com"} 
              isEditMode={isEditMode} 
              onSave={(val) => handleSave('Footer', 'email', val)} 
            />
          </a>
        </motion.div>

        {/* 하단 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-10 pt-16 border-t border-border/50"
        >
          {/* 소셜 링크 */}
          <div className="flex gap-6">
            <Magnet strength={0.4}>
              <a
                href="https://github.com/Stjoo0925"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </Magnet>
            <Magnet strength={0.4}>
              <a
                href={`mailto:${data.email || 'stjoo0925@gmail.com'}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </Magnet>
          </div>

          {/* 저작권 */}
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground">
            <EditableText 
              content={data.copyright || t('copyright')} 
              isEditMode={isEditMode} 
              onSave={(val) => handleSave('Footer', 'copyright', val)} 
            />
          </p>

          {/* Top */}
          <Magnet strength={0.4}>
            <button
              onClick={scrollToTop}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </Magnet>
        </motion.div>
      </div>
    </footer>
  );
}
