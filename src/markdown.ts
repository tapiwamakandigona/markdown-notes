/**
 * Enhanced Markdown to HTML converter.
 * Supports: headers, bold, italic, code, code blocks, links, images, lists, blockquotes, horizontal rules.
 *
 * Security: the input is HTML-escaped *first*, so any raw HTML in the markdown
 * source (e.g. `<img src=x onerror=alert(1)>` or `<script>`) is rendered as
 * inert text instead of executing. Only the safe tags this function generates
 * itself survive. Link/image URLs are scheme-validated to block
 * `javascript:` / `data:` / `vbscript:` payloads.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Returns the URL if it uses a safe scheme (http/https/mailto) or is relative,
 * otherwise returns '#'. Input has already been HTML-escaped.
 */
function safeUrl(url: string): string {
  // Remove all control characters (0x00-0x1F and 0x7F) that can be used to
  // smuggle a scheme past the check, e.g. "java\tscript:alert(1)" — browsers
  // strip those chars from href and would then execute the javascript: URL.
  const cleaned = Array.from(url.trim())
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code > 31 && code !== 127;
    })
    .join('');

  const scheme = cleaned.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  if (scheme) {
    // Absolute URL: only allow explicitly safe schemes.
    return /^(?:https?|mailto)$/i.test(scheme[1]) ? cleaned : '#';
  }
  // No scheme => relative URL / fragment / anchor — safe.
  return cleaned;
}

export function markdownToHtml(md: string): string {
  let html = escapeHtml(md)
    // Code blocks (must be before inline code)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
    // Headers
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt: string, src: string) =>
      `<img src="${safeUrl(src)}" alt="${alt}" style="max-width:100%">`)
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text: string, href: string) =>
      `<a href="${safeUrl(href)}" target="_blank" rel="noopener noreferrer">${text}</a>`)
    // Task lists
    .replace(/^- \[x\] (.+)$/gm, '<li class="task done"><input type="checkbox" checked disabled> $1</li>')
    .replace(/^- \[ \] (.+)$/gm, '<li class="task"><input type="checkbox" disabled> $1</li>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  return '<p>' + html + '</p>';
}
