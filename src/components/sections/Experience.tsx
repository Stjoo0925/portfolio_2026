'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useAdmin } from '@/providers/AdminProvider';
import type { Career } from '@/lib/db';
import { Calendar, Briefcase, Plus, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { EditableText } from '@/components/EditableText';
import { addCareerAction, deleteCareerAction, updateCareerAction } from '@/app/actions/admin';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/routing';

type ExperienceSectionProps = {
  careers: Career[];
};

export function ExperienceSection({ careers }: ExperienceSectionProps) {
  const t = useTranslations('Experience');
  const { isEditMode } = useAdmin();
  const locale = useLocale();
  const router = useRouter();

  const handleUpdateCareer = async (id: string, updates: Partial<Career>) => {
    const result = await updateCareerAction(id, locale, updates);
    if (result.success) {
      toast.success('경력 정보가 업데이트되었습니다.');
      router.refresh();
    } else {
      toast.error('업데이트 실패: ' + result.error);
    }
  };

  const handleAddCareer = async () => {
    const result = await addCareerAction(locale, {
      company_name: 'New Company',
      start_date: new Date().toISOString().split('T')[0],
      end_date: null,
      is_current: true,
      order_index: careers.length + 1,
      role: 'New Role',
      description: 'Role description here...'
    });
    
    if (result.success) {
      toast.success('새 경력이 추가되었습니다.');
      router.refresh();
    } else {
      toast.error('추가 실패: ' + result.error);
    }
  };

  const handleDeleteCareer = async (id: string) => {
    if (!confirm('정말 이 경력을 삭제하시겠습니까?')) return;
    const result = await deleteCareerAction(id);
    if (result.success) {
      toast.success('경력이 삭제되었습니다.');
      router.refresh();
    } else {
      toast.error('삭제 실패: ' + result.error);
    }
  };

  return (
    <section id="experience" className="py-24 px-6 md:px-12 lg:px-24 bg-background/50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 flex items-baseline justify-between border-b border-border pb-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
            EXPERIENCE
          </h2>
          {isEditMode && (
            <button
              onClick={handleAddCareer}
              className="p-2 border border-border rounded-full hover:bg-foreground hover:text-background transition-all"
              title="Add Experience"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="space-y-16">
          {careers.map((career, idx) => (
            <motion.div 
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-16 group relative"
            >
              {isEditMode && (
                <button
                  onClick={() => handleDeleteCareer(career.id)}
                  className="absolute -top-4 -right-4 md:left-[-40px] md:top-0 z-20 p-2 bg-destructive text-destructive-foreground rounded-full opacity-100 shadow-lg w-8 h-8 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* 날짜 & 회사명 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-accent font-mono text-sm tracking-wider">
                  <Calendar className="w-4 h-4" />
                  <span className="flex items-center gap-1">
                    {isEditMode ? (
                      <>
                        <input 
                          type="date" 
                          value={career.start_date.split('T')[0]}
                          onChange={(e) => handleUpdateCareer(career.id, { start_date: e.target.value })}
                          className="bg-transparent border-b border-dashed border-primary/40 text-xs w-24"
                        />
                         — 
                        {career.is_current ? (
                          <span 
                            onClick={() => handleUpdateCareer(career.id, { is_current: false, end_date: new Date().toISOString().split('T')[0] })}
                            className="cursor-pointer font-bold underline decoration-dashed"
                          >
                            Present
                          </span>
                        ) : (
                          <input 
                            type="date" 
                            value={career.end_date ? career.end_date.split('T')[0] : ''}
                            onChange={(e) => handleUpdateCareer(career.id, { end_date: e.target.value })}
                            className="bg-transparent border-b border-dashed border-primary/40 text-xs w-24"
                          />
                        )}
                        {!career.is_current && (
                          <button 
                            onClick={() => handleUpdateCareer(career.id, { is_current: true, end_date: null })}
                            className="text-[10px] ml-1 px-1 border rounded opacity-50 hover:opacity-100"
                          >
                            Set Current
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {career.start_date.substring(0, 7)} — {career.end_date ? career.end_date.substring(0, 7) : 'Present'}
                      </>
                    )}
                  </span>
                </div>
                <h3 className="text-2xl font-bold">
                  <EditableText 
                    content={career.company_name} 
                    isEditMode={isEditMode} 
                    onSave={(val) => handleUpdateCareer(career.id, { company_name: val })} 
                  />
                </h3>
                {career.is_current && (
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full uppercase tracking-wider">
                    Current
                  </span>
                )}
              </div>

              {/* 역할 & 설명 */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-xl font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    <Briefcase className="w-5 h-5" />
                    <h4>
                      <EditableText 
                        content={career.role} 
                        isEditMode={isEditMode} 
                        onSave={(val) => handleUpdateCareer(career.id, { role: val })} 
                      />
                    </h4>
                 </div>
                 
                 <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                   <EditableText 
                     content={career.description} 
                     isEditMode={isEditMode} 
                     onSave={(val) => handleUpdateCareer(career.id, { description: val })} 
                     multiline
                   />
                   {!isEditMode && (
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>
                       {career.description}
                     </ReactMarkdown>
                   )}
                 </div>
              </div>
            </motion.div>
          ))}

          {careers.length === 0 && (
            <p className="text-muted-foreground text-center py-20">
              No experience data found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
