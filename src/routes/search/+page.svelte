<script>
  import { onMount } from 'svelte';
  import ContractorCard from '$lib/components/ContractorCard.svelte';
  import SearchFilters from '$lib/components/SearchFilters.svelte';
  import { fade, fly } from 'svelte/transition';
  
  // State for contractors data
  let contractors = [];
  let filteredContractors = [];
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
  const pageSize = 12;
  let totalPages = 1;
  let paginatedContractors = [];
  
  // Load data on component mount
  onMount(async () => {
    try {
      const response = await fetch('/data/sample-fence-contractors.json');
      if (!response.ok) {
        throw new Error('Failed to load contractors data');
      }
      
      contractors = await response.json();
      
      // Extract unique states and categories
      states = [...new Set(contractors.map(c => c.state))].sort();
      categories = [...new Set(contractors.map(c => c.category))].sort();
      
      // Initialize filtered contractors
      filteredContractors = [...contractors];
      updatePagination();
      
      isLoading = false;
    } catch (err) {
      console.error('Error loading contractors:', err);
      error = err.message;
      isLoading = false;
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
    
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Update pagination when filtered contractors change
  $: if (filteredContractors) {
    updatePagination();
  }
</script>

<svelte:head>
  <title>Search Fence Contractors | FenceFind</title>
  <meta name="description" content="Search for the best fence contractors in your area. Filter by location, service type, and ratings to find the perfect fence professional for your project." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-primary text-white py-16">
  <div class="container mx-auto px-4">
    <div class="max-w-3xl mx-auto text-center" in:fade={{ duration: 300 }}>
      <h1 class="text-3xl font-bold mb-4">Find Your Perfect Fence Contractor</h1>
      <p class="text-lg text-white/90 mb-0">
        Search our directory of trusted fence professionals to find the right fit for your project.
      </p>
    </div>
  </div>
</section>

<!-- Search Section -->
<section class="py-12 bg-white">
  <div class="container mx-auto px-4">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Search Filters -->
        <div class="lg:col-span-1">
          <div class="sticky top-24">
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
        </div>
        
        <!-- Results -->
        <div class="lg:col-span-3">
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
          {:else if error}
            <div class="bg-white p-8 rounded-lg border shadow-md text-center" in:fade>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Error loading contractors</h3>
              <p class="text-gray-600 mb-4">{error}</p>
              <button 
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                on:click={() => window.location.reload()}
              >
                Try Again
              </button>
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
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
