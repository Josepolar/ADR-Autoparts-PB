/**
 * Cache control headers for different page types
 */
export const cacheHeaders = {
  // Pages that should never be cached (sensitive/authenticated)
  noCache:
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  
  // Private pages (authenticated, but cacheable in private cache)
  private: "private, no-cache, no-store, must-revalidate, max-age=0",
  
  // Public pages (can be cached longer)
  public: "public, max-age=3600, s-maxage=3600",
  
  // API responses (should not be cached)
  api: "private, no-cache, no-store, must-revalidate",
};

/**
 * Get cache headers for a specific page type
 */
export function getCacheHeaders(pageType: "admin" | "staff" | "user" | "public" | "api") {
  switch (pageType) {
    case "admin":
    case "staff":
    case "user":
      // Protected pages should never be cached
      return cacheHeaders.noCache;
    case "api":
      return cacheHeaders.api;
    case "public":
    default:
      return cacheHeaders.public;
  }
}

/**
 * Apply cache control headers to a fetch response
 */
export function applyNoCacheHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", cacheHeaders.noCache);
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
