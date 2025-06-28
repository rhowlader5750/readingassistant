console.log("🔍 inject.js is running!");

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

// ✅ IMMEDIATELY RUN PARSER
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

  const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.addedNodes.length > 0) {
      // Optionally, throttle how often you parse to avoid too many updates
      console.log("📈 DOM changed — re-parsing...");
      runParser();
      break; // you can break early if one mutation is enough
    }
  }
});

// Start observing the body for DOM changes
observer.observe(document.body, {
  childList: true,
  subtree: true
});


 if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  setTimeout(runParser, 1500); // wait 1.5 seconds before running
} else {
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(runParser, 1500); // wait after DOM is ready
  });
}

})();


// 🖱️ MOUSEUP LISTENER FOR SUMMARIZE BUBBLE
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  const text = selection.toString().trim();

  const old = document.getElementById('reading-helper-bubble');
  if (old) old.remove();

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

    bubble.addEventListener('click', () => {
      if (!document.getElementById('react-sidebar-root')) {
        const root = document.createElement('div');
        root.id = 'react-sidebar-root';
        document.body.appendChild(root);

        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('dist/sidebar.js');
        script.type = 'module';
        document.body.appendChild(script);
      }

      bubble.remove();
    });
  }
});
