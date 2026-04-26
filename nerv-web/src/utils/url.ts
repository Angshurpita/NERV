/**
 * Gets the base URL for the application.
 * This works in both client-side and server-side environments.
 */
export const getURL = () => {
  // 1. If in browser, use window.location.origin (most reliable)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // 2. In server environments (like SSR or API routes)
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set on Vercel.
    process?.env?.URL ?? // Netlify main site URL
    'http://localhost:3000';

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  
  // Remove trailing slash if it exists
  url = url.replace(/\/$/, '');
  
  return url;
};
