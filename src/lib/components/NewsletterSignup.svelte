<script>
  import { fade, fly } from 'svelte/transition';
  
  let email = '';
  let isSubmitting = false;
  let isSubmitted = false;
  let error = null;
  
  function handleSubmit() {
    if (!email || !email.includes('@')) {
      error = 'Please enter a valid email address';
      return;
    }
    
    error = null;
    isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      isSubmitting = false;
      isSubmitted = true;
      email = '';
    }, 1500);
  }
  
  export let bgColor = 'bg-gray-50';
  export let textColor = 'text-gray-900';
  export let buttonColor = 'bg-primary';
  export let buttonTextColor = 'text-white';
</script>

<div class="{bgColor} border rounded-lg p-8" in:fly={{ y: 20, duration: 400 }}>
  <div class="max-w-md mx-auto text-center">
    <h3 class="text-xl font-bold {textColor} mb-3">Subscribe to Our Newsletter</h3>
    <p class="text-gray-600 mb-6">
      Get the latest fence industry updates, tips for maintaining your fence, and special offers from top contractors.
    </p>
    
    {#if isSubmitted}
      <div class="bg-green-50 text-green-800 p-4 rounded-md border border-green-200 mb-4" in:fade>
        <p class="font-medium">Thanks for subscribing!</p>
        <p class="text-sm mt-1">You'll start receiving our newsletter soon.</p>
      </div>
      <button 
        class="text-primary hover:underline text-sm"
        on:click={() => isSubmitted = false}
      >
        Subscribe another email
      </button>
    {:else}
      <form on:submit|preventDefault={handleSubmit} class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <div class="flex-1">
          <label for="email" class="sr-only">Email address</label>
          <input 
            id="email"
            type="email"
            bind:value={email}
            placeholder="Your email address"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary px-4 py-2"
            required
          />
        </div>
        <button 
          type="submit"
          class="{buttonColor} {buttonTextColor} font-medium rounded-md px-4 py-2 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
          disabled={isSubmitting}
        >
          {#if isSubmitting}
            <div class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 {buttonTextColor}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </div>
          {:else}
            Subscribe
          {/if}
        </button>
      </form>
      
      {#if error}
        <div class="text-red-600 text-sm mt-2" in:fade>
          {error}
        </div>
      {/if}
      
      <p class="text-xs text-gray-500 mt-4">
        By subscribing, you agree to our <a href="/privacy" class="underline hover:text-gray-700">Privacy Policy</a>. We'll never share your email.
      </p>
    {/if}
  </div>
</div>
