'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, Github, ExternalLink, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useAdmin } from '@/providers/AdminProvider';
import { EditableText } from '@/components/EditableText';
import { updateSiteContent, addProjectAction, deleteProjectAction, updateProjectAction } from '@/app/actions/admin';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import type { Project } from '@/lib/db';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from '@/i18n/routing';

type ProjectsSectionProps = {
  projects: Project[];
  data: Record<string, string>;
};

export function ProjectsSection({ projects, data }: ProjectsSectionProps) {
  const locale = useLocale();
  const t = useTranslations('Projects');
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const handleSaveSection = async (key: string, value: string) => {
    const result = await updateSiteContent({
      locale,
      section: 'Projects',
      key,
      value
    });
    if (result.success) {
      toast.success('저장되었습니다.');
      router.refresh();
    }
  };

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    const result = await updateProjectAction(id, locale, updates);
    if (result.success) {
      toast.success('프로젝트가 업데이트되었습니다.');
      router.refresh();
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

  const featuredProject = projects[0];
  const otherProjects = projects.slice(1);

  return (
    <section id="projects" className="py-24 px-6 md:px-12 lg:px-24 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="mb-20 flex items-baseline justify-between border-b border-border pb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
              <EditableText 
                content={data.title || t('title')} 
                isEditMode={isEditMode} 
                onSave={(val) => handleSaveSection('title', val)} 
                multiline={false}
              />
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
        </div>

        {/* 메인 프로젝트 (첫 번째) */}
        {featuredProject && (
          <div className="mb-24">
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {isEditMode && (
                <button
                  onClick={() => handleDeleteProject(featuredProject.id)}
                  className="absolute -top-4 -right-4 z-20 p-2 bg-destructive text-destructive-foreground rounded-full opacity-100 shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              
              <div className="grid md:grid-cols-2 gap-10 items-start">
                {/* 썸네일 영역 */}
                <div className="aspect-[16/10] w-full bg-secondary/20 overflow-hidden relative rounded-xl border border-border group-hover:border-accent/50 transition-colors">
                  {featuredProject.image_url ? (
                    <div className="relative w-full h-full">
                      <Image 
                        src={featuredProject.image_url} 
                        alt={featuredProject.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {isEditMode && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-background/80 p-2 rounded backdrop-blur-sm w-[90%]">
                              <span className="text-xs text-muted-foreground block mb-1">Image URL</span>
                              <EditableText 
                                content={featuredProject.image_url} 
                                isEditMode={true} 
                                onSave={(val) => handleUpdateProject(featuredProject.id, { image_url: val })} 
                              />
                            </div>
                          </div>
                      )}
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary/20 text-muted-foreground">
                        {isEditMode ? (
                          <EditableText 
                            content="" 
                            isEditMode={true} 
                            onSave={(val) => handleUpdateProject(featuredProject.id, { image_url: val })} 
                          />
                        ) : (
                          <span className="text-[10px] font-black tracking-[0.5em] uppercase">
                            {featuredProject.title}
                          </span>
                        )}
                    </div>
                  )}
                </div>

                {/* 텍스트 영역 */}
                <div className="flex flex-col h-full justify-center">
                  <h3 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 group-hover:text-accent transition-colors">
                    <EditableText 
                      content={featuredProject.title} 
                      isEditMode={isEditMode} 
                      onSave={(val) => handleUpdateProject(featuredProject.id, { title: val })} 
                    />
                  </h3>

                  <div className="text-muted-foreground mb-8 text-lg leading-relaxed markdown-content prose dark:prose-invert prose-p:text-muted-foreground max-w-none">
                    <EditableText 
                      content={featuredProject.description} 
                      isEditMode={isEditMode} 
                      onSave={(val) => handleUpdateProject(featuredProject.id, { description: val })} 
                      multiline
                    />
                    {!isEditMode && (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {featuredProject.description}
                      </ReactMarkdown>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {featuredProject.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-border text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    {isEditMode ? (
                      <div className="flex flex-col gap-2 p-4 border border-dashed border-border rounded-lg bg-secondary/10">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Links (Admin)</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs w-16">Site:</span>
                          <EditableText 
                            content={featuredProject.link || ''} 
                            isEditMode={true} 
                            onSave={(val) => handleUpdateProject(featuredProject.id, { link: val })} 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs w-16">GitHub:</span>
                          <EditableText 
                            content={featuredProject.github_link || ''} 
                            isEditMode={true} 
                            onSave={(val) => handleUpdateProject(featuredProject.id, { github_link: val })} 
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        {featuredProject.link && (
                          <a
                            href={featuredProject.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all font-medium text-sm"
                          >
                            Visit Site <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                        {featuredProject.github_link && (
                          <a
                            href={featuredProject.github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:bg-secondary transition-all font-medium text-sm"
                          >
                            GitHub <Github className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 나머지 프로젝트 (그리드) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {otherProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group relative flex flex-col h-full border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-colors bg-card"
              >
                {isEditMode && (
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="absolute top-2 right-2 z-20 p-2 bg-destructive text-destructive-foreground rounded-full opacity-100 shadow-lg"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                {/* 작은 카드: 이미지 */}
                <div className="aspect-video w-full bg-secondary/20 relative overflow-hidden">
                  {project.image_url ? (
                    <>
                      <Image 
                        src={project.image_url} 
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {isEditMode && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-background/80 p-2 rounded backdrop-blur-sm w-[90%]">
                              <EditableText 
                                content={project.image_url} 
                                isEditMode={true} 
                                onSave={(val) => handleUpdateProject(project.id, { image_url: val })} 
                              />
                            </div>
                          </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary/20 text-muted-foreground p-4 text-center">
                        {isEditMode ? (
                          <EditableText 
                            content="" 
                            isEditMode={true} 
                            onSave={(val) => handleUpdateProject(project.id, { image_url: val })} 
                          />
                        ) : (
                          <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                            {project.title}
                          </span>
                        )}
                    </div>
                  )}
                </div>

                {/* 작은 카드: 텍스트 */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold tracking-tight group-hover:text-accent transition-colors line-clamp-1">
                      <EditableText 
                        content={project.title} 
                        isEditMode={isEditMode} 
                        onSave={(val) => handleUpdateProject(project.id, { title: val })} 
                      />
                    </h4>
                    
                    {!isEditMode && (
                      <div className="flex gap-2 shrink-0">
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {project.github_link && (
                          <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {isEditMode && (
                    <div className="mb-4 space-y-2 p-2 bg-secondary/10 rounded border border-dashed border-border/50 text-xs">
                       <div className="flex items-center gap-2">
                          <span className="w-8">URL:</span>
                          <EditableText 
                            content={project.link || ''} 
                            isEditMode={true} 
                            onSave={(val) => handleUpdateProject(project.id, { link: val })} 
                          />
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="w-8">Git:</span>
                          <EditableText 
                            content={project.github_link || ''} 
                            isEditMode={true} 
                            onSave={(val) => handleUpdateProject(project.id, { github_link: val })} 
                          />
                       </div>
                    </div>
                  )}

                  <div className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1 prose dark:prose-invert prose-sm">
                    <EditableText 
                      content={project.description} 
                      isEditMode={isEditMode} 
                      onSave={(val) => handleUpdateProject(project.id, { description: val })} 
                      multiline
                    />
                    {!isEditMode && (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {project.description}
                      </ReactMarkdown>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag} 
                        className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded border border-border text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-[10px] px-2 py-1 text-muted-foreground">+{project.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
