# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zotero GPT is a Firefox XUL/WebExtension-based Zotero plugin (v0.2.8) that integrates OpenAI's GPT models with Zotero for academic reference management. It enables AI-powered queries on PDFs, bibliography items, and notes directly within Zotero's interface.

**Tech Stack**: TypeScript, esbuild, zotero-plugin-toolkit, langchain, chromadb, markdown-it

**Repository**: https://github.com/niehu2018/zotero-gpt-plus

## Build Commands

```bash
# Development build (no minification)
npm run build-dev

# Production build (minified)
npm run build-prod

# Full build with type checking
npm run build

# Type check only (no build)
npm run tsc

# Launch Zotero with plugin
npm run start          # Auto-detect version
npm run start-z6       # Zotero 6 specific
npm run start-z7       # Zotero 7 specific

# Stop Zotero
npm run stop

# Rebuild and restart (development)
npm run restart-dev

# Rebuild and restart (production)
npm run restart-prod
```

The `.xpi` file is generated in the `build/` directory after building.

## Architecture Overview

### Entry Point & Initialization
- `src/index.ts` - Initializes global Zotero environment and mounts addon instance
- `src/hooks.ts` - Handles startup/shutdown lifecycle, locale initialization, view setup
- `src/addon.ts` - Main addon singleton class with data, hooks, and API namespace

### Core Modules

**`src/modules/views.ts`** (46KB - largest component)
- Main UI container and state management
- Message history tracking for OpenAI conversations
- Command tag execution and rendering system
- Markdown rendering pipeline with KaTeX/MathJax support
- Keyboard shortcuts and event handling

**`src/modules/base.ts`**
- Configuration and default settings
- Built-in command tag definitions (AskPDF, Translate, Improve writing, etc.)
- Tag parsing logic (color, position, trigger patterns)
- Help text and keyboard command reference

**`src/modules/utils.ts`**
- Utility functions (color conversion, backwards compatibility wrappers)

**`src/modules/localStorage.ts`**
- Persistent storage for embeddings cache
- JSON file management for vector caching with MD5 fingerprints

### Meet Module System (Integration Hub)

The `src/modules/Meet/` directory contains the core integration APIs exposed to command tags:

**`Meet/api.ts`** - Public API namespace with three main groups:

```typescript
Meet.Zotero {
  getClipboardText()        // System clipboard
  getItemField(field)       // Zotero item metadata
  getPDFSelection()         // Selected PDF text
  getRelatedText(query)     // Semantic search in PDF/items
  getPDFAnnotations(select) // Annotations/highlights
}

Meet.BetterNotes {
  getEditorText(span)       // Get note text at cursor
  insertEditorText(html)    // Insert into note
  replaceEditorText(html)   // Replace selection in note
  follow()                  // Float UI with cursor
  reFocus(editor)           // Return focus to editor
}

Meet.OpenAI {
  getGPTResponse(prompt)    // Get GPT response (streaming)
}

Meet.Global {
  input, views, lock, popupWin, storage
}
```

**`Meet/Zotero.ts`** (15KB)
- PDF text extraction with spatial layout analysis
- Multi-column PDF handling with `mergeSameLine()` and `isIntersect()`
- Item-to-langchain Document conversion
- Semantic search via cosine similarity

**`Meet/OpenAI.ts`** (11KB)
- OpenAIEmbeddings class for generating/caching embeddings
- Vector similarity search (k-most relevant passages)
- Batch embedding with configurable batch size
- Local caching with MD5 fingerprints
- Multiple API endpoint support (regional fallbacks)

**`Meet/BetterNotes.ts`** (3.5KB)
- Integration with Better Notes plugin (optional)
- Editor text extraction, HTML-to-markdown conversion
- Real-time UI positioning relative to cursor

### Command Tag System

User-extensible command tag system for rapid queries:

**Tag Structure:**
```
#TagName[color=#0EA293][position=10][trigger=/regex/]
Plain text prompt...
${Meet.Zotero.getPDFSelection()}
More prompt...
```

**Usage:**
- Type `#TagName` and press Enter to create
- Ctrl+R to execute tag
- Ctrl+S to save modifications
- Long-press to edit; right-long-press to delete
- Up/Down arrow keys for history navigation

**Built-in Tags** (in `base.ts`):
- `🪐AskPDF` - Query PDF content
- `🌟Translate` - Translate to Chinese
- `✨Improve writing` - Academic polish
- `Clipboard`, `Annotations`, `Selection`, `Item`, `Items` - Various context queries

### Data Flow

