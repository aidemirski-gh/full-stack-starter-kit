/**
 * API Configuration
 * Automatically detects the correct API URL based on the environment
 */

/**
 * Get the API base URL
 * - In production: uses the NEXT_PUBLIC_API_URL environment variable
 * - In development on mobile: uses the host's IP address
 * - In development on desktop: uses localhost
 */
export function getApiUrl(): string {
  // If running in production or env variable is set
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In browser, check if we're accessing via IP address (mobile device)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // If accessing via IP address (e.g., from mobile device)
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      return `http://${hostname}:8201/api`;
    }
  }

  // Default to localhost for development
  return 'http://localhost:8201/api';
}

/**
 * Get the full API endpoint URL
 */
export function getApiEndpoint(path: string): string {
  const baseUrl = getApiUrl();
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
}
