import React, { useState, useEffect } from 'react';
import { TabInfo, PageContent } from '../types/chrome';
import TabList from './components/TabList';
import ContentView from './components/ContentView';
import './App.css';

const App: React.FC = () => {
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [selectedContent, setSelectedContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTabs();
  }, []);

  const loadTabs = () => {
    setLoading(true);
    chrome.runtime.sendMessage({ action: 'getAllTabs' }, (response: TabInfo[]) => {
      if (chrome.runtime.lastError) {
        setError(chrome.runtime.lastError.message || 'Unknown error');
      } else {
        setTabs(response);
        setError(null);
      }
      setLoading(false);
    });
  };

  const handleTabClick = (tabId: number) => {
    setLoading(true);
    chrome.runtime.sendMessage(
      { action: 'getTabContent', tabId },
      (response: PageContent) => {
        if (chrome.runtime.lastError) {
          setError(chrome.runtime.lastError.message || 'Unknown error');
        } else if (response.error) {
          setError(response.error);
        } else {
          setSelectedContent(response);
          setError(null);
        }
        setLoading(false);
      }
    );
  };

  const handleBackToTabs = () => {
    setSelectedContent(null);
    loadTabs();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={loadTabs}>Retry</button>
      </div>
    );
  }

  return (
    <div className="app">
      <h3>Chrome Tab Reader</h3>
      {selectedContent ? (
        <ContentView content={selectedContent} onBack={handleBackToTabs} />
      ) : (
        <TabList tabs={tabs} onTabClick={handleTabClick} />
      )}
    </div>
  );
};

export default App;