```
User Input (Command Tag or Direct Query)
    ↓
Parse prompt + ${Meet.xxx()} code blocks
    ↓
Execute code snippets:
    - Meet.Zotero.getPDFSelection()
    - Meet.Zotero.getRelatedText(query)
      ├─ Extract PDF text via pdfreader
      ├─ Create langchain Documents
      └─ similaritySearch() via OpenAI embeddings
    ↓
Construct final prompt → OpenAI API request
    ↓
Stream response token-by-token
    ↓
Markdown rendering (KaTeX/MathJax/syntax highlighting)
    ↓
Display in UI panel + save to message history
```

## Build System

**`scripts/build.js`** - Custom esbuild pipeline:
- TypeScript compilation to ES2016
- Environment-based builds (development vs. production)
- Asset copying (icons, stylesheets, manifests)
- Template substitution (addon name, ID, version)
- XPI compression for distribution

**Addon Packaging:**
- `addon/bootstrap.js` - Zotero 6/7 compatible bootstrap loader
- `addon/manifest.json` - WebExtension metadata
- `addon/chrome.manifest` - XUL chrome registration
- `addon/prefs.js` - Default user preferences

## Development Workflow

1. **Making Changes:**
   - Modify TypeScript source files in `src/`
   - Run `npm run build-dev` for faster development builds
   - Use `npm run tsc` to check types without building

2. **Testing:**
   - No automated tests currently
   - Manual validation: `npm run start` launches Zotero with plugin
   - Test command tags, PDF queries, and API integration manually

3. **Code Style:**
   - 2-space indentation, PascalCase for classes, camelCase for functions/variables
   - Keep changes minimal and consistent with existing code

4. **Adding New Command Tags:**
   - Edit `src/modules/base.ts` to add built-in tags
   - Or create in UI: `#TagName` + Enter, then Ctrl+S to save
    - Share custom tags at: https://github.com/niehu2018/zotero-gpt-plus/discussions/3

5. **Extending Meet API:**
   - Add new methods to `src/modules/Meet/` modules
   - Export via `src/modules/Meet/api.ts` namespace
   - Document parameters and return types for command tag usage

## Configuration & Preferences

**User Preferences** (configured at runtime via `/secretKey`, `/api`, `/model` commands):
- `secretKey` - OpenAI API key (required)
- `api` - Custom API endpoint (supports local/regional proxies)
- `model` - GPT model selection (gpt-3.5-turbo, gpt-4)
- `temperature` - Sampling temperature (0-1)
- `chatNumber` - History conversation count
- `relatedNumber` - Top-k passages for semantic search
- `deltaTime` - Streaming output smoothness (ms)
- `width` - UI panel width (percentage)
- `embeddingBatchNum` - Batch size for embeddings

## Compatibility

- **Zotero Versions**: 6.999 - 7.0.*
- **Node.js**: 18+ (esbuild requirement)
- **TypeScript**: Strict mode, ES2016 target
- **Browser**: Firefox ESR (Zotero runs on Firefox engine)

## Key Files Reference

| File | Purpose | Size |
|------|---------|------|
| `src/modules/views.ts` | Main UI and state management | 46KB |
| `src/modules/Meet/Zotero.ts` | PDF & document processing | 15KB |
| `src/modules/Meet/OpenAI.ts` | AI model integration | 11KB |
| `src/modules/base.ts` | Config & command tags | 6.5KB |
| `addon/bootstrap.js` | Zotero addon loader | 4.6KB |
| `scripts/build.js` | esbuild pipeline | 4.8KB |
| `src/modules/Meet/BetterNotes.ts` | Note editor integration | 3.5KB |

## Common Development Patterns

### PDF Text Extraction
The plugin uses custom PDF parsing with spatial layout analysis (`Meet/Zotero.ts`). PDFs are processed character-by-character, with `mergeSameLine()` grouping characters into lines based on Y-coordinate proximity. Multi-column layouts are handled via rectangle intersection detection.

### Semantic Search
Vector embeddings are generated via OpenAI API and cached locally with MD5 fingerprints (`Meet/OpenAI.ts`, `localStorage.ts`). Cosine similarity search finds the k-most relevant passages. Embeddings are batched to avoid token limits.

### Command Tag Execution
Tags contain prompt text + `${code}` blocks. When executed (Ctrl+R), code blocks are evaluated in a trusted context with access to Meet API. Results replace the code block, and the final text is sent to GPT.

### Streaming Responses
GPT responses are streamed token-by-token via `getGPTResponse()`. The UI updates progressively with `Views.setText(text, isDone)`, providing real-time feedback.

## Security Considerations

- API keys are never committed; configured at runtime in Zotero settings
- Command tag code blocks execute in trusted context (user-authored only)
- Vector embeddings cached locally with MD5 fingerprints
- Supports proxy agents for regional API access restrictions
