'use client';

import { motion } from 'framer-motion';
import { AboutSection } from '@/components/sections/About';
import { ProjectsSection } from '@/components/sections/Projects';
import { SkillsSection } from '@/components/sections/Skills';
import { ExperienceSection } from '@/components/sections/Experience';
import { Footer } from '@/components/sections/Footer';
import type { Project, Skill, Career } from '@/lib/db';

type WorkClientProps = {
  projects: Project[];
  skills: Skill[];
  careers: Career[];
  siteData: Record<string, Record<string, string>>; // 섹션별 DB 데이터
};

export function WorkClient({ projects, skills, careers, siteData }: WorkClientProps) {
  return (
    <main className="min-h-screen bg-background pt-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <AboutSection data={siteData.About || {}} />
        <ExperienceSection careers={careers} />
        <ProjectsSection projects={projects} data={siteData.Projects || {}} />
        <SkillsSection skills={skills} data={siteData.Skills || {}} />
        <Footer data={siteData.Footer || {}} />
      </motion.div>
    </main>
  );
}
