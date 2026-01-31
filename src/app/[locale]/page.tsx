import { getProjects, getSkills, getTestimonials } from '@/lib/db';
import { getLocale } from 'next-intl/server';
import HomeClient from './HomeClient';

export default async function Home() {
  const locale = await getLocale();
  
  // DB에서 데이터 fetch
  const [projects, skills, testimonials] = await Promise.all([
    getProjects(locale),
    getSkills(),
    getTestimonials(locale),
  ]);

  return (
    <HomeClient 
      projects={projects} 
      skills={skills} 
      testimonials={testimonials} 
    />
  );
}
