/**
 * Enhanced Markdown to HTML converter.
 * Supports: headers, bold, italic, code, code blocks, links, images, lists, blockquotes, horizontal rules.
 */
export function markdownToHtml(md: string): string {
  let html = md
    // Code blocks (must be before inline code)
    .replace(/```(\w*)
([\s\S]*?)```/g, "<pre><code class="lang-"></code></pre>")
    // Headers
    .replace(/^#### (.+)$/gm, "<h4></h4>")
    .replace(/^### (.+)$/gm, "<h3></h3>")
    .replace(/^## (.+)$/gm, "<h2></h2>")
    .replace(/^# (.+)$/gm, "<h1></h1>")
    // Horizontal rule
    .replace(/^---$/gm, "<hr>")
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em></em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong></strong>")
    .replace(/\*(.+?)\*/g, "<em></em>")
    // Strikethrough
    .replace(/~~(.+?)~~/g, "<del></del>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code></code>")
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "<img src="" alt="" style="max-width:100%">")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href="" target="_blank" rel="noopener"></a>")
    // Task lists
    .replace(/^- \[x\] (.+)$/gm, "<li class="task done"><input type="checkbox" checked disabled> </li>")
    .replace(/^- \[ \] (.+)$/gm, "<li class="task"><input type="checkbox" disabled> </li>")
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li></li>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li></li>")
    // Blockquotes
    .replace(/^> (.+)$/gm, "<blockquote></blockquote>")
    // Line breaks
    .replace(/

/g, "</p><p>")
    .replace(/
/g, "<br>");
  
  return "<p>" + html + "</p>";
}
