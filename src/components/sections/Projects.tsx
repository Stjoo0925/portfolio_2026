'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { EditableText } from '@/components/EditableText';
import { useAdmin } from '@/providers/AdminProvider';
import type { Project } from '@/lib/db';

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const t = useTranslations('Projects');
  const { isEditMode } = useAdmin();

  return (
    <section className="py-24 px-6 bg-zinc-50/5 dark:bg-zinc-900/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 tracking-tight">
          <EditableText 
            content={t('title')} 
            isEditMode={isEditMode} 
            onSave={(val) => console.log('Save projects title:', val)}
          />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="aspect-video w-full overflow-hidden rounded-2xl glass border border-primary/10 mb-6">
                {project.image_url ? (
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                    <span className="text-primary/20 font-bold text-4xl">0{idx + 1}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">
                  <EditableText 
                    content={project.title} 
                    isEditMode={isEditMode} 
                    onSave={(val) => console.log(`Save project ${project.id} title:`, val)}
                  />
                </h3>
                <p className="text-muted-foreground">
                  <EditableText 
                    content={project.description} 
                    isEditMode={isEditMode} 
                    onSave={(val) => console.log(`Save project ${project.id} desc:`, val)}
                  />
                </p>
                <div className="flex gap-3">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs rounded-full bg-primary/5 border border-primary/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
