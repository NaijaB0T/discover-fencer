<script>
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  
  export let latitude;
  export let longitude;
  export let address = '';
  export let name = '';
  export let height = '300px';
  
  let mapElement;
  let map;
  let marker;
  let leafletLoaded = false;
  let L; // Store Leaflet library reference
  
  // Track if coordinates have changed
  let previousLat = latitude;
  let previousLng = longitude;
  
  onMount(async () => {
    // Only load Leaflet on the client side
    if (typeof window !== 'undefined') {
      // Load Leaflet CSS
      const leafletCss = document.createElement('link');
      leafletCss.rel = 'stylesheet';
      leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      leafletCss.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      leafletCss.crossOrigin = '';
      document.head.appendChild(leafletCss);
      
      // Give some time for CSS to load before initializing the map
      setTimeout(async () => {
        try {
          // Dynamic import of Leaflet
          L = await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js');
          leafletLoaded = true;
          
          // Initialize map
          initializeMap();
        } catch (error) {
          console.error('Error loading Leaflet:', error);
          // Show fallback message if Leaflet fails to load
          leafletLoaded = false;
        }
      }, 300);
    }
  });
  
  // Separate initialize function that can be called when coords change
  function initializeMap() {
    if (!mapElement || !latitude || !longitude || !L || !leafletLoaded) return;
    
    // If map already exists, remove it first
    if (map) {
      map.remove();
      map = null;
    }
    
    // Create map
    map = L.map(mapElement).setView([latitude, longitude], 15);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add marker
    marker = L.marker([latitude, longitude]).addTo(map);
    
    // Add popup with name and address if available
    if (name || address) {
      const popupContent = `
        <div>
          ${name ? `<strong>${name}</strong>` : ''}
          ${name && address ? '<br>' : ''}
          ${address ? address : ''}
        </div>
      `;
      marker.bindPopup(popupContent).openPopup();
    }
    
    // Update previous coordinates
    previousLat = latitude;
    previousLng = longitude;
  }
  
  // Check if coordinates have changed after each update
  afterUpdate(() => {
    if (leafletLoaded && L && (previousLat !== latitude || previousLng !== longitude)) {
      // Coordinates have changed, reinitialize map
      initializeMap();
    }
  });
  
  onDestroy(() => {
    // Clean up map on component destruction
    if (map) {
      map.remove();
    }
  });
</script>

<div bind:this={mapElement} style="height: {height}; width: 100%;" class="leaflet-map">
  {#if !leafletLoaded}
    <div class="fallback-container">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
      <p class="fallback-text">Map loading...</p>
    </div>
  {/if}
</div>

<style>
  .leaflet-map {
    background-color: #f3f4f6;
    position: relative;
    border-radius: 0.25rem;
    overflow: hidden;
  }
  
  .fallback-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    inset: 0;
    padding: 1rem;
    text-align: center;
  }
  
  .icon {
    height: 3rem;
    width: 3rem;
    color: #9ca3af;
    margin-bottom: 0.5rem;
  }
  
  .fallback-text {
    font-size: 0.875rem;
    color: #6b7280;
  }
</style>
