// src/routes/sitemap-debug/+server.js
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ fetch, url }) {
  console.log('Sitemap debug endpoint started');
  const results = {};
  
  try {
    console.log('Attempting to fetch fence-contractors.json');
    const response = await fetch('/fence-contractors.json');
    results.fetchStatus = response.status;
    results.fetchOk = response.ok;
    
    if (response.ok) {
      const text = await response.text();
      results.dataLength = text.length;
      
      try {
        const data = JSON.parse(text);
        results.isValidJson = true;
        results.arrayLength = data.length;
        
        if (data.length > 0) {
          // Examine first 3 items to understand structure
          results.firstItems = data.slice(0, 3).map(item => {
            // Keep only a few fields to avoid overwhelming output
            const simplifiedItem = {};
            const keysToInclude = ['id', 'place_id', 'placeId', 'business_id', 'businessId', 
                                   'google_place_id', 'name', 'title', 'business_name', 'formatted_address'];
            
            for (const key of keysToInclude) {
              if (item[key] !== undefined) {
                simplifiedItem[key] = item[key];
              }
            }
            
            return simplifiedItem;
          });
          
          // Check all items for commonly used ID fields
          const idFields = ['id', 'place_id', 'placeId', 'business_id', 'businessId', 'google_place_id', 'unique_id'];
          results.idFieldStats = {};
          
          for (const field of idFields) {
            // Count how many items have this field defined
            const countWithField = data.filter(item => item[field] !== undefined).length;
            results.idFieldStats[field] = {
              count: countWithField,
              percentage: Math.round((countWithField / data.length) * 100),
              example: countWithField > 0 ? data.find(item => item[field] !== undefined)[field] : null
            };
          }
          
          // Collect all unique keys from the first 10 items
          const allKeys = new Set();
          data.slice(0, 10).forEach(item => {
            Object.keys(item).forEach(key => allKeys.add(key));
          });
          results.availableFields = Array.from(allKeys).sort();
          
          // Try to determine the route pattern by examining a sample entry
          results.recommendedRoutePattern = '/contractor/';
          for (const field of idFields) {
            if (results.idFieldStats[field]?.count > 0) {
              results.recommendedRoutePattern += `[${field}]`;
              break;
            }
          }
        }
      } catch (parseError) {
        results.isValidJson = false;
        results.parseError = parseError.message;
        
        // Show sample of the data
        if (text.length > 0) {
          results.dataSample = text.substring(0, Math.min(text.length, 500)) + '...';
        }
      }
    } else {
      results.fetchErrorDetails = `Status: ${response.status}, StatusText: ${response.statusText}`;
    }
  } catch (error) {
    results.fetchError = error.message;
    results.stack = error.stack;
  }
  
  // Try a sample of the routes to determine the actual structure
  try {
    results.sampleRoute = url.origin + '/contractor/unique_id'; // As provided by user
    results.currentSitemapStructure = url.origin + '/contractor/contractor-1001'; // What was observed
  } catch (routeError) {
    results.routeError = routeError.message;
  }
  
  console.log('Debug results:', results);
  
  // Return the debug information as JSON
  return new Response(JSON.stringify(results, null, 2), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
