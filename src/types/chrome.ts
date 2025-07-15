export interface TabInfo {
  id: number;
  url: string;
  title: string;
  active: boolean;
}

export interface PageContent {
  url: string;
  title: string;
  content: string;
  html: string;
  timestamp?: string;
  error?: string;
}

export interface ChromeMessage {
  action: 'getAllTabs' | 'getTabContent' | 'getContent';
  tabId?: number;
}

export interface ChromeMessageResponse<T> {
  data?: T;
  error?: string;
}