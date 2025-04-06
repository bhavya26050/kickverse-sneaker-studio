
// Collection of fallback images for products
const fallbackImages = [
  "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584735175315-9d5df23be701?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&auto=format&fit=crop"
];

/**
 * Gets a fallback image URL based on product ID or random selection
 */
export const getFallbackImage = (id?: string): string => {
  if (!id) {
    // Return random fallback image
    const randomIndex = Math.floor(Math.random() * fallbackImages.length);
    return fallbackImages[randomIndex];
  }
  
  // Use product ID to consistently get the same fallback image
  const index = Math.abs(hashCode(id) % fallbackImages.length);
  return fallbackImages[index];
};

/**
 * Simple string hash function to generate a number from a string
 */
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/**
 * Checks if an image URL exists and returns it or a fallback
 */
export const getValidImageUrl = async (url: string, fallbackId?: string): Promise<string> => {
  if (!url) return getFallbackImage(fallbackId);
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok ? url : getFallbackImage(fallbackId);
  } catch (error) {
    return getFallbackImage(fallbackId);
  }
};
