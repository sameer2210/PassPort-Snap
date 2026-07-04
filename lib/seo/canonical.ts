import { publicEnv } from "../env";

/**
 * Resolves a fully qualified canonical URL based on the relative path.
 * Ensures the output has no trailing slash (unless it is the root URL).
 *
 * @param path Relative path, e.g., '/' or '/sitemap.xml'
 */
export function getCanonicalUrl(path = ""): string {
  const base = publicEnv.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  
  if (normalizedPath === "/") {
    return `${base}/`;
  }
  
  return `${base}${normalizedPath}`;
}
