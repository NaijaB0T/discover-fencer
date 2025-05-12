// src/routes/sitemap-fallback.xml/+server.js
import { dev } from '$app/environment';
import { BASE_URL } from '$lib/utils/constants';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ url, params }) {
  console.log('Fallback sitemap generator started');
  
  // Configure these values from your environment
  const website = dev ? url.origin : BASE_URL;
  const baseUrl = website.replace(/\/$/, ''); // Remove trailing slash if exists
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Define your static routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/faq',
    '/privacy',
    '/search',
    '/terms'
  ];

  // Create a simple fallback sitemap with static routes
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static routes
  for (const route of staticRoutes) {
    sitemap += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
  }
  
  // Generate synthetic contractor data for testing - using unique_id as the identifier
  for (let i = 0; i < 500; i++) {
    sitemap += `
  <url>
    <loc>${baseUrl}/contractor/unique_id_${i+1}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  sitemap += `
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600'
    }
  });
}

