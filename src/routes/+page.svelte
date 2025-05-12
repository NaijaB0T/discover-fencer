<script>
  import { onMount } from 'svelte';
  import ContractorCard from '$lib/components/ContractorCard.svelte';
  import SearchFilters from '$lib/components/SearchFilters.svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  // State for contractors data
  let contractors = [];
  let filteredContractors = [];
  let featuredContractors = [];
  let isLoading = true;
  let error = null;
  
  // Filter states
  let states = [];
  let categories = [];
  let selectedState = "";
  let selectedCategory = "";
  let minRating = 0;
  let searchQuery = "";
  
  // User location
  let userLatitude = null;
  let userLongitude = null;
  let isLocating = false;
  let locationError = null;
  
  // Pagination
  let currentPage = 1;
  const pageSize = 9;
  let totalPages = 1;
  let paginatedContractors = [];
  
  // Load data on component mount
  onMount(async () => {
    try {
      const response = await fetch('/fence-contractors.json');
      if (!response.ok) {
        throw new Error('Failed to load contractors data');
      }
      
      // For large JSON files, use the fetch API's json() method
      // which is more efficient for parsing large files
      try {
        const jsonData = await response.json();
        console.log("Successfully loaded", jsonData.length, "contractors from JSON");
        
        contractors = jsonData;
        
        // Extract unique states and categories
        states = [...new Set(contractors.map(c => c.state))].sort();
        categories = [...new Set(contractors.map(c => c.category))].sort();
        
        // Get featured contractors - up to 3 featured ones
        const featured = contractors.filter(c => c.featured);
        featuredContractors = featured.length > 0 ? 
          featured.slice(0, 3) : 
          contractors.slice(0, 3); // If no featured, take first 3
        
        // Initialize filtered contractors with all contractors
        filteredContractors = [...contractors];
        updatePagination();
        
        isLoading = false;
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        throw new Error(`Error parsing JSON: ${jsonError.message}`);
      }
    } catch (err) {
      console.error('Error loading contractors:', err);
      error = err.message;
      isLoading = false;
      
      // Set empty arrays for all data
      contractors = [];
      states = [];
      categories = [];
      featuredContractors = [];
      filteredContractors = [];
      updatePagination();
    }
    
    // Try to get user location
    if (navigator.geolocation) {
      isLocating = true;
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLatitude = position.coords.latitude;
          userLongitude = position.coords.longitude;
          isLocating = false;
        },
        (err) => {
          console.error('Geolocation error:', err);
          locationError = 'Could not retrieve your location.';
          isLocating = false;
        },
        { timeout: 10000 }
      );
    }
  });
  
  // Handle filtering
  function handleSearch(event) {
    const { state, category, rating, query } = event.detail;
    
    filteredContractors = contractors.filter(contractor => {
      // Filter by state
      if (state && contractor.state !== state) return false;
      
      // Filter by category
      if (category && contractor.category !== category) return false;
      
      // Filter by rating
      if (rating > 0 && (contractor.stars < rating)) return false;
      
      // Filter by search query (check title, business summary, and address)
      if (query) {
        const searchLower = query.toLowerCase();
        const titleMatch = contractor.title?.toLowerCase().includes(searchLower);
        const summaryMatch = contractor.business_summary?.toLowerCase().includes(searchLower);
        const addressMatch = contractor.formatted_address?.toLowerCase().includes(searchLower);
        const cityMatch = contractor.city?.toLowerCase().includes(searchLower);
        
        if (!(titleMatch || summaryMatch || addressMatch || cityMatch)) return false;
      }
      
      return true;
    });
    
    // Reset to first page
    currentPage = 1;
    updatePagination();
  }
  
  // Handle pagination
  function updatePagination() {
    totalPages = Math.ceil(filteredContractors.length / pageSize);
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    paginatedContractors = filteredContractors.slice(startIndex, endIndex);
  }
  
  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    updatePagination();
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
  }
  
  // Update pagination when filtered contractors change
  $: if (filteredContractors) {
    updatePagination();
  }
</script>

<svelte:head>
  <title>Discover Fencer - Find the Best Fence Contractors Near You</title>
  <meta name="description" content="Discover top-rated fence contractors in your area. Compare prices, read reviews, and find the perfect fence installation, repair, or custom fencing service for your needs." />
</svelte:head>

