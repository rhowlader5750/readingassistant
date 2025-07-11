// inject.ts

function getVisibleText(root: Element): string {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;

        // Filter out whitespace-only text nodes
        if (/^\s*$/.test(node.textContent || '')) {
          return NodeFilter.FILTER_REJECT;
        }

    
        let currentElement: HTMLElement | null = parent;
        while (currentElement) {
          const tagName = currentElement.tagName?.toLowerCase();
          
          
          if (['style', 'script', 'noscript', 'svg', 'canvas'].includes(tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          
          
          const classList = currentElement.className || '';
          const skipPatterns = [
            'nav', 'menu', 'header', 'footer', 'sidebar', 'aside',
            'advertisement', 'ad', 'social', 'share', 'comment',
            'breadcrumb', 'pagination', 'related', 'recommended',
            'widget', 'popup', 'modal', 'tooltip', 'dropdown'
          ];
          
          if (skipPatterns.some(pattern => classList.toLowerCase().includes(pattern))) {
            return NodeFilter.FILTER_REJECT;
          }
          
          currentElement = currentElement.parentElement;
        }

        
        const textContent = node.textContent || '';
        const cssPattern = /^[\s\S]*{[\s\S]*:[^}]*}[\s\S]*$/;
        if (cssPattern.test(textContent.trim()) && textContent.length > 50) {
          return NodeFilter.FILTER_REJECT;
        }

        
        const computedStyle = window.getComputedStyle(parent);
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let text = '';
  let node: Node | null;
  while ((node = walker.nextNode())) {
    text += node.textContent + ' ';
  }
  
  return text.trim();
}

function getCleanContent(): string {
  const hostname = window.location.hostname;
  console.log("🔍 Processing:", hostname);
  
  // Site-specific optimizations
  if (hostname.includes('wikipedia.org')) {
    return getWikipediaContent();
  } else if (hostname.includes('reddit.com')) {
    return getRedditContent();
  } else if (hostname.includes('medium.com')) {
    return getMediumContent();
  } else if (hostname.includes('github.com')) {
    return getGithubContent();
  } else {
    return getGenericContent();
  }
}

function getWikipediaContent(): string {
  const articleContent = document.querySelector('#mw-content-text .mw-parser-output');
  if (!articleContent) return getGenericContent();
  
  const clone = articleContent.cloneNode(true) as Element;
  
  // Remove Wikipedia-specific elements
  const elementsToRemove = [
    'style', 'script', 'noscript',
    '.toc', '.navbox', '.infobox', '.ambox', '.mbox',
    '.references', '.reflist', '.mw-editsection',
    '.catlinks', '.printfooter', '.navbox-group',
    '.navbox-list', '.mw-jump-link', '.hatnote'
  ];
  
  elementsToRemove.forEach(selector => {
    clone.querySelectorAll(selector).forEach(el => el.remove());
  });
  
  return getVisibleText(clone);
}

function getRedditContent(): string {
  
  const postContent = document.querySelector('[data-testid="post-content"]') ||
                     document.querySelector('.Post') ||
                     document.querySelector('[data-click-id="text"]');
  
  if (postContent) {
    return getVisibleText(postContent);
  }
  
  return getGenericContent();
}

function getMediumContent(): string {
  // Medium article content
  const articleContent = document.querySelector('article') ||
                        document.querySelector('[data-testid="storyContent"]') ||
                        document.querySelector('.postArticle-content');
  
  if (articleContent) {
    return getVisibleText(articleContent);
  }
  
  return getGenericContent();
}

function getGithubContent(): string {
  
  const readmeContent = document.querySelector('#readme') ||
                       document.querySelector('.markdown-body') ||
                       document.querySelector('[data-testid="readme"]');
  
  if (readmeContent) {
    return getVisibleText(readmeContent);
  }
  
  return getGenericContent();
}

function getGenericContent(): string {
  // Try multiple content selection strategies
  const strategies = [
    // Strategy 1: Semantic HTML5 elements
    () => {
      const main = document.querySelector('main');
      if (main) return getVisibleText(main);
      
      const article = document.querySelector('article');
      if (article) return getVisibleText(article);
      
      return null;
    },
    
    // Strategy 2: Common content IDs/classes
    () => {
      const selectors = [
        '#content', '#main-content', '#primary-content',
        '.content', '.main-content', '.primary-content',
        '.post-content', '.entry-content', '.article-content',
        '.page-content', '.body-content', '.text-content'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          const text = getVisibleText(element);
          if (text.length > 100) return text; // Only use if substantial content
        }
      }
      return null;
    },
    
    // Strategy 3: Largest text container
    () => {
      const candidates = document.querySelectorAll('div, section, article, main');
      let bestCandidate = null;
      let maxTextLength = 0;
      
      candidates.forEach(candidate => {
        const text = getVisibleText(candidate);
        if (text.length > maxTextLength && text.length > 200) {
          maxTextLength = text.length;
          bestCandidate = candidate;
        }
      });
      
      return bestCandidate ? getVisibleText(bestCandidate) : null;
    },
    
    // Strategy 4: Body fallback with cleanup
    () => {
      const body = document.body.cloneNode(true) as Element;
      
      // Remove common non-content elements
      const elementsToRemove = [
        'nav', 'header', 'footer', 'aside', 'menu',
        '.navigation', '.nav', '.menu', '.header', '.footer',
        '.sidebar', '.widget', '.ad', '.advertisement',
        '.social-share', '.comments', '.related-posts',
        '.popup', '.modal', '.overlay', '.banner'
      ];
      
      elementsToRemove.forEach(selector => {
        body.querySelectorAll(selector).forEach(el => el.remove());
      });
      
      return getVisibleText(body);
    }
  ];
  
  
  for (const strategy of strategies) {
    const result = strategy();
    if (result && result.length > 100) {
      console.log("🔍 Used strategy, text length:", result.length);
      return result;
    }
  }
  
  return "No substantial content found";
}

(function extractCleanPageText() {
  const allText = getCleanContent().replace(/\s+/g, ' ').trim();
  
  console.log("📄 Cleaned page text length:", allText.length);
  console.log("📄 First 200 chars:", allText);
  
  // Store globally for access later (e.g., popup)
  (window as any).__PAGE_TEXT__ = allText;
})();

chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
  if (req.type === 'GET_PAGE_TEXT') {
    const text = (window as any).__PAGE_TEXT__;
    sendResponse({ text });
  }
});
