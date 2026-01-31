import { createClient } from '@/lib/supabase/server';

// 프로젝트 타입 정의
export type Project = {
  id: string;
  order_index: number;
  image_url: string | null;
  link: string | null;
  github_link: string | null;
  tags: string[];
  title: string;
  description: string;
};

// 스킬 타입 정의
export type Skill = {
  id: string;
  category: string;
  name: string;
  icon_name: string | null;
  proficiency: number;
  order_index: number;
};

// 고객후기 타입 정의
export type Testimonial = {
  id: string;
  name: string;
  avatar_url: string | null;
  order_index: number;
  content: string;
};

/**
 * 프로젝트 목록을 DB에서 가져옵니다.
 * i18n 테이블과 JOIN하여 locale에 맞는 제목/설명을 반환합니다.
 */
export async function getProjects(locale: string): Promise<Project[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      order_index,
      image_url,
      link,
      github_link,
      tags,
      projects_i18n!inner (
        title,
        description
      )
    `)
    .eq('projects_i18n.locale', locale)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    order_index: p.order_index,
    image_url: p.image_url,
    link: p.link,
    github_link: p.github_link,
    tags: p.tags || [],
    title: p.projects_i18n[0]?.title || '',
    description: p.projects_i18n[0]?.description || '',
  }));
}

/**
 * 스킬 목록을 DB에서 가져옵니다.
 */
export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category', { ascending: true })
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching skills:', error);
    return [];
  }

  return data || [];
}

/**
 * 고객후기 목록을 DB에서 가져옵니다.
 * i18n 테이블과 JOIN하여 locale에 맞는 내용을 반환합니다.
 */
export async function getTestimonials(locale: string): Promise<Testimonial[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('testimonials')
    .select(`
      id,
      name,
      avatar_url,
      order_index,
      testimonials_i18n!inner (
        content
      )
    `)
    .eq('testimonials_i18n.locale', locale)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }

  return (data || []).map((t: any) => ({
    id: t.id,
    name: t.name,
    avatar_url: t.avatar_url,
    order_index: t.order_index,
    content: t.testimonials_i18n[0]?.content || '',
  }));
}
