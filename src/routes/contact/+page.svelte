<script>
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  let formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    type: 'general'
  };
  
  let isSubmitting = false;
  let isSubmitted = false;
  let error = null;
  
  function handleSubmit() {
    isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      isSubmitting = false;
      isSubmitted = true;
      
      // Reset form
      formData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        type: 'general'
      };
    }, 1500);
  }
</script>

<svelte:head>
  <title>Contact Discover Fencer | Get in Touch with Our Team</title>
  <meta name="description" content="Have a question or feedback about Discover Fencer? Contact our team for assistance with finding fence contractors, listing your business, or any other inquiries." />
</svelte:head>

<div class="bg-white">
  <!-- Hero Section -->
  <section class="bg-primary text-white py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto text-center" in:fade={{ duration: 300 }}>
        <h1 class="text-3xl font-bold mb-4">Contact Us</h1>
        <p class="text-lg text-white/90 mb-0">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>
    </div>
  </section>
  
  <!-- Contact Form Section -->
  <section class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-5xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Contact Info -->
          <div class="lg:col-span-1" in:fly={{ x: -20, duration: 400 }}>
            <h2 class="text-2xl font-bold mb-6">Get in Touch</h2>
            
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="bg-primary/10 text-primary p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-medium mb-1">Phone</h3>
                  <p class="text-gray-600">(555) 123-4567</p>
                  <p class="text-gray-500 text-sm mt-1">Monday-Friday, 9am-5pm EST</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-primary/10 text-primary p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-medium mb-1">Email</h3>
                  <p class="text-gray-600">info@discoverfencer.com</p>
                  <p class="text-gray-500 text-sm mt-1">We'll respond as soon as possible</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="bg-primary/10 text-primary p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-medium mb-1">Address</h3>
                  <p class="text-gray-600">123 Fence Way</p>
                  <p class="text-gray-600">Suite 456</p>
                  <p class="text-gray-600">Austin, TX 78701</p>
                </div>
              </div>
            </div>
            
            <div class="mt-10">
              <h3 class="text-lg font-medium mb-4">Connect With Us</h3>
              <div class="flex space-x-4">
                <a href="#" class="bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" class="bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" class="bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
                <a href="#" class="bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <!-- Form -->
          <div class="lg:col-span-2 bg-white rounded-lg border shadow-sm p-8" in:fly={{ x: 20, duration: 400 }}>
            {#if isSubmitted}
              <div class="bg-green-50 text-green-800 p-6 rounded-lg border border-green-200 text-center" in:fade>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-xl font-medium mb-2">Message Sent Successfully!</h3>
                <p class="mb-4">Thank you for contacting us. We will get back to you as soon as possible.</p>
                <button 
                  type="button" 
                  class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  on:click={() => isSubmitted = false}
                >
                  Send Another Message
                </button>
              </div>
            {:else}
              <h2 class="text-2xl font-bold mb-6">Send Us a Message</h2>
              
              <form on:submit|preventDefault={handleSubmit} class="space-y-6">
                <!-- Message Type -->
                <div>
                  <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
                    What can we help you with?
                  </label>
                  <select 
                    id="type"
                    bind:value={formData.type}
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Customer Support</option>
                    <option value="business">List My Business</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <!-- Name Fields -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input 
                      type="text"
                      id="firstName"
                      bind:value={formData.firstName}
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input 
                      type="text"
                      id="lastName"
                      bind:value={formData.lastName}
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                
                <!-- Contact Fields -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input 
                      type="email"
                      id="email"
                      bind:value={formData.email}
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span class="text-gray-500">(Optional)</span>
                    </label>
                    <input 
                      type="tel"
                      id="phone"
                      bind:value={formData.phone}
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
                
                <!-- Message -->
                <div>
                  <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea 
                    id="message"
                    bind:value={formData.message}
                    rows="5"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  ></textarea>
                </div>
                
                <!-- Submit Button -->
                <div>
                  <button 
                    type="submit"
                    class="w-full bg-primary text-white font-medium py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                    disabled={isSubmitting}
                  >
                    {#if isSubmitting}
                      <div class="flex items-center justify-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    {:else}
                      Send Message
                    {/if}
                  </button>
                </div>
              </form>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- FAQ Section -->
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12" in:fly={{ y: 20, duration: 400 }}>
          Frequently Asked Questions
        </h2>
        
        <div class="space-y-6">
          <div class="bg-white rounded-lg border shadow-sm p-6" in:fly={{ y: 20, duration: 400, delay: 100 }}>
            <h3 class="text-xl font-medium mb-2">How do I list my fence business on Discover Fencer?</h3>
            <p class="text-gray-600">
              To list your fence contracting business on our directory, simply contact us through the form above and select "List My Business" as the inquiry type. Our team will reach out to you with the necessary information and guide you through the process.
            </p>
          </div>
          
          <div class="bg-white rounded-lg border shadow-sm p-6" in:fly={{ y: 20, duration: 400, delay: 200 }}>
            <h3 class="text-xl font-medium mb-2">Is it free to use Discover Fencer as a homeowner?</h3>
            <p class="text-gray-600">
              Yes, Discover Fencer is completely free for homeowners and property managers to use. You can search our directory, view contractor profiles, and contact professionals at no cost.
            </p>
          </div>
          
          <div class="bg-white rounded-lg border shadow-sm p-6" in:fly={{ y: 20, duration: 400, delay: 300 }}>
            <h3 class="text-xl font-medium mb-2">How are contractors verified on Discover Fencer?</h3>
            <p class="text-gray-600">
              All contractors listed on Discover Fencer go through a verification process that checks their business license, insurance coverage, and professional history. We also collect and display customer reviews to help you make informed decisions.
            </p>
          </div>
          
          <div class="bg-white rounded-lg border shadow-sm p-6" in:fly={{ y: 20, duration: 400, delay: 400 }}>
            <h3 class="text-xl font-medium mb-2">Can I leave a review for a contractor I hired?</h3>
            <p class="text-gray-600">
              Yes, we encourage customers to share their experiences by leaving reviews for contractors they've hired through Discover Fencer. This helps maintain the quality of our directory and assists other homeowners in making informed decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
