/**
 * Highlight search matches in text.
 * Returns HTML string with <mark> tags around matches.
 */
export function highlightText(text: string, query: string): string {
  if (!query || !text) return text;
  
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  
  return text.replace(regex, "<mark>$1</mark>");
}

/**
 * Count occurrences of a search query in text.
 */
export function countMatches(text: string, query: string): number {
  if (!query || !text) return 0;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = text.match(new RegExp(escaped, "gi"));
  return matches ? matches.length : 0;
}

/**
 * Extract a snippet around the first match.
 */
export function extractSnippet(text: string, query: string, contextChars: number = 50): string {
  if (!query || !text) return text.substring(0, contextChars * 2);
  
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text.substring(0, contextChars * 2);
  
  const start = Math.max(0, index - contextChars);
  const end = Math.min(text.length, index + query.length + contextChars);
  
  let snippet = text.substring(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";
  
  return snippet;
}
