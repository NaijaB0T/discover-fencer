<script>
  import { formatPhoneNumber, formatStars, getStarClasses } from "$lib/utils.js";
  import { fly, scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  
  export let contractor;
  export let index = 0;
  export let userLatitude = null;
  export let userLongitude = null;
  
  // Calculate distance if user location is available
  $: distance = calculateDistance();
  
  function calculateDistance() {
    if (!userLatitude || !userLongitude || !contractor.latitude || !contractor.longitude) {
      return null;
    }
    
    const R = 3958.8; // Radius of the earth in miles
    const dLat = deg2rad(contractor.latitude - userLatitude);
    const dLon = deg2rad(contractor.longitude - userLongitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(userLatitude)) * Math.cos(deg2rad(contractor.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in miles
    
    return d.toFixed(1);
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  
  // Get star rating classes
  $: starClasses = getStarClasses(contractor.stars);
  
  // Get image path (use local_image_path, fallback to updated_image, fallback to photo_url)
  $: imagePath = contractor.updated_image || contractor.local_image_path || contractor.photo_url || '/images/contractors/default-fence.svg';
</script>

<div 
  class="group relative bg-white rounded-lg overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col"
  in:fly={{ y: 30, duration: 400, delay: index * 100, easing: quintOut }}
>
  {#if contractor.featured}
    <div 
      class="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium"
      in:scale={{ start: 0.8, duration: 200, delay: (index * 100) + 300 }}
    >
      Featured
    </div>
  {/if}
  
  <div class="relative h-48 overflow-hidden">
    <img
      src={imagePath}
      alt={`${contractor.title} - Fence contractor in ${contractor.city}, ${contractor.state}`}
      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      width="400"
      height="300"
      loading="lazy"
      decoding="async"
      on:error={(e) => { e.currentTarget.src = '/images/contractors/default-fence.svg'; }}
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    <div class="absolute bottom-0 left-0 w-full p-3 text-white">
      <h3 class="font-bold text-lg line-clamp-1">{contractor.title}</h3>
      <p class="text-sm opacity-90 line-clamp-1">{contractor.city}, {contractor.state}</p>
    </div>
  </div>
  
  <div class="flex-1 p-4 flex flex-col">
    <div class="flex items-center mb-2">
      <div class="flex text-amber-400">
        {#each Array(5) as _, i}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={i < starClasses.fullStars ? "currentColor" : (i === starClasses.fullStars && starClasses.hasHalfStar ? "url(#half-star)" : "none")}
            stroke="currentColor"
            class="w-4 h-4"
          >
            <defs>
              <linearGradient id="half-star">
                <stop offset="50%" stop-color="currentColor" />
                <stop offset="50%" stop-color="transparent" stop-opacity="1" />
              </linearGradient>
            </defs>
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        {/each}
      </div>
      <span class="ml-1 text-sm font-medium">{formatStars(contractor.stars)}</span>
      <span class="mx-1 text-gray-400">•</span>
      <span class="text-sm text-gray-600">{contractor.reviews} reviews</span>
    </div>
    
    <p class="text-sm text-gray-600 mb-3 line-clamp-2">{contractor.business_summary || `${contractor.title} provides professional fence services in ${contractor.city}, ${contractor.state}.`}</p>
    
    <div class="text-sm text-gray-600 space-y-1 mb-4">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span>{formatPhoneNumber(contractor.phone)}</span>
      </div>
      
      <div class="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="line-clamp-2">{contractor.formatted_address}</span>
      </div>
      
      {#if distance !== null}
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>{distance} miles away</span>
        </div>
      {/if}
    </div>
    
    <div class="mt-auto pt-3 border-t flex justify-between">
      <a 
        href={`/contractor/${contractor.unique_id}`} 
        class="text-sm font-medium text-primary hover:underline"
      >
        View Details
      </a>
      
      {#if contractor.website}
        <a 
          href={contractor.website} 
          target="_blank" 
          rel="noopener noreferrer"
          class="text-sm font-medium text-gray-600 hover:text-primary flex items-center"
        >
          Website
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      {/if}
    </div>
  </div>
</div>
