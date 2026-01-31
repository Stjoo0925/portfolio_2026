'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useAdmin } from '@/providers/AdminProvider';
import { EditableText } from '@/components/EditableText';
import { updateSiteContent } from '@/app/actions/admin';
import { toast } from 'sonner';


interface HomeClientProps {
  siteData: Record<string, string>;
}

export default function HomeClient({ siteData }: HomeClientProps) {
  const locale = useLocale();
  const t = useTranslations('Hero');
  const router = useRouter();
  const { isEditMode } = useAdmin();

  const handleSave = async (key: string, value: string) => {
    const result = await updateSiteContent({
      locale,
      section: 'Hero',
      key,
      value
    });
    if (result.success) {
      toast.success('저장되었습니다.');
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-transparent">
      {/* Hero 섹션 */}
        <div className="max-w-4xl w-full px-6 text-center flex flex-col items-center">
          {/* 배지 성격의 텍스트 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] font-black tracking-[0.4em] uppercase text-muted-foreground/50 mb-8"
          >
            <EditableText 
              content={siteData.greeting || t('greeting')} 
              isEditMode={isEditMode} 
              onSave={(val) => handleSave('greeting', val)} 
            />
          </motion.div>
          
          {/* 이름 & 인트로 */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-8">
            <span className="text-foreground block mb-4">
              <EditableText 
                content={siteData.name || t('name')} 
                isEditMode={isEditMode} 
                onSave={(val) => handleSave('name', val)}
                multiline={false} 
              />
            </span>
            <span className="text-muted-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light block">
              <EditableText 
                content={siteData.intro || t('intro')} 
                isEditMode={isEditMode} 
                onSave={(val) => handleSave('intro', val)}
                multiline={false} 
              />
            </span>
          </h1>
          
          {/* 설명 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              <EditableText 
                content={siteData.description || t('description')} 
                isEditMode={isEditMode} 
                onSave={(val) => handleSave('description', val)} 
                multiline
              />
            </p>
          </motion.div>

          {/* CTA 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button 
              onClick={() => router.push('/work')}
              className="px-10 py-4 bg-foreground text-background font-bold rounded-full hover:scale-105 transition-transform text-lg"
            >
              포트폴리오 보기
            </button>
          </motion.div>
        </div>


        {/* 히어로 페이지이므로 스크롤 안내 제거 */}
    </main>
  );
}
