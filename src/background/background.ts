import { TabInfo, PageContent, ChromeMessage } from '../types/chrome';

chrome.runtime.onMessage.addListener(
  (request: ChromeMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    if (request.action === 'getAllTabs') {
      chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
        const tabsData: TabInfo[] = tabs.map(tab => ({
          id: tab.id!,
          url: tab.url || '',
          title: tab.title || '',
          active: tab.active || false
        }));
        sendResponse(tabsData);
      });
      return true;
    }
    
    if (request.action === 'getTabContent' && request.tabId) {
      chrome.scripting.executeScript({
        target: { tabId: request.tabId },
        func: (): PageContent => {
          return {
            url: window.location.href,
            title: document.title,
            content: document.body.innerText,
            html: document.documentElement.outerHTML,
            timestamp: new Date().toISOString()
          };
        }
      }, (results) => {
        if (results && results[0]) {
          sendResponse(results[0].result);
        } else {
          sendResponse({ error: 'Could not access tab content' });
        }
      });
      return true;
    }
    
    return false;
  }
);