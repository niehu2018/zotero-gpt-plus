# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-14 21:44:16
**Commit:** d98c5dd
**Branch:** main

## OVERVIEW
Zotero GPT Plus is a Firefox XUL/WebExtension plugin for Zotero that integrates OpenAI GPT models for PDF querying, semantic search, and academic writing assistance, built with TypeScript and esbuild.

## STRUCTURE
```
zotero-gpt-plus/
├── src/                      # TypeScript source
│   ├── index.ts              # Entry point
│   ├── addon.ts              # Main addon singleton
│   ├── hooks.ts              # Lifecycle hooks
│   └── modules/              # Feature modules
├── addon/                    # Build output and manifests
├── scripts/                  # Build and runtime helpers
├── tags/                     # Command tag templates
├── AGENTS.md                 # This file
└── CLAUDE.md                 # Architecture guidance
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Add feature | src/modules/ | New module in modules/ |
| Fix UI bug | src/modules/views.ts | Main UI logic |
| Add command tag | src/modules/base.ts | Built-in tags |
| Update build | scripts/build.js | esbuild pipeline |
| Change API | src/modules/Meet/ | Public API |

## CODE MAP
| Symbol | Type | Location | Refs | Role |
|--------|------|----------|------|------|
| Addon | Class | src/addon.ts | 5 | Main addon singleton |
| timeout | Function | src/index.ts | 1 | Custom AbortSignal.timeout |
| basicTool | Constant | src/index.ts | 1 | Tool definition |

## CONVENTIONS
No linting/formatting tools configured - code style manually maintained. Custom build pipeline with esbuild + UglifyJS instead of standard bundlers. Build artifacts in root addon/ directory.

## ANTI-PATTERNS (THIS PROJECT)
Mixed case subdirectories (Meet/). Root-level typing/ for type definitions. No automated testing - npm test exits with error.

## UNIQUE STYLES
Meet API facade pattern for command tags. Global sandbox initialization in index.ts. Command tag system with ${code} interpolation.

## COMMANDS
```bash
npm run build         # Full production build (build-prod + tsc)
npm run build-dev     # Development build (no minification)
npm run build-prod    # Production build (minified)
npm run tsc           # Type-check only (no build)
npm run start         # Launch Zotero with plugin (auto-detect)
npm run start-z6      # Launch Zotero 6
npm run start-z7      # Launch Zotero 7
npm run stop          # Stop Zotero
npm run restart       # Rebuild (dev) + restart
npm run restart-dev   # Alias for restart
npm run restart-prod  # Rebuild (prod) + restart
npm run release       # Create release with release-it
```

## NOTES
No CI pipeline. Manual testing only. Dual Zotero version support (6/7). Auto-update via raw GitHub URLs. Wiki update workflows for documentation.