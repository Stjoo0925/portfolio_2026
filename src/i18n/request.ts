import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { getAllSiteData } from '@/lib/db';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // DB에서 메시지 가져오기
  const messages = await getAllSiteData(locale as string);

  return {
    locale: locale as string,
    messages
  };
});
