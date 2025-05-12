// src/routes/sitemap.xml/+server.js
import { dev } from '$app/environment';
import { BASE_URL } from '$lib/utils/constants';

// Disable caching during debugging
const CACHE_DURATION = 0; // Set to 0 to disable caching during development
let cachedSitemap = {};
let cacheTime = 0;

/**
 * Utility function to log debug information
 */
function debug(message, obj = null) {
  console.log(`[SITEMAP] ${message}`);
  if (obj) console.log(JSON.stringify(obj, null, 2));
}

/**
 * Function to extract the contractor's unique identifier
 * @param {Object} contractor - The contractor object from JSON
 * @param {number} index - The index of the contractor in the array (for fallback)
 * @returns {string} The unique identifier
 */
function getContractorId(contractor, index) {
  // Try each of these fields in order
  // IMPORTANT: Using 'unique_id' first since that's what you mentioned is used
  const idFields = ['unique_id', 'id', 'place_id', 'business_id', 'google_place_id', 'placeId', 'businessId'];
  
  for (const field of idFields) {
    if (contractor[field] && typeof contractor[field] === 'string') {
      return contractor[field];
    }
  }
  
  // If no proper ID field is found, use the index as a fallback
  return `item-${index + 1}`;
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ fetch, url, request }) {
  debug('Sitemap generator started');
  
  // Clear cache during development for testing
  cachedSitemap = {};
  
  // Check if we're requesting a specific sitemap page
  const urlParams = new URL(request.url).searchParams;
  const pageParam = urlParams.get('page');
  const isIndex = urlParams.get('index') === 'true';
  const forceRefresh = urlParams.get('refresh') === 'true';
  
  // CHANGE: Make the default behavior (no parameters) return the sitemap index
  // Only process a specific page if the page parameter is explicitly provided
  const showIndex = isIndex || !pageParam;
  const page = pageParam ? parseInt(pageParam, 10) : 0;
  
  debug(`Request: pageParam=${pageParam}, page=${page}, showIndex=${showIndex}, forceRefresh=${forceRefresh}`);
  
  // Return cached sitemap if it exists and isn't expired
  const cacheKey = `sitemap-${showIndex ? 'index' : page}`;
  const now = Date.now();
  if (!forceRefresh && cachedSitemap[cacheKey] && now - cacheTime < CACHE_DURATION) {
    debug(`Returning cached sitemap for ${cacheKey}`);
    return new Response(cachedSitemap[cacheKey], {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600'
      }
    });
  }

  // Configure these values from your environment
  const website = dev ? url.origin : BASE_URL;
  const baseUrl = website.replace(/\/$/, ''); // Remove trailing slash if exists
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Get static routes
  function getStaticRoutes() {
    return [
      '',
      '/about',
      '/contact',
      '/faq',
      '/privacy',
      '/search',
      '/terms'
    ];
  }

  // Create sitemap index if requested
  if (showIndex) {
    debug('Creating sitemap index');
    
    // Default to 6 pages if we can't determine the count (covers up to 5000 contractors)
    const totalSitemapPages = 6; 
    
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
    
    // Cache the sitemap index
    cachedSitemap['index'] = sitemapIndex;
    cacheTime = now;
    
    return new Response(sitemapIndex, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600'
      }
    });
  }
  
  // If we're on page 1, serve static routes
  if (page === 1) {
    debug('Creating sitemap page 1 with static routes');
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Add static routes
    const staticRoutes = getStaticRoutes();
    for (const route of staticRoutes) {
      sitemap += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    }
    
    sitemap += `
</urlset>`;
    
    // Cache this sitemap page
    cachedSitemap['1'] = sitemap;
    cacheTime = now;
    
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600',
        'X-Sitemap-Page': '1'
      }
    });
  }
  
  // Load contractor data for subsequent pages
  let contractors = [];
  debug('Attempting to load contractor data for page ' + page);
  
  try {
    // Use dynamic import for the contractor data since it's likely cached in the browser
    const response = await fetch('/fence-contractors.json');
    debug(`Fetch response status: ${response.status}`);
    
    if (response.ok) {
      const text = await response.text();
      debug(`Response length: ${text.length} characters`);
      
      try {
        contractors = JSON.parse(text);
        debug(`Successfully loaded ${contractors.length} contractors`);
        
        // Log the first contractor to validate structure
        if (contractors.length > 0) {
          debug('First contractor sample:');
          
          const sample = contractors[0];
          const sampleFields = {};
          
          // Only log important fields to keep the log manageable
          ['unique_id', 'id', 'place_id', 'business_id', 'name', 'title', 'formatted_address'].forEach(field => {
            if (sample[field] !== undefined) {
              sampleFields[field] = sample[field];
            }
          });
          
          debug('Sample contractor fields:', sampleFields);
        }
      } catch (parseError) {
        debug(`JSON Parse error: ${parseError.message}`);
        if (text.length > 100) {
          debug(`First 100 chars of response: ${text.substring(0, 100)}...`);
        } else {
          debug(`Full response: ${text}`);
        }
      }
    } else {
      debug(`Failed to fetch contractors data: HTTP ${response.status}`);
      
      // Try an alternative approach - directly access the file
      try {
        debug('Trying alternative fetch approach');
        const altResponse = await fetch(new URL('/static/fence-contractors.json', baseUrl).toString());
        debug(`Alt fetch response status: ${altResponse.status}`);
        
        if (altResponse.ok) {
          contractors = await altResponse.json();
          debug(`Successfully loaded ${contractors.length} contractors via alternative path`);
        }
      } catch (altFetchError) {
        debug(`Alternative fetch failed: ${altFetchError.message}`);
        
        // As a last resort, create some dummy data for debugging
        debug('Creating dummy data for debugging');
        contractors = Array.from({ length: 4000 }, (_, i) => ({
          unique_id: `dummy-${i + 1}`,
          business_name: `Dummy Contractor ${i + 1}`
        }));
      }
    }
  } catch (error) {
    debug(`Error loading contractor data: ${error.message}`);
    debug('Stack trace:', error.stack);
    
    // Generate dummy data for debugging
    debug('Creating dummy data for debugging due to error');
    contractors = Array.from({ length: 4000 }, (_, i) => ({
      unique_id: `dummy-${i + 1}`,
      business_name: `Dummy Contractor ${i + 1}`
    }));
  }
  
  // For other pages, serve contractor routes
  debug(`Creating sitemap page ${page} with contractors`);
  const ITEMS_PER_SITEMAP = 1000;
  const startIndex = (page - 2) * ITEMS_PER_SITEMAP;
  const endIndex = Math.min(startIndex + ITEMS_PER_SITEMAP, contractors.length);
  
  debug(`Page ${page}: Contractors from index ${startIndex} to ${endIndex - 1}`);
  
  // Check if this page should exist
  if (startIndex >= contractors.length) {
    debug(`Page ${page} is out of range (startIndex=${startIndex}, totalContractors=${contractors.length})`);
    return new Response('Sitemap page not found', { status: 404 });
  }
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  
  // Add contractor routes for this page
  let urlCount = 0;
  for (let i = startIndex; i < endIndex; i++) {
    const contractor = contractors[i];
    // Use the function to get the right ID
    const contractorId = getContractorId(contractor, i);
    
    sitemap += `
  <url>
    <loc>${baseUrl}/contractor/${contractorId}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    urlCount++;
  }
  
  sitemap += `
</urlset>`;
  
  debug(`Generated sitemap page ${page} with ${urlCount} URLs`);
  
  // Cache this sitemap page
  cachedSitemap[String(page)] = sitemap;
  cacheTime = now;
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600',
      'X-Sitemap-Page': String(page),
      'X-Url-Count': String(urlCount),
      'X-Contractor-Count': String(contractors.length),
      'X-Page-Range': `${startIndex}-${endIndex-1}`
    }
  });
}

