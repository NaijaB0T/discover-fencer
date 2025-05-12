<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  
  export let states = [];
  export let categories = [];
  export let minRating = 0;
  export let selectedState = "";
  export let selectedCategory = "";
  export let searchQuery = "";
  
  const dispatch = createEventDispatcher();
  
  function handleSearch() {
    dispatch('search', {
      state: selectedState,
      category: selectedCategory,
      rating: minRating,
      query: searchQuery
    });
  }
  
  function clearFilters() {
    selectedState = "";
    selectedCategory = "";
    minRating = 0;
    searchQuery = "";
    handleSearch();
  }
</script>

<div class="bg-white p-4 rounded-lg shadow-md border" in:fly={{ y: -20, duration: 300 }}>
  <h3 class="font-medium text-lg mb-4">Find Your Perfect Fence Contractor</h3>
  
  <div class="space-y-4">
    <!-- Search Input -->
    <div>
      <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
      <div class="relative">
        <input
          id="search"
          type="text"
          bind:value={searchQuery}
          placeholder="Search by name or keyword..."
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-10 py-2 border"
        />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {#if searchQuery}
          <button
            type="button"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
            on:click={() => { searchQuery = ""; }}
            in:fade={{ duration: 100 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        {/if}
      </div>
    </div>
    
    <!-- Location (State) -->
    <div>
      <label for="state" class="block text-sm font-medium text-gray-700 mb-1">State</label>
      <select
        id="state"
        bind:value={selectedState}
        class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 border"
      >
        <option value="">Any State</option>
        {#each states as state}
          <option value={state}>{state}</option>
        {/each}
      </select>
    </div>
    
    <!-- Service Category -->
    <div>
      <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
      <select
        id="category"
        bind:value={selectedCategory}
        class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary py-2 border"
      >
        <option value="">All Categories</option>
        {#each categories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
    </div>
    
    <!-- Rating -->
    <div>
      <label for="rating" class="block text-sm font-medium text-gray-700 mb-1">
        Minimum Rating: {minRating} {minRating === 1 ? 'star' : 'stars'}
      </label>
      <input
        id="rating"
        type="range"
        min="0"
        max="5"
        step="0.5"
        bind:value={minRating}
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
      />
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>Any</span>
        <span>⭐⭐⭐⭐⭐</span>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex gap-2 pt-2">
      <button
        type="button"
        on:click={handleSearch}
        class="flex-1 bg-primary text-primary-foreground font-medium py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
      >
        Search
      </button>
      
      <button
        type="button"
        on:click={clearFilters}
        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
      >
        Clear
      </button>
    </div>
  </div>
</div>
