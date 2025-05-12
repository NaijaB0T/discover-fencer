<script>
  import { page } from '$app/stores';
  import { fade, scale } from 'svelte/transition';
</script>

<svelte:head>
  <title>{$page.status === 404 ? 'Page Not Found' : 'Error'} | FenceFind</title>
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center bg-white px-4 py-24" in:fade={{ duration: 300 }}>
  <div class="text-center" in:scale={{ start: 0.95, duration: 400, delay: 150 }}>
    {#if $page.status === 404}
      <div class="mb-6 text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </div>
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
    {:else}
      <div class="mb-6 text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 class="text-4xl font-bold text-gray-900 mb-4">An Error Occurred</h1>
      <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Sorry, something went wrong. Please try again later or contact support if the problem persists.
      </p>
    {/if}
    
    <div class="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
      <a 
        href="/" 
        class="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Go to Homepage
      </a>
      <a 
        href="/search" 
        class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Search Contractors
      </a>
    </div>
  </div>
</div>

<!-- Related Links -->
<div class="container mx-auto px-4 py-12 border-t">
  <h2 class="text-2xl font-bold text-center mb-8">You Might Be Looking For</h2>
  
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
    <a href="/" class="block p-6 bg-gray-50 rounded-lg border hover:border-primary hover:shadow-md transition-all">
      <h3 class="text-lg font-medium mb-2">Home</h3>
      <p class="text-gray-600">Return to our homepage to start exploring contractors.</p>
    </a>
    
    <a href="/search" class="block p-6 bg-gray-50 rounded-lg border hover:border-primary hover:shadow-md transition-all">
      <h3 class="text-lg font-medium mb-2">Search</h3>
      <p class="text-gray-600">Find fence contractors in your area with our search tool.</p>
    </a>
    
    <a href="/about" class="block p-6 bg-gray-50 rounded-lg border hover:border-primary hover:shadow-md transition-all">
      <h3 class="text-lg font-medium mb-2">About Us</h3>
      <p class="text-gray-600">Learn more about FenceFind and our mission.</p>
    </a>
    
    <a href="/contact" class="block p-6 bg-gray-50 rounded-lg border hover:border-primary hover:shadow-md transition-all">
      <h3 class="text-lg font-medium mb-2">Contact</h3>
      <p class="text-gray-600">Get in touch with our support team for assistance.</p>
    </a>
  </div>
</div>
