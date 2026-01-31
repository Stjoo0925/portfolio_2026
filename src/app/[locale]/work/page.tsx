import { getProjects, getSkills, getCareers, getSiteData } from '@/lib/db';
import { getLocale } from 'next-intl/server';
import { WorkClient } from './WorkClient';

export default async function WorkPage() {
  const locale = await getLocale();
  
  // DB에서 데이터 fetch
  const [projects, skills, careers, aboutData, projectsData, skillsData, footerData] = await Promise.all([
    getProjects(locale),
    getSkills(),
    getCareers(locale),
    getSiteData(locale, 'About'),
    getSiteData(locale, 'Projects'),
    getSiteData(locale, 'Skills'),
    getSiteData(locale, 'Footer'),
  ]);

  const siteData = {
    About: aboutData,
    Projects: projectsData,
    Skills: skillsData,
    Footer: footerData,
  };

  return (
    <WorkClient 
      projects={projects} 
      skills={skills}
      careers={careers}
      siteData={siteData}
    />
  );
}
