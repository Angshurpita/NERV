/**
 * Gets the base URL for the application.
 * This works in both client-side and server-side environments.
 */
export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.URL ?? // Netlify main site URL
    process?.env?.DEPLOY_PRIME_URL ?? // Netlify unique deploy URL
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set on Vercel.
    process?.env?.NEXT_PUBLIC_BASE_URL ?? // Custom base URL.
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  
  // Remove trailing slash if it exists
  url = url.replace(/\/$/, '');
  
  return url;
};
