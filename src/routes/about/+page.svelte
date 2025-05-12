<script>
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
</script>

<svelte:head>
  <title>About Discover Fencer | Your Trusted Fence Contractor Directory</title>
  <meta name="description" content="Learn about Discover Fencer, your trusted source for finding qualified fence contractors. Our mission is to connect homeowners with the best fence professionals in their area." />
</svelte:head>

<div class="bg-white">
  <!-- Hero Section -->
  <section class="bg-primary text-white py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto text-center" in:fade={{ duration: 300 }}>
        <h1 class="text-3xl font-bold mb-4">About Discover Fencer</h1>
        <p class="text-lg text-white/90 mb-0">
          Your trusted source for finding qualified fence contractors in your area.
        </p>
      </div>
    </div>
  </section>
  
  <!-- About Content -->
  <section class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <div class="prose prose-lg mx-auto" in:fly={{ y: 20, duration: 400 }}>
          <h2>Our Mission</h2>
          <p>
            At Discover Fencer, our mission is to connect homeowners and property managers with the most qualified fence contractors in their area. We understand that finding reliable professionals for your fencing project can be challenging, which is why we've created a comprehensive directory of vetted fence contractors.
          </p>
          
          <h2>Why Choose Discover Fencer?</h2>
          <div class="grid md:grid-cols-2 gap-8 my-8">
            <div class="bg-gray-50 p-6 rounded-lg border" in:fly={{ y: 20, duration: 400, delay: 100 }}>
              <div class="flex items-center mb-4">
                <div class="bg-primary/10 text-primary p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 class="text-xl font-medium m-0">Verified Contractors</h3>
              </div>
              <p class="m-0">
                All contractors in our directory are verified businesses with proper licensing and insurance to protect your property and investment.
              </p>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-lg border" in:fly={{ y: 20, duration: 400, delay: 200 }}>
              <div class="flex items-center mb-4">
                <div class="bg-primary/10 text-primary p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 class="text-xl font-medium m-0">Real Customer Reviews</h3>
              </div>
              <p class="m-0">
                Our platform features authentic reviews from real customers who have worked with these contractors, helping you make informed decisions.
              </p>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-lg border" in:fly={{ y: 20, duration: 400, delay: 300 }}>
              <div class="flex items-center mb-4">
                <div class="bg-primary/10 text-primary p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 class="text-xl font-medium m-0">Easy Comparison</h3>
              </div>
              <p class="m-0">
                Compare contractors side-by-side based on ratings, services offered, and customer feedback to find the perfect match for your project.
              </p>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-lg border" in:fly={{ y: 20, duration: 400, delay: 400 }}>
              <div class="flex items-center mb-4">
                <div class="bg-primary/10 text-primary p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-xl font-medium m-0">Time-Saving</h3>
              </div>
              <p class="m-0">
                Save hours of research by using our comprehensive directory that puts all the information you need at your fingertips.
              </p>
            </div>
          </div>
          
          <h2>How It Works</h2>
          <p>
            Using Discover Fencer is simple and straightforward:
          </p>
          
          <ol>
            <li><strong>Search</strong> - Enter your location and filter by fence type, service, or other criteria.</li>
            <li><strong>Compare</strong> - Review contractor profiles, ratings, and customer testimonials.</li>
            <li><strong>Contact</strong> - Reach out directly to the contractors that best meet your needs.</li>
            <li><strong>Hire</strong> - Select the perfect contractor for your fencing project with confidence.</li>
          </ol>
          
          <h2>Our Commitment to Quality</h2>
          <p>
            We are committed to maintaining the highest standards for contractors listed in our directory. Our team regularly reviews contractor information, monitors customer feedback, and ensures that all listings provide accurate and helpful information.
          </p>
          
          <p>
            Whether you're looking for a new fence installation, repairs to an existing fence, or custom fencing solutions, Discover Fencer is your trusted resource for connecting with qualified professionals who can deliver exceptional results.
          </p>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Team Section -->
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12" in:fly={{ y: 20, duration: 400 }}>
          Our Team
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center" in:fly={{ y: 20, duration: 400, delay: 100 }}>
            <div class="bg-gray-200 h-48 w-48 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold">Sarah Johnson</h3>
            <p class="text-gray-600">Founder & CEO</p>
            <p class="text-gray-600 mt-2">
              With over 15 years in the fencing industry, Sarah founded Discover Fencer to help homeowners find quality contractors.
            </p>
          </div>
          
          <div class="text-center" in:fly={{ y: 20, duration: 400, delay: 200 }}>
            <div class="bg-gray-200 h-48 w-48 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold">Michael Torres</h3>
            <p class="text-gray-600">Chief Technology Officer</p>
            <p class="text-gray-600 mt-2">
              Michael leads our technology team, ensuring that our platform is user-friendly, secure, and efficient.
            </p>
          </div>
          
          <div class="text-center" in:fly={{ y: 20, duration: 400, delay: 300 }}>
            <div class="bg-gray-200 h-48 w-48 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold">Amanda Chen</h3>
            <p class="text-gray-600">Director of Contractor Relations</p>
            <p class="text-gray-600 mt-2">
              Amanda works directly with contractors to ensure our directory features the most qualified professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- CTA Section -->
  <section class="py-16 bg-primary">
    <div class="container mx-auto px-4 text-center">
      <div class="max-w-3xl mx-auto" in:fade={{ duration: 400 }}>
        <h2 class="text-3xl font-bold text-white mb-6">
          Ready to Find Your Perfect Fence Contractor?
        </h2>
        <p class="text-xl text-white/90 mb-8">
          Start your search today and connect with top-rated fence professionals in your area.
        </p>
        <a 
          href="/search" 
          class="inline-block px-6 py-3 text-lg font-medium text-primary bg-white rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
        >
          Find Contractors Now
        </a>
      </div>
    </div>
  </section>
</div>
