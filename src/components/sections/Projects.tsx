'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, Github, ExternalLink, Plus, Trash2 } from 'lucide-react';
import TiltedCard from '@/components/reactbits/TiltedCard';
import ShinyText from '@/components/reactbits/ShinyText';
import { useAdmin } from '@/providers/AdminProvider';
import { EditableText } from '@/components/EditableText';
import { updateSiteContent, addProjectAction, deleteProjectAction, updateProjectAction } from '@/app/actions/admin';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import type { Project } from '@/lib/db';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ProjectsSectionProps = {
  projects: Project[];
  data: Record<string, string>;
};

export function ProjectsSection({ projects, data }: ProjectsSectionProps) {
  const locale = useLocale();
  const t = useTranslations('Projects');
  const { isEditMode } = useAdmin();

  const handleSaveSection = async (key: string, value: string) => {
    const result = await updateSiteContent({
      locale,
      section: 'Projects',
      key,
      value
    });
    if (result.success) {
      toast.success('저장되었습니다.');
    }
  };

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    const result = await updateProjectAction(id, locale, updates);
    if (result.success) {
      toast.success('프로젝트가 업데이트되었습니다.');
    } else {
      toast.error('업데이트 실패: ' + result.error);
    }
  };

  const handleAddProject = async () => {
    const result = await addProjectAction(locale, {
      title: 'New Project',
      description: 'Project description here...',
      order_index: projects.length + 1,
      tags: ['New'],
    });
    if (result.success) {
      toast.success('새 프로젝트가 추가되었습니다.');
    } else {
      toast.error('추가 실패: ' + result.error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('정말 이 프로젝트를 삭제하시겠습니까?')) return;
    const result = await deleteProjectAction(id);
    if (result.success) {
      toast.success('프로젝트가 삭제되었습니다.');
    } else {
      toast.error('삭제 실패: ' + result.error);
    }
  };

  return (
    <section id="projects" className="py-40 px-6 md:px-12 lg:px-24 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32 flex items-baseline justify-between border-b border-border pb-8"
        >
          <div className="flex items-center gap-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              <ShinyText 
                text={data.title || t('title')} 
                className="text-foreground" 
                shimmerWidth={300} 
              />
              {isEditMode && (
                <div className="text-xs font-normal mt-2">
                  <EditableText 
                    content={data.title || t('title')} 
                    isEditMode={isEditMode} 
                    onSave={(val) => handleSaveSection('title', val)} 
                  />
                </div>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
              Selected Works ({projects.length})
            </span>
            {isEditMode && (
              <button
                onClick={handleAddProject}
                className="p-2 border border-border rounded-full hover:bg-foreground hover:text-background transition-all"
                title="Add Project"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* 프로젝트 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          <AnimatePresence mode="popLayout">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={idx === 0 ? 'md:col-span-2 mb-12 relative' : 'relative'}
              >
                {isEditMode && (
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="absolute -top-4 -right-4 z-20 p-2 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity shadow-lg"
                    style={{ opacity: 1 }} // Always show in edit mode for clarity
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <TiltedCard 
                  className="group/card h-full flex flex-col"
                  rotationFactor={idx === 0 ? 3 : 5}
                >
                  {/* 썸네일 대용 박스 */}
                  <div className="aspect-[16/9] w-full bg-secondary/20 mb-10 overflow-hidden relative group">
                    {project.image_url ? (
                      <div className="relative w-full h-full">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           {isEditMode && (
                              <div className="bg-background/80 p-2 rounded backdrop-blur-sm w-[90%]">
                                <span className="text-xs text-muted-foreground block mb-1">Image URL</span>
                                <EditableText 
                                  content={project.image_url} 
                                  isEditMode={true} 
                                  onSave={(val) => handleUpdateProject(project.id, { image_url: val })} 
                                />
                              </div>
                           )}
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary/20">
                         {isEditMode ? (
                            <div className="w-[90%] text-center">
                                <span className="text-xs text-muted-foreground block mb-1">Set Image URL</span>
                                <EditableText 
                                  content="" 
                                  isEditMode={true} 
                                  onSave={(val) => handleUpdateProject(project.id, { image_url: val })} 
                                />
                            </div>
                         ) : (
                            <span className="text-[10px] font-black tracking-[0.5em] text-muted-foreground/50 group-hover:text-accent transition-colors uppercase">
                              {project.title}
                            </span>
                         )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-black tracking-tighter mb-4 group-hover:text-accent transition-colors ${
                        idx === 0 ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'
                      }`}>
                        <EditableText 
                          content={project.title} 
                          isEditMode={isEditMode} 
                          onSave={(val) => handleUpdateProject(project.id, { title: val })} 
                        />
                      </h3>

                      <div className={`text-muted-foreground mb-8 max-w-2xl leading-relaxed markdown-content ${
                        idx === 0 ? 'text-lg md:text-xl' : 'text-sm md:text-base'
                      }`}>
                        <EditableText 
                          content={project.description} 
                          isEditMode={isEditMode} 
                          onSave={(val) => handleUpdateProject(project.id, { description: val })} 
                          multiline
                        />
                        {!isEditMode && (
                          <div className="prose dark:prose-invert prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {project.description}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {project.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="text-[10px] font-bold tracking-widest uppercase px-0 py-1 text-muted-foreground"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 ml-6 pt-2">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full border border-border hover:bg-foreground hover:text-background transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full border border-border hover:bg-foreground hover:text-background transition-all"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </TiltedCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
