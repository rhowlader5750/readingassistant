console.log("🔍 inject.js is running!");

// Inject styles (only once)
if (!document.getElementById('reading-helper-style')) {
  const style = document.createElement('style');
  style.id = 'reading-helper-style';
  style.innerHTML = `
    .reading-helper-bubble {
      position: absolute;
      background-color: #222;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      cursor: pointer;
      z-index: 9999999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: opacity 0.2s;
    }
  `;
  document.head.appendChild(style);
}

// 🔄 Structured parsing on load + DOM changes
(function parseImmediatelyOrOnLoad() {
  const runParser = () => {
    console.log("🟢 DOM ready — parsing structured content");

    const structuredSections = [];
    let currentSection = null;

    document.querySelectorAll("h1, h2, h3, h4, h5, h6, p").forEach((el) => {
      const tag = el.tagName.toLowerCase();
      const text = el.innerText.trim();

      if (!text) return;

      if (tag.startsWith("h")) {
        currentSection = {
          heading: text,
          tag,
          content: []
        };
        structuredSections.push(currentSection);
      } else if (tag === "p" && currentSection) {
        currentSection.content.push(text);
      }
    });

    console.log("📚 Structured page content:", structuredSections);
    window.__READING_HELPER_CONTENT__ = structuredSections;
  };

  // Observe dynamic DOM changes (e.g., lazy loading)
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        console.log("📈 DOM changed — re-parsing...");
        runParser();
        break;
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial run
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(runParser, 1500);
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      setTimeout(runParser, 1500);
    });
  }
})();

// 🖱️ Add bubble on text selection
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  const text = selection.toString().trim();

  // Clean old bubble
  const existingBubble = document.getElementById('reading-helper-bubble');
  if (existingBubble) {
    console.log("🧼 Removing old bubble");
    existingBubble.remove();
  }

  if (text.length > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const bubble = document.createElement('div');
    bubble.id = 'reading-helper-bubble';
    bubble.className = 'reading-helper-bubble';
    bubble.innerText = 'Summarize';

    bubble.style.top = `${rect.top + window.scrollY - 40}px`;
    bubble.style.left = `${rect.left + window.scrollX}px`;

    document.body.appendChild(bubble);

    console.log("💬 Bubble created and added to page!");

    // Use mousedown instead of click to avoid timing conflicts
    bubble.addEventListener('mousedown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      console.log("🟡 Bubble clicked!");

      // Prevent duplicate sidebar
      if (!document.getElementById('react-sidebar-root')) {
  const root = document.createElement('div');
  root.id = 'react-sidebar-root';
  root.style.position = 'fixed';
  root.style.top = '0';
  root.style.right = '0';
  root.style.width = '360px';
  root.style.height = '100vh';
  root.style.zIndex = '999999999';
  root.style.backgroundColor = '#fff'; // make sure it's visible
  document.body.appendChild(root);

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('dist/sidebar.js');
  script.type = 'module';
  script.onload = () => console.log("✅ sidebar.js loaded and executed!");
  script.onerror = () => console.error("❌ Failed to load sidebar.js");
  document.body.appendChild(script);



        console.log("📦 Sidebar injected!");
      } else {
        console.log("⚠️ Sidebar already exists.");
      }

      bubble.remove();
    });
  }
});
