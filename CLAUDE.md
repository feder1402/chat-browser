# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build System
- `npm run build` - Production build (outputs to `dist/` folder)
- `npm run dev` - Development build with watch mode
- `npm run type-check` - TypeScript validation without emit

### Testing Extension
Load the `dist/` folder as an unpacked extension in Chrome via `chrome://extensions/` (enable Developer mode first).

## Architecture Overview

This is a Chrome Extension (Manifest V3) built with React, TypeScript, and Webpack. The extension serves as an AI browser companion for reading and summarizing tab content.

### Core Architecture Pattern
**Three-tier Chrome Extension**: Background Script ↔ Content Scripts ↔ Popup UI

**Data Flow**: 
```
Popup UI → Background Script → Content Script → Web Page
    ↑                              ↓  
    ←─────── Chrome Runtime Messages ←─────────
```

### Key Components

**Background Script** (`src/background/background.ts`): Service worker handling Chrome API communication
- Manages tab queries via `chrome.tabs.query()`
- Executes content extraction via `chrome.scripting.executeScript()`
- Routes messages between popup and content scripts

**Content Script** (`src/content/content.ts`): Injected into web pages for content extraction
- Extracts `document.body.innerText` and full HTML
- Responds to runtime messages from background script

**Popup UI** (`src/popup/`): React-based interface
- `App.tsx`: Main container with tab listing and content views
- `TabList.tsx`: Displays all browser tabs with click handlers
- `ContentView.tsx`: Shows extracted content with metadata

### Build System Architecture

**Webpack Multi-Entry Configuration**:
- `popup`: React app bundled with CSS processing
- `background`: Service worker script
- `content`: Content script for page injection

**TypeScript Configuration**: Strict mode with React JSX transform, builds to ES2020

### Data Structures

All Chrome API interactions use typed interfaces in `src/types/chrome.ts`:

```typescript
interface TabInfo {
  id: number;
  url: string;
  title: string; 
  active: boolean;
}

interface PageContent {
  url: string;
  title: string;
  content: string;    // Extracted text
  html: string;       // Full HTML
  timestamp?: string;
}
```

### Chrome Extension Patterns

**Permissions**: Requests `tabs`, `activeTab`, and `scripting` permissions with host permissions for all HTTP/HTTPS URLs

**Message Passing**: Uses `chrome.runtime.sendMessage()` for all popup ↔ background communication

**Content Extraction**: Dynamic content reading via `chrome.scripting.executeScript()` without requiring persistent content scripts

### React Patterns

**State Management**: Local React state with `useState`/`useEffect` hooks, no external state management

**Component Communication**: Props-based data flow with comprehensive TypeScript interfaces

**Error Handling**: Graceful handling of Chrome API errors and inaccessible tabs

## Development Notes

### Extension Testing
After building, the extension loads from the `dist/` folder. Chrome may cache extension files - reload the extension after rebuilds.

### Manifest V3 Constraints
- Service worker (not persistent background page) 
- Content Security Policy restrictions
- Some websites may block content extraction due to permissions

### Architecture Decisions
- **No external state management**: Simple prop drilling sufficient for current UI complexity
- **Universal content script injection**: `<all_urls>` matching for maximum compatibility
- **TypeScript-first**: All Chrome API interactions are strictly typed