<!-- Hero Section -->
<section class="relative bg-gradient-to-r from-primary/90 to-primary">
  <div class="absolute inset-0 bg-black/50 z-0"></div>
  <div class="container relative z-10 py-20 px-4 sm:px-6 lg:px-8 mx-auto">
    <div class="text-center" in:fade={{ duration: 600, delay: 200 }}>
      <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
        Find Your Perfect Fence Contractor
      </h1>
      <p class="mt-6 max-w-md mx-auto text-xl text-white/90">
        Compare top-rated fence professionals in your area to get the best service at the right price.
      </p>
      <div class="mt-10 max-w-md mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a href="#search" 
             class="bg-white text-primary font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
             in:scale={{ start: 0.9, opacity: 0, duration: 400, delay: 600 }}
          >
            Find Contractors
          </a>
          <a href="/about" 
             class="bg-transparent text-white font-bold py-3 px-4 rounded-lg border-2 border-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
             in:scale={{ start: 0.9, opacity: 0, duration: 400, delay: 800 }}
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Featured Contractors -->
<section class="py-12 bg-gray-50">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-center mb-12" in:fly={{ y: 20, duration: 400 }}>
      Featured Fence Contractors
    </h2>
    
    {#if isLoading}
      <div class="flex justify-center py-12">
        <div class="animate-pulse flex space-x-4">
          <div class="rounded-full bg-gray-200 h-12 w-12"></div>
          <div class="flex-1 space-y-4 py-1">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    {:else if featuredContractors.length === 0}
      <p class="text-center text-gray-600 py-12">No featured contractors available at this time.</p>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each featuredContractors as contractor, index}
          <ContractorCard 
            {contractor} 
            {index} 
            {userLatitude} 
            {userLongitude} 
          />
        {/each}
      </div>
    {/if}
  </div>
</section>

