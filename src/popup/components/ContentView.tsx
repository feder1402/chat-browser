import React from 'react';
import { PageContent } from '../../types/chrome';

interface ContentViewProps {
  content: PageContent;
  onBack: () => void;
}

const ContentView: React.FC<ContentViewProps> = ({ content, onBack }) => {
  return (
    <div className="content-view">
      <button className="back-button" onClick={onBack}>
        ← Back to Tabs
      </button>
      <h4>Tab Content</h4>
      <div className="content-info">
        <div className="info-item">
          <strong>URL:</strong> {content.url}
        </div>
        <div className="info-item">
          <strong>Title:</strong> {content.title}
        </div>
        {content.timestamp && (
          <div className="info-item">
            <strong>Captured:</strong> {new Date(content.timestamp).toLocaleString()}
          </div>
        )}
      </div>
      <div className="content-section">
        <strong>Text Content:</strong>
        <div className="content-preview">
          {content.content}
        </div>
      </div>
    </div>
  );
};

export default ContentView;