<script>
  import { onMount, afterUpdate } from 'svelte';
  import { formatPhoneNumber, formatStars, getStarClasses } from '$lib/utils.js';
  import { fade, fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { page } from '$app/stores';
  import Map from '$lib/components/ui/Map.svelte';
  
  // Get the contractor ID from the URL
  export let data;
  let id = data.id;
  
  // State for contractor data
  let contractor = null;
  let similarContractors = [];
  let nearbyContractors = [];
  let isLoading = true;
  let error = null;
  
  // User location
  let userLatitude = null;
  let userLongitude = null;
  
  // Keep track of all contractors data
  let allContractors = [];

  // Reviews pagination
  let reviewsPerPage = 3;
  let currentReviewPage = 1;
  let displayedReviews = [];
  let hasMoreReviews = false;
  
  // Function to load contractor data
  async function loadContractorData(contractorId) {
    isLoading = true;
    error = null;
    
    try {
      if (allContractors.length === 0) {
        // Only fetch the full JSON once
        const response = await fetch('/fence-contractors.json');
        if (!response.ok) {
          throw new Error('Failed to load contractors data');
        }
        
        // Use the direct json() method for better performance with large files
        allContractors = await response.json();
        console.log("Successfully loaded", allContractors.length, "contractors from JSON");
      }
      
      // Find the contractor by ID
      contractor = allContractors.find(c => c.unique_id === contractorId);
      
      if (!contractor) {
        throw new Error('Contractor not found');
      }
      
      // Get similar contractors (same state or category)
      similarContractors = allContractors
        .filter(c => c.unique_id !== contractorId && (c.state === contractor.state || c.category === contractor.category))
        .slice(0, 3);
      
      // Get nearby contractors based on neighbors array
      if (contractor.neighbors && contractor.neighbors.length > 0) {
        nearbyContractors = allContractors
          .filter(c => contractor.neighbors.includes(c.unique_id))
          .slice(0, 3);
      } else {
        nearbyContractors = [];
      }
      
      // Reset reviews pagination
      currentReviewPage = 1;
      updateDisplayedReviews();
      
      isLoading = false;
      
      // Scroll to top when loading a new contractor
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error loading contractor:', err);
      error = err.message;
      isLoading = false;
    }
  }
  
  // Update displayed reviews based on pagination
  function updateDisplayedReviews() {
    if (contractor && contractor.reviewers) {
      const totalReviews = contractor.reviewers.length;
      const endIndex = currentReviewPage * reviewsPerPage;
      
      displayedReviews = contractor.reviewers.slice(0, endIndex);
      hasMoreReviews = endIndex < totalReviews;
    } else {
      displayedReviews = [];
      hasMoreReviews = false;
    }
  }
  
  // Handle load more reviews button click
  function loadMoreReviews() {
    currentReviewPage += 1;
    updateDisplayedReviews();
  }
  
  // Initial data load
  onMount(() => {
    loadContractorData(id);
    
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLatitude = position.coords.latitude;
          userLongitude = position.coords.longitude;
        },
        (err) => {
          console.error('Geolocation error:', err);
        }
      );
    }
  });
  
  // Watch for changes in the URL parameter
  $: {
    const urlId = $page.params.id;
    if (urlId && urlId !== id) {
      id = urlId;
      loadContractorData(id);
    }
  }
  
  // Calculate distance if user location is available
  $: distance = calculateDistance();
  
  function calculateDistance() {
    if (!userLatitude || !userLongitude || !contractor?.latitude || !contractor?.longitude) {
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
  
  // Get star rating UI elements
  $: starClasses = contractor ? getStarClasses(contractor.stars) : { fullStars: 0, hasHalfStar: false };
  
  // Get image path (use updated_image as primary, fallback to others)
  $: imagePath = contractor?.updated_image || contractor?.photo_url || contractor?.local_image_path || '/images/contractors/default-fence.svg';
</script>

<svelte:head>
  {#if contractor}
    <title>{contractor.title} - Fence Contractor in {contractor.city}, {contractor.state}</title>
    <meta name="description" content="{contractor.business_summary || `${contractor.title} provides professional fence services in ${contractor.city}, ${contractor.state}.`}" />
  {:else}
    <title>Fence Contractor Details</title>
    <meta name="description" content="Find detailed information about top fence contractors." />
  {/if}
</svelte:head>

<div class="bg-gray-50 min-h-screen">
  <!-- Loading State -->
  {#if isLoading}
    <div class="container mx-auto px-4 py-16 flex justify-center">
      <div class="animate-pulse space-y-8 w-full max-w-4xl">
        <div class="h-8 bg-gray-200 rounded w-3/4"></div>
        <div class="h-72 bg-gray-200 rounded"></div>
        <div class="space-y-4">
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  
  <!-- Error State -->
  {:else if error}
    <div class="container mx-auto px-4 py-16 flex flex-col items-center">
      <div class="bg-white p-8 rounded-lg border shadow-md text-center max-w-lg" in:fade>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 class="text-xl font-medium text-gray-900 mb-2">{error}</h2>
        <p class="text-gray-600 mb-4">We couldn't find the contractor you're looking for.</p>
        <div class="flex justify-center space-x-4">
          <a 
            href="/" 
            class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Go Home
          </a>
          <button 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            on:click={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  
  <!-- Contractor Details -->
  {:else if contractor}
    <!-- Breadcrumbs -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-3 flex text-sm items-center text-gray-600">
        <a href="/" class="hover:text-primary">Home</a>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <a href="/" class="hover:text-primary">Contractors</a>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="text-gray-900 font-medium">{contractor.title}</span>
      </div>
    </div>
    
    <!-- Contractor Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="mb-4 md:mb-0" in:fly={{ y: 20, duration: 300 }}>
            <h1 class="text-3xl font-bold text-gray-900 mb-1">{contractor.title}</h1>
            <div class="flex items-center flex-wrap">
              <div class="flex items-center mr-4">
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
                <span class="ml-1 text-sm text-gray-600">({contractor.reviews} reviews)</span>
              </div>
              
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {contractor.city}, {contractor.state}
                </span>
                
                {#if distance}
                  <span class="text-sm text-gray-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    {distance} miles away
                  </span>
                {/if}
                
                <span class="text-sm bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {contractor.category}
                </span>
              </div>
            </div>
          </div>
          
          <div class="flex space-x-3" in:fly={{ y: 20, duration: 300, delay: 200 }}>
            {#if contractor.phone}
              <a 
                href={`tel:${contractor.phone}`} 
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
            {/if}
            
            {#if contractor.website}
              <a 
                href={contractor.website} 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Visit Website
              </a>
            {/if}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Main Info -->
        <div class="lg:col-span-2">
          <!-- Photos -->
          <div class="bg-white rounded-lg border shadow-sm overflow-hidden mb-8" in:fly={{ y: 20, duration: 300 }}>
            <div class="w-full relative pb-[56.25%]"> <!-- 16:9 aspect ratio container -->
              <img
                src={imagePath}
                alt={contractor ? `${contractor.title} - Fence contractor in ${contractor.city}, ${contractor.state}` : 'Fence contractor'}
                class="absolute inset-0 w-full h-full object-contain bg-gray-100"
                width="800"
                height="450"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          
          <!-- About -->
          <div class="bg-white rounded-lg border shadow-sm p-6 mb-8" in:fly={{ y: 20, duration: 300, delay: 100 }}>
            <h2 class="text-xl font-bold mb-4">About {contractor.title}</h2>
            <p class="text-gray-700 mb-6">
              {contractor.business_summary || `${contractor.title} is a professional fence contractor serving ${contractor.city}, ${contractor.state} and surrounding areas. With a focus on quality craftsmanship and customer satisfaction, they provide a range of fencing solutions to meet your needs.`}
            </p>
            
            <div>
              <h3 class="text-lg font-medium mb-2">Contact Information</h3>
              <div class="space-y-3">
                {#if contractor.phone}
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{formatPhoneNumber(contractor.phone)}</span>
                  </div>
                {/if}
                
                {#if contractor.website}
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <a href={contractor.website} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">{contractor.website.replace(/^https?:\/\//, '')}</a>
                  </div>
                {/if}
                
                {#if contractor.formatted_address}
                  <div class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{contractor.formatted_address}</span>
                  </div>
                {/if}
              </div>
            </div>
          </div>
          
          <!-- Reviews -->
          <div class="bg-white rounded-lg border shadow-sm p-6 mb-8" in:fly={{ y: 20, duration: 300, delay: 200 }}>
            <h2 class="text-xl font-bold mb-4">Customer Reviews</h2>
            
            {#if contractor.reviewers && contractor.reviewers.length > 0}
              <div class="space-y-6">
                {#each displayedReviews as review, index}
                  <div class="border-b border-gray-100 pb-6 last:border-0 last:pb-0" in:fade={{ duration: 300, delay: 300 + (index * 100) }}>
                    <div class="flex items-start">
                      <div class="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center text-gray-700 font-medium text-lg flex-shrink-0">
                        {review.reviewer_name.charAt(0)}
                      </div>
                      <div class="ml-4">
                        <div class="flex items-center">
                          <h4 class="font-medium">{review.reviewer_name}</h4>
                          <div class="flex text-amber-400 ml-2">
                            {#each Array(5) as _, i}
                              <svg class="w-4 h-4" fill={i < 5 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                              </svg>
                            {/each}
                          </div>
                        </div>
                        <p class="mt-2 text-gray-700">{review.review_text}</p>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
              
              {#if hasMoreReviews}
                <div class="mt-6 text-center">
                  <p class="text-gray-600 mb-3">Showing {displayedReviews.length} of {contractor.reviewers.length} reviews</p>
                  <button 
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    on:click={loadMoreReviews}
                  >
                    Load More Reviews
                  </button>
                </div>
              {/if}
            {:else}
              <p class="text-gray-600">No reviews available yet.</p>
            {/if}
          </div>
        </div>
        
        <!-- Right Column - Map and Similar Contractors -->
        <div class="lg:col-span-1">
          <!-- Map -->
          {#if contractor.latitude && contractor.longitude}
            <div class="bg-white rounded-lg border shadow-sm overflow-hidden mb-8" in:fly={{ y: 20, duration: 300, delay: 100 }}>
              <div class="p-4 border-b">
                <h3 class="font-medium">Location</h3>
              </div>
              <Map 
                latitude={contractor.latitude} 
                longitude={contractor.longitude} 
                address={contractor.formatted_address}
                name={contractor.title}
                height="300px"
              />
              <div class="p-4">
                <address class="text-gray-600 text-sm not-italic">
                  {contractor.formatted_address}
                </address>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contractor.formatted_address)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="text-primary hover:underline text-sm flex items-center mt-2"
                >
                  Get Directions
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          {/if}
          
          <!-- Nearby Contractors -->
          {#if nearbyContractors.length > 0}
            <div class="bg-white rounded-lg border shadow-sm overflow-hidden mb-8" in:fly={{ y: 20, duration: 300, delay: 150 }}>
              <div class="p-4 border-b">
                <h3 class="font-medium">Nearby Contractors</h3>
              </div>
              <div class="divide-y">
                {#each nearbyContractors as nearby, index}
                  <div class="p-4 hover:bg-gray-50" in:fade={{ duration: 300, delay: 250 + (index * 100) }}>
                    <a href={`/contractor/${nearby.unique_id}`} class="block">
                      <h4 class="font-medium mb-1 hover:text-primary">{nearby.title}</h4>
                      <div class="flex items-center mb-1">
                        <div class="flex text-amber-400">
                          {#each Array(5) as _, i}
                            <svg class="w-3 h-3" fill={i < Math.floor(nearby.stars) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                            </svg>
                          {/each}
                        </div>
                        <span class="ml-1 text-xs text-gray-600">{formatStars(nearby.stars)} ({nearby.reviews})</span>
                      </div>
                      <p class="text-sm text-gray-600">{nearby.city}, {nearby.state}</p>
                      <p class="text-xs text-gray-500 mt-1">{nearby.category}</p>
                    </a>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
          
          <!-- Similar Contractors -->
          {#if similarContractors.length > 0}
            <div class="bg-white rounded-lg border shadow-sm overflow-hidden" in:fly={{ y: 20, duration: 300, delay: 200 }}>
              <div class="p-4 border-b">
                <h3 class="font-medium">Similar Services Contractors</h3>
              </div>
              <div class="divide-y">
                {#each similarContractors as similar, index}
                  <div class="p-4 hover:bg-gray-50" in:fade={{ duration: 300, delay: 300 + (index * 100) }}>
                    <a href={`/contractor/${similar.unique_id}`} class="block">
                      <h4 class="font-medium mb-1 hover:text-primary">{similar.title}</h4>
                      <div class="flex items-center mb-1">
                        <div class="flex text-amber-400">
                          {#each Array(5) as _, i}
                            <svg class="w-3 h-3" fill={i < Math.floor(similar.stars) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                            </svg>
                          {/each}
                        </div>
                        <span class="ml-1 text-xs text-gray-600">{formatStars(similar.stars)} ({similar.reviews})</span>
                      </div>
                      <p class="text-sm text-gray-600">{similar.city}, {similar.state}</p>
                    </a>
                  </div>
                {/each}
              </div>
              <div class="p-4 bg-gray-50 border-t">
                <a href="/" class="text-primary hover:underline text-sm">View all contractors</a>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- CTA -->
    <div class="bg-primary py-12" in:fade={{ duration: 400, delay: 600 }}>
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p class="text-white/90 mb-6 max-w-2xl mx-auto">
          Contact {contractor.title} today to discuss your fencing project and get a free quote.
        </p>
        <div class="space-x-4">
          {#if contractor.phone}
            <a 
              href={`tel:${contractor.phone}`} 
              class="inline-flex items-center px-5 py-2.5 rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call {formatPhoneNumber(contractor.phone)}
            </a>
          {/if}
          
          {#if contractor.website}
            <a 
              href={contractor.website} 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-flex items-center px-5 py-2.5 rounded-md shadow-sm text-sm font-medium text-white bg-transparent border-2 border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Visit Website
            </a>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
