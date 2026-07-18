/**
 * Resolve book cover paths for display.
 * Local covers are stored as `/covers/{isbn}.jpg` and served by the API
 * (and also by Vite `public/` when available).
 */
export function resolveCoverSrc(coverUrl) {
  if (!coverUrl) return null;

  if (coverUrl.startsWith("http://") || coverUrl.startsWith("https://")) {
    return coverUrl;
  }

  const path = coverUrl.startsWith("/") ? coverUrl : `/${coverUrl}`;

  if (path.startsWith("/covers/")) {
    const apiBase = import.meta.env.VITE_BASE_URL || "";
    const origin = apiBase.replace(/\/api\/?$/, "");
    if (origin) {
      return `${origin}${path}`;
    }
  }

  return path;
}
