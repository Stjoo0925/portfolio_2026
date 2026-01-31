'use client';

import { motion } from 'framer-motion';
import { AboutSection } from '@/components/sections/About';
import { ProjectsSection } from '@/components/sections/Projects';
import { SkillsSection } from '@/components/sections/Skills';
import { Footer } from '@/components/sections/Footer';
import type { Project, Skill } from '@/lib/db';

type WorkClientProps = {
  projects: Project[];
  skills: Skill[];
  siteData: Record<string, Record<string, string>>; // 섹션별 DB 데이터
};

export function WorkClient({ projects, skills, siteData }: WorkClientProps) {
  return (
    <main className="min-h-screen bg-background pt-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <AboutSection data={siteData.About || {}} />
        <ProjectsSection projects={projects} data={siteData.Projects || {}} />
        <SkillsSection skills={skills} data={siteData.Skills || {}} />
        <Footer data={siteData.Footer || {}} />
      </motion.div>
    </main>
  );
}
