chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) {
    console.error('No tab id available');
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['inject.js']
  });
});
