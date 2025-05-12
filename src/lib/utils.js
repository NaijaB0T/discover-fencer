/**
 * Combines multiple class names into a single string
 * @param {string[]} inputs - Class names to combine
 * @returns {string} - Combined class names
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Format a phone number into a readable format
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export function formatPhoneNumber(phone) {
  if (!phone) return "";
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");
  
  // Check if the input is of correct length
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
}

/**
 * Format stars rating with appropriate decimal places
 * @param {number} stars - Star rating
 * @returns {string} - Formatted star rating
 */
export function formatStars(stars) {
  if (stars === undefined || stars === null) return "N/A";
  
  // Display with one decimal place if it's not a whole number
  return Number.isInteger(stars) ? stars.toString() : stars.toFixed(1);
}

/**
 * Get appropriate star rating UI elements
 * @param {number} rating - Star rating
 * @returns {object} - Classes for stars UI
 */
export function getStarClasses(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  
  return {
    fullStars,
    hasHalfStar,
  };
}

/**
 * Calculate distance between two coordinates
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in miles
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance.toFixed(1);
}

/**
 * Convert degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} - Radians
 */
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Get a static image path for contractors (no random image generation)
 * @param {string} id - Contractor unique ID (ignored)
 * @returns {string} - Static image path
 */
export function getRandomImage(id) {
  // Return a static default image path instead of a random image
  return '/images/contractors/default-fence.svg';
}
