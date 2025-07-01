console.log("🔍 inject.ts is running!");

function getVisibleText(element: Node | null): string {
  if (!element) return "";

  // Skip SCRIPT, STYLE, NOSCRIPT elements
  if (
    element.nodeType === Node.ELEMENT_NODE &&
    (element as Element).tagName.match(/^(SCRIPT|STYLE|NOSCRIPT)$/i)
  ) {
    return "";
  }

  // If text node, return trimmed text
  if (element.nodeType === Node.TEXT_NODE) {
    return element.textContent?.trim() ?? "";
  }

  // Otherwise, recurse through child nodes
  let text = "";
  element.childNodes.forEach(child => {
    text += getVisibleText(child) + " ";
  });

  return text;
}

function extractPageText(): void {
  const body = document.body;
  const allText = getVisibleText(body)
    .replace(/\s+/g, " ")
    .trim();

  console.log("📄 Extracted page text:", allText);

  // Save on window for extension to access
  (window as any).__PAGE_TEXT__ = allText;
  console.log("📄 Extracted page text:", allText);

}

// Run when DOM ready
if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(extractPageText, 500);
} else {
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(extractPageText, 500);
  });
}


