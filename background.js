chrome.tabs.onCreated.addListener(function(tab) {
    console.log('New tab created:', tab);
  });
  
  chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    console.log('Tab closed:', tabId);
  });
  