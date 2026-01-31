'use client';

import { motion } from 'framer-motion';
import { useAdmin } from '@/providers/AdminProvider';
import { EditableText } from '@/components/EditableText';
import { updateSiteContent } from '@/app/actions/admin';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface AboutSectionProps {
  data: Record<string, string>;
}

export function AboutSection({ data }: AboutSectionProps) {
  const locale = useLocale();
  const t = useTranslations('About');
  const { isEditMode } = useAdmin();

  const handleSave = async (key: string, value: string) => {
    const result = await updateSiteContent({
      locale,
      section: 'About',
      key,
      value
    });
    if (result.success) {
      toast.success('인사말이 저장되었습니다.');
    }
  };

  return (
    <section id="about" className="py-40 px-6 md:px-12 lg:px-24 bg-background border-b border-border/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-baseline">
        {/* 사이드 라벨 */}
        <div className="md:w-1/4">
          <span className="text-xs font-black tracking-[0.4em] uppercase text-accent">
            About Me
          </span>
        </div>

        {/* 본문 내용 */}
        <div className="md:w-3/4 space-y-12">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
            <EditableText 
              content={data.title || t('title')} 
              isEditMode={isEditMode} 
              onSave={(val) => handleSave('title', val)} 
              multiline
            />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-border">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-accent">philosophy</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                <EditableText 
                  content={data.philosophy || t('philosophy')} 
                  isEditMode={isEditMode} 
                  onSave={(val) => handleSave('philosophy', val)} 
                  multiline
                />
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-accent">approach</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                <EditableText 
                  content={data.approach || t('approach')} 
                  isEditMode={isEditMode} 
                  onSave={(val) => handleSave('approach', val)} 
                  multiline
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
