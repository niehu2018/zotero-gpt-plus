# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the TypeScript source for the Zotero plugin. Entry points include `src/index.ts` and `src/addon.ts`.
- `src/modules/` holds feature modules such as `Meet/`, plus shared utilities like `base.ts` and `utils.ts`.
- `scripts/` provides build and runtime helpers (build/start/stop).
- `addon/`, `tags/`, and `imgs/` store packaged assets, tag templates, and documentation images.
- `typing/` and `tsconfig.json` define TypeScript typings and compiler settings.

## Build, Lint, Test Commands

### Build Commands
- `npm run build` - Full production build with type-checking (`build-prod` + `tsc`)
- `npm run build-dev` - Development build (no minification, faster)
- `npm run build-prod` - Production build (minified bundle)
- `npm run tsc` - TypeScript type-checking only (no build output)

### Development & Testing Commands
- `npm run start` - Launch Zotero with plugin (auto-detects version)
- `npm run start-z6` - Launch Zotero 6 specifically
- `npm run start-z7` - Launch Zotero 7 specifically
- `npm run stop` - Stop running Zotero instance
- `npm run restart-dev` - Rebuild (dev) and restart Zotero
- `npm run restart-prod` - Rebuild (prod) and restart Zotero
- `npm run restart` - Alias for `restart-dev`

### Test Commands
- `npm test` - Currently exits with error (no test runner configured)
- **Manual Testing**: Run `npm run build` then `npm run start` to test in Zotero
- **Single Test File**: No automated test runner; test manually by building and running Zotero

### Lint Commands
- No linter configured in this project
- Code style is maintained manually through review

## Coding Style & Naming Conventions

### Language & TypeScript
- **Primary Language**: TypeScript with strict mode enabled
- **Target**: ES2016 (configured in tsconfig.json)
- **Modules**: ES modules with import/export syntax
- **Type Annotations**: Required for all function parameters and return types
- **Strict Null Checks**: Enabled - handle null/undefined explicitly

### Formatting
- **Indentation**: 2 spaces (never tabs)
- **Line Length**: No strict limit, but keep lines readable
- **Semicolons**: Always required
- **Quotes**: Double quotes for strings, single quotes for character literals
- **Trailing Commas**: Include in multi-line objects/arrays

### Naming Conventions
- **Classes**: PascalCase (e.g., `OpenAIEmbeddings`, `Utils`)
- **Interfaces/Types**: PascalCase (e.g., `RequestArg`)
- **Functions/Methods**: camelCase (e.g., `getGPTResponse`, `similaritySearch`)
- **Variables/Properties**: camelCase (e.g., `secretKey`, `chatNumber`)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for configurable values
- **Private Members**: Prefix with `#` for true private methods/properties
- **Files**: camelCase or kebab-case (e.g., `OpenAI.ts`, `localStorage.ts`)

### Code Organization
- **Imports**: Group by external libraries first, then internal modules
- **Export Style**: Named exports preferred over default exports
- **Variable Declaration**: Use `const` by default, `let` only when reassignment needed
- **Function Declaration**: Prefer arrow functions for callbacks, regular functions for named exports
- **Class Structure**: Public methods first, then private methods

### Error Handling
- **Try/Catch**: Use try/catch blocks around async operations and API calls
- **Error Types**: Catch specific error types when possible
- **Error Logging**: Use `ztoolkit.log()` for debugging, `new ztoolkit.ProgressWindow()` for user notifications
- **Graceful Degradation**: Handle API failures by falling back to alternative endpoints

### Comments & Documentation
- **JSDoc**: Use for all public functions with `@param`, `@returns`, `@throws`
- **Inline Comments**: Use sparingly, only for complex logic
- **TODO/FIXME**: Include with explanation of what needs to be done
- **Deprecation**: Mark deprecated functions with `@deprecated` JSDoc tag

### Patterns & Best Practices
- **Async/Await**: Preferred over Promise chains
- **Template Literals**: Use for string interpolation
- **Destructuring**: Use for object/array unpacking
- **Optional Chaining**: Use `?.` for safe property access
- **Nullish Coalescing**: Use `??` for default values
- **Array Methods**: Prefer `map()`, `filter()`, `reduce()` over for loops
- **Object Spread**: Use `{...obj}` for shallow copying

### API Integration Patterns
- **HTTP Requests**: Use `Zotero.HTTP.request()` for all external API calls
- **Streaming Responses**: Handle token-by-token updates with `requestObserver`
- **Rate Limiting**: Implement exponential backoff for API failures
- **Caching**: Use local storage with MD5 fingerprints for expensive operations

## Testing Guidelines
- **Automated Tests**: None currently configured - `npm test` exits with error
- **Manual Testing**: Build with `npm run build` then test with `npm run start`
- **Integration Testing**: Test command tags, PDF queries, and API integrations manually
- **Cross-Version Testing**: Test with both Zotero 6 (`npm run start-z6`) and 7 (`npm run start-z7`)
- **Future Test Setup**: When adding tests, use a framework like Jest or Mocha and update this file

## Commit & Pull Request Guidelines
- **Commit Messages**: Short, imperative style (e.g., "Add PDF annotation support", "Fix embedding cache bug")
- **PR Content**: Include description, testing notes, and screenshots/GIFs for UI changes
- **PR Testing**: Mention build command used (`npm run build`) and Zotero version tested
- **Branch Naming**: Use descriptive names (e.g., `feature/pdf-search`, `fix/embedding-cache`)

## Security & Configuration Notes
- **API Keys**: Never commit - configure at runtime via `/secretKey` command
- **Environment Variables**: Use Zotero preferences, not `.env` files
- **HTTPS**: All API endpoints should use HTTPS
- **Input Validation**: Validate user inputs before API calls
- **Error Messages**: Don't expose sensitive information in error messages
- **Release Process**: Uses `release-it` with `.release-it.json` configuration
