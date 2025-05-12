<script>
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  // FAQ items
  let faqs = [
    {
      question: "How does Discover Fencer verify contractors?",
      answer: "All contractors on Discover Fencer go through a verification process that includes checking their business license, insurance coverage, and professional standing. We also collect and display authentic customer reviews to provide additional information about their service quality."
    },
    {
      question: "Is it free to use Discover Fencer?",
      answer: "Yes, Discover Fencer is completely free for homeowners and property managers to use. You can search our directory, view contractor profiles, compare options, and contact professionals at no cost."
    },
    {
      question: "How do I list my fence business on Discover Fencer?",
      answer: "To list your fence contracting business on our directory, simply visit our Contact page and select 'List My Business' as the inquiry type. Our team will reach out to you with the necessary information and guide you through the process."
    },
    {
      question: "Can I read reviews from other customers?",
      answer: "Yes, each contractor profile includes reviews from verified customers who have hired them through Discover Fencer. This allows you to make more informed decisions based on others' experiences."
    },
    {
      question: "How do I contact contractors through Discover Fencer?",
      answer: "Each contractor profile includes direct contact information, including phone numbers and website links. You can reach out to them directly to discuss your project and request quotes."
    },
    {
      question: "What information should I have ready when contacting contractors?",
      answer: "It's helpful to have basic information about your project ready, including the type of fence you want, approximate length/area, any specific materials or design preferences, your timeline, and your budget range. This will help contractors provide more accurate quotes."
    },
    {
      question: "Does Discover Fencer offer any guarantees on contractor work?",
      answer: "While Discover Fencer carefully verifies contractors in our directory, we don't directly guarantee their work. However, many contractors offer their own warranties or guarantees. We recommend discussing this with contractors before hiring and getting any guarantees in writing."
    },
    {
      question: "How can I leave a review for a contractor I hired?",
      answer: "After your project is complete, you can visit the contractor's profile page and click the 'Leave a Review' button. Your feedback helps maintain the quality of our directory and assists other homeowners in making informed decisions."
    },
    {
      question: "What types of fence contractors can I find on Discover Fencer?",
      answer: "Discover Fencer includes contractors who specialize in various types of fencing, including wood, vinyl, chain-link, ornamental, composite, security fencing, privacy fencing, ranch fencing, pool fencing, and more. You can filter by service type to find specialists in your specific needs."
    },
    {
      question: "Can I search for contractors in a specific location?",
      answer: "Yes, you can search for contractors by city, state, or zip code to find professionals serving your area. You can also enable location services to find contractors near your current location."
    },
    {
      question: "How often is contractor information updated?",
      answer: "We regularly update contractor information to ensure accuracy. Contractors can also update their profiles with new services, photos, and contact information. Customer reviews are added continuously as new projects are completed."
    },
    {
      question: "What should I do if I have a dispute with a contractor?",
      answer: "We recommend first attempting to resolve any issues directly with the contractor. If that doesn't work, you can contact our support team through the Contact page, and we'll do our best to help mediate the situation."
    }
  ];
  
  // State to track which FAQ is expanded
  let expandedIndex = null;
  
  function toggleFAQ(index) {
    expandedIndex = expandedIndex === index ? null : index;
  }
</script>

<svelte:head>
  <title>Frequently Asked Questions | Discover Fencer</title>
  <meta name="description" content="Find answers to commonly asked questions about Discover Fencer, our contractor verification process, and how to get the most out of our fence contractor directory." />
</svelte:head>

<div class="bg-white">
  <!-- Hero Section -->
  <section class="bg-primary text-white py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto text-center" in:fade={{ duration: 300 }}>
        <h1 class="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
        <p class="text-lg text-white/90 mb-0">
          Find answers to common questions about using Discover Fencer and working with fence contractors.
        </p>
      </div>
    </div>
  </section>
  
  <!-- FAQ Section -->
  <section class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <div class="space-y-6">
          {#each faqs as faq, index}
            <div class="bg-white rounded-lg border shadow-sm overflow-hidden" in:fly={{ y: 20, duration: 400, delay: index * 50 }}>
              <button 
                class="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                on:click={() => toggleFAQ(index)}
                aria-expanded={expandedIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 class="text-lg font-medium text-gray-900">{faq.question}</h3>
                <svg 
                  class="h-5 w-5 text-gray-500 transform transition-transform duration-200 {expandedIndex === index ? 'rotate-180' : ''}" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  aria-hidden="true"
                >
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              
              {#if expandedIndex === index}
                <div 
                  id={`faq-answer-${index}`}
                  class="px-6 pb-4 text-gray-700"
                  transition:fade={{ duration: 200 }}
                >
                  <p>{faq.answer}</p>
                </div>
              {/if}
            </div>
          {/each}
        </div>
        
        <!-- Still Have Questions -->
        <div class="mt-12 text-center bg-gray-50 rounded-lg border p-8" in:fly={{ y: 20, duration: 400, delay: 600 }}>
          <h2 class="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p class="text-gray-600 mb-6">
            If you didn't find the answer you're looking for, our support team is here to help.
          </p>
          <a 
            href="/contact" 
            class="inline-flex items-center px-5 py-3 rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Contact Us
          </a>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Browse Contractors CTA -->
  <section class="py-16 bg-primary">
    <div class="container mx-auto px-4 text-center">
      <div class="max-w-3xl mx-auto" in:fade={{ duration: 400 }}>
        <h2 class="text-3xl font-bold text-white mb-6">
          Ready to Start Your Fence Project?
        </h2>
        <p class="text-xl text-white/90 mb-8">
          Browse our directory of verified fence contractors to find the perfect professional for your needs.
        </p>
        <a 
          href="/search" 
          class="inline-block px-6 py-3 text-lg font-medium text-primary bg-white rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
        >
          Browse Contractors
        </a>
      </div>
    </div>
  </section>
</div>
