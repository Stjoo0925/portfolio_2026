'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { EditableText } from '@/components/EditableText';
import { useAdmin } from '@/providers/AdminProvider';
import { Code2, Database, Layout, Wrench, LucideIcon } from 'lucide-react';
import type { Skill } from '@/lib/db';

// 아이콘 매핑
const iconMap: Record<string, LucideIcon> = {
  'layout': Layout,
  'database': Database,
  'code': Code2,
  'wrench': Wrench,
};

type SkillsSectionProps = {
  skills: Skill[];
};

// 카테고리별로 스킬 그룹화
function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const t = useTranslations('Skills');
  const { isEditMode } = useAdmin();
  const groupedSkills = groupByCategory(skills);

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <EditableText 
            content={t('title')} 
            isEditMode={isEditMode} 
            onSave={(val) => console.log('Save skills title:', val)}
          />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(groupedSkills).map(([category, categorySkills], idx) => {
            const IconComponent = iconMap[categorySkills[0]?.icon_name || 'code'] || Code2;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass p-8 rounded-3xl border border-primary/10 hover:border-primary/30 transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-6 text-primary">
                  <IconComponent className="h-6 w-6" />
                  <h3 className="text-xl font-bold capitalize">{category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map(skill => (
                    <span key={skill.id} className="px-4 py-2 rounded-xl bg-background border border-border text-sm font-medium">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
