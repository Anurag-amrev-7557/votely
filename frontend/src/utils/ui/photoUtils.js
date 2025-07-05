// Utility functions for handling profile photos across the application

/**
 * Get a proxied Google photo URL to avoid CORS issues
 * @param {string} googlePhotoUrl - The original Google photo URL
 * @returns {string} - The proxied URL or original URL if not a Google photo
 */
export const getProxiedGooglePhotoUrl = (googlePhotoUrl) => {
  if (!googlePhotoUrl || !googlePhotoUrl.includes('googleusercontent.com')) {
    return googlePhotoUrl;
  }
  
  // Use our proxy endpoint to avoid CORS issues
  return `/api/proxy/google-photo?url=${encodeURIComponent(googlePhotoUrl)}`;
};

/**
 * Get the best available profile photo from user data
 * @param {Object} user - User object
 * @param {string} profilePhoto - Current profile photo state
 * @param {string} profilePhotoPreview - Preview photo state
 * @param {boolean} googlePhotoFailed - Whether Google photos have failed to load
 * @returns {string|null} - The best available photo URL or null
 */
export const getBestProfilePhoto = (user, profilePhoto, profilePhotoPreview, googlePhotoFailed = false) => {
  // Priority order: uploaded photo > Google photo > user's profilePhoto > fallback
  if (profilePhotoPreview) {
    return profilePhotoPreview;
  }
  
  if (profilePhoto && !googlePhotoFailed) {
    return profilePhoto;
  }
  
  // Check for Google photo in user object
  if (user?.profilePhoto && user.profilePhoto.includes('googleusercontent.com') && !googlePhotoFailed) {
    return getProxiedGooglePhotoUrl(user.profilePhoto);
  }
  
  // Check for other photo fields in user object
  if (user?.googlePhoto && !googlePhotoFailed) {
    return getProxiedGooglePhotoUrl(user.googlePhoto);
  }
  
  if (user?.photoURL && !googlePhotoFailed) {
    return getProxiedGooglePhotoUrl(user.photoURL);
  }
  
  if (user?.avatarUrl && !googlePhotoFailed) {
    return getProxiedGooglePhotoUrl(user.avatarUrl);
  }
  
  // Fallback to user's profilePhoto if it's not a Google photo
  if (user?.profilePhoto && !user.profilePhoto.includes('googleusercontent.com')) {
    return user.profilePhoto;
  }
  
  return null;
};

/**
 * Handle photo load errors
 * @param {Event} e - Error event
 * @param {string} photoUrl - The photo URL that failed
 * @param {Function} setGooglePhotoFailed - Function to set Google photo failed state
 */
export const handlePhotoError = (e, photoUrl, setGooglePhotoFailed) => {
  console.log('Image failed to load:', photoUrl);
  
  // For Google photos, mark as failed and show fallback
  if (photoUrl && photoUrl.includes('googleusercontent.com')) {
    console.log('Google photo failed to load, showing fallback');
    setGooglePhotoFailed(true);
    e.target.style.display = 'none';
  } else {
    // For other photos, just hide the image
    e.target.style.display = 'none';
  }
};

/**
 * Handle photo load success
 * @param {Event} e - Load event
 * @param {string} photoUrl - The photo URL that loaded successfully
 * @param {Function} setGooglePhotoFailed - Function to set Google photo failed state
 */
export const handlePhotoLoad = (e, photoUrl, setGooglePhotoFailed) => {
  console.log('Image loaded successfully:', photoUrl);
  if (photoUrl && photoUrl.includes('googleusercontent.com')) {
    setGooglePhotoFailed(false);
  }
};

/**
 * Generate initials from user name for fallback avatar
 * @param {string} name - User's name
 * @returns {string} - Initials (e.g., "JD" for "John Doe")
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Check if a URL is a valid image URL
 * @param {string} url - URL to check
 * @returns {boolean} - Whether the URL is a valid image URL
 */
export const isValidImageUrl = (url) => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const pathname = urlObj.pathname.toLowerCase();
    
    return imageExtensions.some(ext => pathname.endsWith(ext)) || 
           url.includes('googleusercontent.com') ||
           url.includes('gravatar.com');
  } catch {
    return false;
  }
};

/**
 * Get a fallback avatar URL using Gravatar
 * @param {string} email - User's email address
 * @returns {string} - Gravatar URL
 */
export const getGravatarUrl = (email) => {
  if (!email) return null;
  
  const crypto = require('crypto');
  const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
}; 