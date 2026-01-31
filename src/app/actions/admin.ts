'use server';

import { verifyOTP } from '@/lib/otp';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function checkAdminOTP(token: string) {
  const isValid = verifyOTP(token);
  // Optional: Add session cookie or JWT for persistent admin state
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
  return { success: true };
}
