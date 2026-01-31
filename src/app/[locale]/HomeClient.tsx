'use client';

import { useTranslations, useLocale } from 'next-intl';
import { EditableText } from '@/components/EditableText';
import { useAdmin } from '@/providers/AdminProvider';
import { updateSiteContent } from '@/app/actions/admin';
import { toast } from 'sonner';
import { TestimonialsSection } from '@/components/sections/Testimonials';
import { ProjectsSection } from '@/components/sections/Projects';
import { SkillsSection } from '@/components/sections/Skills';
import type { Project, Skill, Testimonial } from '@/lib/db';

type HomeClientProps = {
  projects: Project[];
  skills: Skill[];
  testimonials: Testimonial[];
};

export default function HomeClient({ projects, skills, testimonials }: HomeClientProps) {
  const t = useTranslations('Hero');
  const tToast = useTranslations('Toast');
  const locale = useLocale();
  const { isEditMode } = useAdmin();

  const handleSave = async (key: string, value: string) => {
    const result = await updateSiteContent({
      locale,
      section: 'Hero',
      key,
      value
    });

    if (result.success) {
      toast.success(tToast('saveSuccess'));
    } else {
      toast.error(tToast('saveFailed') + result.error);
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
      <section className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            <EditableText 
              content={t('title')} 
              isEditMode={isEditMode} 
              onSave={(newVal: string) => handleSave('title', newVal)}
            />
          </h1>
          <p className="text-xl text-muted-foreground sm:text-2xl">
            <EditableText 
              content={t('subtitle')} 
              isEditMode={isEditMode} 
              onSave={(newVal: string) => handleSave('subtitle', newVal)}
            />
          </p>
          <div className="flex justify-center gap-4">
            <button className="rounded-full bg-primary px-8 py-3 text-primary-foreground shadow-lg transition-transform hover:scale-105">
              {t('viewProjects')}
            </button>
            <button className="rounded-full border border-border bg-background px-8 py-3 transition-transform hover:scale-105">
              {t('contactMe')}
            </button>
          </div>
        </div>
      </section>

      <ProjectsSection projects={projects} />
      <SkillsSection skills={skills} />
      <TestimonialsSection testimonials={testimonials} />
      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(0,209,255,0.05),transparent)] pointer-events-none" />
    </main>
  );
}
