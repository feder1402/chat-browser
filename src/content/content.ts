import { PageContent, ChromeMessage } from '../types/chrome';

function getPageContent(): PageContent {
  return {
    url: window.location.href,
    title: document.title,
    content: document.body.innerText,
    html: document.documentElement.outerHTML,
    timestamp: new Date().toISOString()
  };
}

chrome.runtime.onMessage.addListener(
  (request: ChromeMessage, sender: chrome.runtime.MessageSender, sendResponse: (response: PageContent) => void) => {
    if (request.action === 'getContent') {
      sendResponse(getPageContent());
    }
    return true;
  }
);