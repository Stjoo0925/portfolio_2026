'use client';

import { motion } from 'framer-motion';
import { useAdmin } from '@/providers/AdminProvider';
import { EditableText } from '@/components/EditableText';
import { updateSiteContent } from '@/app/actions/admin';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';

interface AboutSectionProps {
  data: Record<string, string>;
}

export function AboutSection({ data }: AboutSectionProps) {
  const locale = useLocale();
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
              content={data.title || "창의적인 해결책으로 비즈니스 가치를 높이는 개발자"} 
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
                  content={data.philosophy || "단순히 돌아가는 코드가 아닌, 누구나 읽기 좋고 유지보수가 쉬운 시스템을 구축하는 것을 최우선으로 생각합니다."} 
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
                  content={data.approach || "사용자의 목소리에 귀를 기울이고, 기술적 한계를 뛰어넘는 최적의 UX를 제공하기 위해 항상 끊임없이 탐구합니다."} 
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
