/**
 * Ensures a URL has a protocol prefix so it can be opened in a browser.
 * If no protocol is present, prepends https://.
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