<!-- Search Section -->
<section id="search" class="py-16 bg-white">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold mb-12 text-center" in:fly={{ y: 20, duration: 400 }}>
        Find Fence Contractors Near You
      </h2>
      
      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-8" role="alert">
          <div class="flex">
            <div class="py-1">
              <svg class="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
              </svg>
            </div>
            <div>
              <p class="font-bold">Error</p>
              <p class="text-sm">{error}</p>
            </div>
          </div>
        </div>
      {/if}
      
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Search Filters -->
        <div class="lg:col-span-1">
          <SearchFilters 
            {states} 
            {categories} 
            {minRating} 
            {selectedState} 
            {selectedCategory} 
            {searchQuery}
            on:search={handleSearch}
          />
          
          {#if isLocating}
            <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-700" in:fade>
              <div class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Getting your location...</span>
              </div>
            </div>
          {:else if locationError}
            <div class="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-700" in:fade>
              <p>{locationError}</p>
              <p class="mt-1">Distance calculations won't be available.</p>
            </div>
          {/if}
        </div>
        
        <!-- Results -->
        <div class="lg:col-span-3" id="results">
          {#if isLoading}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {#each Array(6) as _, i}
                <div class="bg-white rounded-lg border shadow-md p-4 animate-pulse">
                  <div class="h-48 bg-gray-200 rounded-md mb-4"></div>
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div class="space-y-2 mb-4">
                    <div class="h-3 bg-gray-200 rounded"></div>
                    <div class="h-3 bg-gray-200 rounded"></div>
                    <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div class="h-10 bg-gray-200 rounded-md"></div>
                </div>
              {/each}
            </div>
          {:else if filteredContractors.length === 0}
            <div class="bg-white p-8 rounded-lg border shadow-md text-center" in:fade>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No contractors found</h3>
              <p class="text-gray-600 mb-4">Try adjusting your search filters to find more results.</p>
              <button 
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                on:click={() => {
                  selectedState = "";
                  selectedCategory = "";
                  minRating = 0;
                  searchQuery = "";
                  handleSearch({ detail: { state: "", category: "", rating: 0, query: "" } });
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Filters
              </button>
            </div>
          {:else}
            <!-- Results Header -->
            <div class="flex justify-between items-center mb-6" in:fade={{ duration: 300 }}>
              <p class="text-gray-600">
                <span class="font-medium">{filteredContractors.length}</span> contractors found
                {#if selectedState}
                  in <span class="font-medium">{selectedState}</span>
                {/if}
                {#if selectedCategory}
                  for <span class="font-medium">{selectedCategory}</span>
                {/if}
              </p>
              
              <div class="flex items-center space-x-2 text-sm">
                <span class="text-gray-600">Sort by:</span>
                <select 
                  class="border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                  on:change={(e) => {
                    const sortValue = e.target.value;
                    
                    if (sortValue === 'rating') {
                      filteredContractors = [...filteredContractors].sort((a, b) => b.stars - a.stars);
                    } else if (sortValue === 'reviews') {
                      filteredContractors = [...filteredContractors].sort((a, b) => b.reviews - a.reviews);
                    } else if (sortValue === 'name') {
                      filteredContractors = [...filteredContractors].sort((a, b) => a.title.localeCompare(b.title));
                    }
                    
                    updatePagination();
                  }}
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
            
            <!-- Results Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {#each paginatedContractors as contractor, index}
                <ContractorCard 
                  {contractor} 
                  {index} 
                  {userLatitude} 
                  {userLongitude} 
                />
              {/each}
            </div>
            
            <!-- Pagination -->
            {#if totalPages > 1}
              <div class="flex justify-center mt-8" in:fade={{ duration: 300, delay: 300 }}>
                <nav class="flex items-center space-x-1">
                  <button 
                    class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                    on:click={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {#each Array(totalPages) as _, i}
                    {#if totalPages <= 7 || i + 1 === 1 || i + 1 === totalPages || (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)}
                      <button
                        class="px-3 py-1.5 rounded-md text-sm font-medium {currentPage === i + 1 ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}"
                        on:click={() => goToPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    {:else if (i + 1 === 2 && currentPage > 3) || (i + 1 === totalPages - 1 && currentPage < totalPages - 2)}
                      <span class="px-2 py-1.5 text-gray-500">...</span>
                    {/if}
                  {/each}
                  
                  <button 
                    class="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                    on:click={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            {/if}
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- How It Works -->
<section class="py-16 bg-gray-50">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-center mb-12" in:fly={{ y: 20, duration: 400 }}>
      How It Works
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Step 1 -->
      <div class="bg-white rounded-lg border shadow-md p-6 text-center" in:fly={{ y: 20, duration: 400, delay: 100 }}>
        <div class="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Search</h3>
        <p class="text-gray-600">
          Use our comprehensive search to find fence contractors in your area. Filter by location, services, and ratings.
        </p>
      </div>
      
      <!-- Step 2 -->
      <div class="bg-white rounded-lg border shadow-md p-6 text-center" in:fly={{ y: 20, duration: 400, delay: 200 }}>
        <div class="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Compare</h3>
        <p class="text-gray-600">
          Review ratings, services, and customer testimonials to compare contractors and find the best fit for your project.
        </p>
      </div>
      
      <!-- Step 3 -->
      <div class="bg-white rounded-lg border shadow-md p-6 text-center" in:fly={{ y: 20, duration: 400, delay: 300 }}>
        <div class="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Contact</h3>
        <p class="text-gray-600">
          Reach out directly to the contractors of your choice to discuss your project and get detailed quotes.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Testimonials Section -->
<section class="py-16 bg-white">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-center mb-6" in:fly={{ y: 20, duration: 400 }}>
      What Our Users Say
    </h2>
    <p class="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
      Read what homeowners have to say about their experience finding fence contractors through our directory.
    </p>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Testimonial 1 -->
      <div class="bg-gray-50 rounded-lg border p-6" in:fly={{ y: 20, duration: 400, delay: 100 }}>
        <div class="flex items-center mb-4">
          <div class="flex text-amber-400">
            {#each Array(5) as _}
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            {/each}
          </div>
        </div>
        <p class="text-gray-700 mb-6 italic">
          "Discover Fencer made it so easy to find a reliable fence contractor in my area. Within days, I had multiple quotes and was able to hire a great contractor who finished our project on time and within budget!"
        </p>
        <div class="flex items-center">
          <div class="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center text-gray-700 font-medium text-xl mr-4">
            RM
          </div>
          <div>
            <h4 class="font-medium">Robert Martinez</h4>
            <p class="text-sm text-gray-600">Austin, TX</p>
          </div>
        </div>
      </div>
      
      <!-- Testimonial 2 -->
      <div class="bg-gray-50 rounded-lg border p-6" in:fly={{ y: 20, duration: 400, delay: 200 }}>
        <div class="flex items-center mb-4">
          <div class="flex text-amber-400">
            {#each Array(5) as _}
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            {/each}
          </div>
        </div>
        <p class="text-gray-700 mb-6 italic">
          "I was overwhelmed by options until I found Discover Fencer. The filtering options helped me narrow down contractors who specialize in privacy fencing. The reviews were accurate and helped me make an informed decision."
        </p>
        <div class="flex items-center">
          <div class="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center text-gray-700 font-medium text-xl mr-4">
            KJ
          </div>
          <div>
            <h4 class="font-medium">Karen Johnson</h4>
            <p class="text-sm text-gray-600">Dallas, TX</p>
          </div>
        </div>
      </div>
      
      <!-- Testimonial 3 -->
      <div class="bg-gray-50 rounded-lg border p-6" in:fly={{ y: 20, duration: 400, delay: 300 }}>
        <div class="flex items-center mb-4">
          <div class="flex text-amber-400">
            {#each Array(5) as _}
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            {/each}
          </div>
        </div>
        <p class="text-gray-700 mb-6 italic">
          "The contractor we found through Discover Fencer was exceptional. They installed our custom decorative fence with precision and care. Being able to see their previous work and customer reviews made all the difference."
        </p>
        <div class="flex items-center">
          <div class="bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center text-gray-700 font-medium text-xl mr-4">
            TW
          </div>
          <div>
            <h4 class="font-medium">Thomas Wilson</h4>
            <p class="text-sm text-gray-600">Houston, TX</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-16 bg-primary">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="max-w-3xl mx-auto" in:fade={{ duration: 400 }}>
      <h2 class="text-3xl font-bold text-white mb-6">
        Ready to Find Your Perfect Fence Contractor?
      </h2>
      <p class="text-xl text-white/90 mb-8">
        Get started today and connect with top-rated fence professionals in your area.
      </p>
      <a 
        href="#search" 
        class="inline-block px-6 py-3 text-lg font-medium text-primary bg-white rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
      >
        Find Contractors Now
      </a>
    </div>
  </div>
</section>
