import { getLocale } from 'next-intl/server';
import { getSiteData } from '@/lib/db';
import HomeClient from './HomeClient';

export default async function Home() {
  const locale = await getLocale();
  const siteData = await getSiteData(locale, 'Hero');

  return <HomeClient siteData={siteData} />;
}
