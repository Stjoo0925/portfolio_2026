'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import ShinyText from '@/components/reactbits/ShinyText';
import { useAdmin } from '@/providers/AdminProvider';
import { EditableText } from '@/components/EditableText';
import { updateSiteContent, addNewSkill, removeSkill, editSkill } from '@/app/actions/admin';
import { toast } from 'sonner';
import { Plus, Trash2, Code, Database, Layout, Wrench, Globe, Layers, Cpu, Smartphone } from 'lucide-react';
import type { Skill } from '@/lib/db';

type SkillsSectionProps = {
  skills: Skill[];
  data: Record<string, string>;
};

// 아이콘 매핑 유틸리티
const getSkillIcon = (name: string, category: string) => {
  const n = name.toLowerCase();
  const c = category.toLowerCase();
  
  if (n.includes('react') || n.includes('frontend')) return <Layout className="w-4 h-4" />;
  if (n.includes('node') || n.includes('backend') || n.includes('express') || n.includes('fastify')) return <Database className="w-4 h-4" />;
  if (n.includes('python') || n.includes('go') || n.includes('java')) return <Code className="w-4 h-4" />;
  if (n.includes('db') || n.includes('sql') || n.includes('mongo') || n.includes('supabase')) return <Database className="w-4 h-4" />;
  if (c.includes('devops') || n.includes('docker') || n.includes('aws') || n.includes('git')) return <Cpu className="w-4 h-4" />;
  if (n.includes('mobile') || n.includes('react native') || n.includes('flutter')) return <Smartphone className="w-4 h-4" />;
  
  // 기본 아이콘
  if (c.includes('front')) return <Layout className="w-4 h-4" />;
  if (c.includes('back')) return <Database className="w-4 h-4" />;
  return <Layers className="w-4 h-4" />;
};

function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
}

export function SkillsSection({ skills, data }: SkillsSectionProps) {
  const locale = useLocale();
  const t = useTranslations('Skills');
  const { isEditMode } = useAdmin();
  const groupedSkills = groupByCategory(skills);

  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [newSkillName, setNewSkillName] = useState('');

  const handleSaveText = async (key: string, value: string) => {
    const result = await updateSiteContent({
      locale,
      section: 'Skills',
      key,
      value
    });
    if (result.success) toast.success('저장되었습니다.');
  };

  const handleAddSkill = async (category: string) => {
    if (!newSkillName.trim()) return;
    const result = await addNewSkill({
      category,
      name: newSkillName,
      proficiency: 80,
      order_index: (groupedSkills[category]?.length || 0) + 1,
      icon_name: null
    });
    if (result.success) {
      toast.success('스킬이 추가되었습니다.');
      setIsAdding(null);
      setNewSkillName('');
    } else {
      toast.error('추가 실패: ' + result.error);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const result = await removeSkill(id);
    if (result.success) toast.success('삭제되었습니다.');
  };

  return (
    <section id="skills" className="py-40 px-6 md:px-12 lg:px-24 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase">
            <ShinyText text={data.title || t('title')} className="text-foreground" shimmerWidth={300} />
          </h2>
          <p className="text-muted-foreground text-sm font-mono tracking-widest uppercase">
            <EditableText 
              content={data.subtitle || t('subtitle')} 
              isEditMode={isEditMode} 
              onSave={(val) => handleSaveText('subtitle', val)} 
            />
          </p>
        </motion.div>

        {/* 스킬 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
          {Object.entries(groupedSkills).map(([category, categorySkills], idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              {/* 카테고리 제목 */}
              <div className="border-b border-border pb-4 flex justify-between items-center group/cat">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">
                  {category}
                </h3>
                {isEditMode && (
                  <button 
                    onClick={() => setIsAdding(category)}
                    className="p-1 hover:text-accent transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              {/* 스킬 리스트 */}
              <div className="flex flex-col gap-6">
                <AnimatePresence mode="popLayout">
                  {categorySkills.map((skill, skillIdx) => (
                    <motion.div
                      key={skill.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: skillIdx * 0.05 }}
                      className="group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-muted-foreground transition-colors group-hover:text-accent">
                          {getSkillIcon(skill.name, category)}
                        </div>
                        <span className="text-sm font-light text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-widest">
                          {skill.name}
                        </span>
                      </div>
                      
                      {isEditMode && (
                        <button 
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-all text-destructive p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* 추가 입력창 */}
                {isAdding === category && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 pt-4"
                  >
                    <input 
                      autoFocus
                      className="bg-secondary/50 border border-border text-xs px-2 py-1.5 rounded-md outline-none focus:border-accent w-full"
                      placeholder="Add New"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(category)}
                      onBlur={() => !newSkillName && setIsAdding(null)}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
