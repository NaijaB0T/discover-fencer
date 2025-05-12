// src/routes/sitemap-index.xml/+server.js
import { dev } from '$app/environment';
import { BASE_URL } from '$lib/utils/constants';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ fetch, url }) {
  console.log('Sitemap index generator started');
  
  // Configure these values from your environment
  const website = dev ? url.origin : BASE_URL;
  const baseUrl = website.replace(/\/$/, ''); // Remove trailing slash if exists
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Use a fixed number of pages for reliability
  // We can approximate based on 1000 URLs per sitemap page
  const totalSitemapPages = 6; // Adjust based on your data size

  console.log(`Creating sitemap index with ${totalSitemapPages} pages`);
  
  // Build the sitemap index
  let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml?page=1</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`;

  // Add sitemap references for contractor pages
  for (let i = 2; i <= totalSitemapPages; i++) {
    sitemapIndex += `
  <sitemap>
    <loc>${baseUrl}/sitemap.xml?page=${i}</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`;
  }
  
  sitemapIndex += `
</sitemapindex>`;
  
  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600'
    }
  });
}

