import type { APIRoute } from 'astro';
import { sanityClient } from 'sanity:client';
import { defineQuery } from 'groq';
import { SITE_URL } from '../utils/seo';

// Prerender to a static sitemap.xml at build time.
export const prerender = true;

const ROOM_SLUGS = defineQuery(`*[_type == "room" && defined(slug.current)].slug.current`);
const ACTIVITY_SLUGS = defineQuery(`*[_type == "activity" && defined(slug.current)].slug.current`);

export const GET: APIRoute = async () => {
  const [roomSlugs, activitySlugs] = await Promise.all([
    sanityClient.fetch<string[]>(ROOM_SLUGS),
    sanityClient.fetch<string[]>(ACTIVITY_SLUGS),
  ]);

  const entries: { path: string; priority: string; changefreq: string }[] = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/rooms', priority: '0.9', changefreq: 'weekly' },
    { path: '/explore', priority: '0.7', changefreq: 'monthly' },
    { path: '/specials', priority: '0.8', changefreq: 'weekly' },
    ...(roomSlugs ?? []).map((s) => ({ path: `/rooms/${s}`, priority: '0.8', changefreq: 'monthly' })),
    ...(activitySlugs ?? []).map((s) => ({ path: `/explore/${s}`, priority: '0.6', changefreq: 'monthly' })),
  ];

  const today = new Date().toISOString().split('T')[0];
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${SITE_URL}${e.path}</loc>\n    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
