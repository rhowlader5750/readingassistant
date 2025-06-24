
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

document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  const text = selection.toString().trim();

  // Remove old bubble
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
      // Load React app when clicked
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