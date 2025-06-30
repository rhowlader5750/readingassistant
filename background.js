// Background script for the extension
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['inject.js']
  });
});

console.log("Background script loaded!");