'use server';

import { verifyOTP } from '@/lib/otp';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function checkAdminOTP(token: string) {
  const isValid = verifyOTP(token);
  return isValid;
}

export async function updateSiteContent(params: {
  locale: string;
  section: string;
  key: string;
  value: any;
}) {
  const supabase = await createClient();
  
  // Security: In real app, check user session with Supabase Auth
  const { data, error } = await supabase
    .from('site_data')
    .upsert({
      locale: params.locale,
      section: params.section,
      key: params.key,
      value: { content: params.value }, // Match schema
      updated_at: new Date().toISOString()
    })
    .select();

  if (error) {
    console.error('Update error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/[locale]', 'layout');
  revalidatePath('/[locale]/work', 'page');
  return { success: true };
}

export async function addNewSkill(skill: any) {
  const { addSkill } = await import('@/lib/db');
  try {
    await addSkill(skill);
    revalidatePath('/[locale]/work', 'page');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function removeSkill(id: string) {
  const { deleteSkill } = await import('@/lib/db');
  try {
    await deleteSkill(id);
    revalidatePath('/[locale]/work', 'page');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function editSkill(id: string, updates: any) {
  const { updateSkill } = await import('@/lib/db');
  try {
    await updateSkill(id, updates);
    revalidatePath('/[locale]/work', 'page');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addProjectAction(locale: string, project: any) {
  const { addProject } = await import('@/lib/db');
  try {
    await addProject(locale, project);
    revalidatePath('/[locale]/work', 'page');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProjectAction(id: string) {
  const { deleteProject } = await import('@/lib/db');
  try {
    await deleteProject(id);
    revalidatePath('/[locale]/work', 'page');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProjectAction(id: string, locale: string, updates: any) {
  const { updateProjectI18n, updateProject } = await import('@/lib/db');
  try {
    // 1. i18n 업데이트 (제목, 설명)
    if (updates.title !== undefined || updates.description !== undefined) {
      await updateProjectI18n(id, locale, {
        title: updates.title,
        description: updates.description
      });
    }

    // 2. 기본 정보 업데이트 (이미지, 링크 등)
    if (
      updates.image_url !== undefined || 
      updates.link !== undefined || 
      updates.github_link !== undefined || 
      updates.tags !== undefined
    ) {
      await updateProject(id, updates);
    }

    revalidatePath('/[locale]/work', 'page');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
