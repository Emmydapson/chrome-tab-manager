// Function to group tabs by domain (existing code)
function groupTabsByDomain(tabs) {
    const groups = {};
  
    tabs.forEach(tab => {
      const url = new URL(tab.url);
      const domain = url.hostname;
  
      if (!groups[domain]) {
        groups[domain] = [];
      }
  
      groups[domain].push(tab);
    });
  
    return groups;
  }
  
  // Function to capture a thumbnail for the active tab
  function captureActiveTabThumbnail(callback) {
    chrome.tabs.captureVisibleTab(null, {format: 'jpeg', quality: 50}, function(dataUrl) {
      callback(dataUrl);
    });
  }
  
  // Function to add a preview of the tab
  function addTabPreview(tab) {
    const tabElement = document.createElement('div');
    const tabTitle = document.createElement('p');
    tabTitle.textContent = tab.title;
    tabElement.appendChild(tabTitle);
  
    const thumbnail = document.createElement('img');
    thumbnail.style.width = '100px';
    thumbnail.style.height = '75px';
    tabElement.appendChild(thumbnail);
  
    // If the tab is active, capture its thumbnail
    if (tab.active) {
      captureActiveTabThumbnail(function(dataUrl) {
        thumbnail.src = dataUrl;
      });
    } else {
      // Use a placeholder for inactive tabs
      thumbnail.src = 'icons/placeholder_image_url.png'; // Replace with a real placeholder image URL
    }
  
    document.getElementById('status').appendChild(tabElement);
  }
  
  // Event listener for "Group Tabs" button (existing code)
  document.getElementById('groupTabs').addEventListener('click', function() {
    chrome.tabs.query({}, function(tabs) {
      const groups = groupTabsByDomain(tabs);
  
      document.getElementById('status').innerHTML = '';  // Clear the previous content
      for (const domain in groups) {
        const domainHeader = document.createElement('h3');
        domainHeader.textContent = `${domain} (${groups[domain].length} tabs)`;
        document.getElementById('status').appendChild(domainHeader);
  
        groups[domain].forEach(tab => {
          addTabPreview(tab);
        });
      }
    });
  });
  
  // Event listener for "Suspend Idle Tabs" button (existing code)
  document.getElementById('suspendTabs').addEventListener('click', suspendIdleTabs);
  
  // Function to suspend idle tabs (existing code)
  function suspendIdleTabs() {
    chrome.tabs.query({}, function(tabs) {
      const now = new Date().getTime();
      const idleTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  
      tabs.forEach(tab => {
        chrome.tabs.get(tab.id, function(tabInfo) {
          if (tabInfo.lastAccessed && (now - tabInfo.lastAccessed) > idleTime && !tabInfo.active) {
            // Suspend the tab by discarding it
            chrome.tabs.discard(tab.id, function() {
              console.log(`Tab ${tab.id} suspended`);
            });
          }
        });
      });
    });
  }
  