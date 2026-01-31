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

/**
 * 특정 섹션의 모든 데이터를 DB에서 가져옵니다. (site_data 테이블 활용)
 */
export async function getSiteData(locale: string, section: string): Promise<Record<string, string>> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('site_data')
    .select('key, value')
    .eq('locale', locale)
    .eq('section', section);

  if (error) {
    console.error(`Error fetching site_data for ${section}:`, error);
    return {};
  }

  const result: Record<string, string> = {};
  data?.forEach(item => {
    result[item.key] = item.value?.content || '';
  });
  
  return result;
}

/**
 * 스킬 추가
 */
export async function addSkill(skill: Omit<Skill, 'id'>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('skills').insert([skill]).select();
  if (error) throw error;
  return data[0];
}

/**
 * 스킬 삭제
 */
export async function deleteSkill(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw error;
}

/**
 * 스킬 수정
 */
export async function updateSkill(id: string, updates: Partial<Skill>) {
  const supabase = await createClient();
  const { error } = await supabase.from('skills').update(updates).eq('id', id);
  if (error) throw error;
}

/**
 * 프로젝트 추가 (i18n 포함)
 */
export async function addProject(locale: string, project: Omit<Project, 'id'>) {
  const supabase = await createClient();
  
  // 1. projects 테이블에 기본 정보 삽입
  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .insert([{
      order_index: project.order_index,
      image_url: project.image_url,
      link: project.link,
      github_link: project.github_link,
      tags: project.tags
    }])
    .select();

  if (projectError) throw projectError;
  const newProject = projectData[0];

  // 2. projects_i18n 테이블에 언어별 정보 삽입
  const { error: i18nError } = await supabase
    .from('projects_i18n')
    .insert([{
      project_id: newProject.id,
      locale,
      title: project.title,
      description: project.description
    }]);

  if (i18nError) throw i18nError;
  
  return { ...newProject, title: project.title, description: project.description };
}

/**
 * 프로젝트 삭제
 */
export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

/**
 * 프로젝트 i18n 업데이트
 */
export async function updateProjectI18n(id: string, locale: string, updates: { title?: string, description?: string }) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('projects_i18n')
    .upsert({
      project_id: id,
      locale,
      ...updates
    }, { onConflict: 'project_id,locale' });

  if (error) throw error;
}

/**
 * 프로젝트 기본 정보(이미지 등) 업데이트
 */
export async function updateProject(id: string, updates: Partial<Project>) {
  const supabase = await createClient();
  
  // image_url, link, github_link, tags 등 projects 테이블 컬럼만 필터링
  const projectUpdates: any = {};
  if (updates.image_url !== undefined) projectUpdates.image_url = updates.image_url;
  if (updates.link !== undefined) projectUpdates.link = updates.link;
  if (updates.github_link !== undefined) projectUpdates.github_link = updates.github_link;
  if (updates.tags !== undefined) projectUpdates.tags = updates.tags;
  if (updates.order_index !== undefined) projectUpdates.order_index = updates.order_index;

  if (Object.keys(projectUpdates).length === 0) return;

  const { error } = await supabase
    .from('projects')
    .update(projectUpdates)
    .eq('id', id);

  if (error) throw error;
}
