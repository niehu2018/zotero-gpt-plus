# Zotero GPT

This project is a Zotero addon that integrates OpenAI's GPT models into the Zotero reference manager. It provides a chat-based interface to interact with your Zotero library, including items, notes, and PDFs.

## Project Overview

- **Main Technologies:** TypeScript, Node.js, Zotero Plugin Toolkit, React, markdown-it, and various other libraries for UI and functionality.
- **Architecture:** The addon is built around a core `Addon` class that manages the lifecycle and data. The UI is created programmatically using a `Views` class, which handles the chat window, input, and output. An `api` module provides a clean interface to interact with Zotero, Better Notes, and the OpenAI API.

## Building and Running

### Building the addon

To build the addon for production, run:

```bash
npm run build-prod
```

To build the addon for development, run:

```bash
npm run build-dev
```

### Running the addon

You can start Zotero with the addon installed using the following commands:

- For Zotero 6:
  ```bash
  npm run start-z6
  ```

- For Zotero 7:
  ```bash
  npm run start-z7
  ```

- For the default Zotero version:
  ```bash
  npm run start
  ```

To stop Zotero, run:

```bash
npm run stop
```

### Development Conventions

- The project uses TypeScript for static typing.
- The code is organized into modules for different functionalities (e.g., `views`, `api`, `locale`).
- The project uses `esbuild` for building and bundling the code.
- The UI is created programmatically without a separate UI framework like React or Vue.
- The project uses `zotero-plugin-toolkit` to simplify Zotero plugin development.
- The project uses `langchain` for some AI-related tasks.
- The project uses `markdown-it` to render markdown in the chat window.
- The project has a command system that allows users to perform various actions using slash commands (e.g., `/help`, `/clear`).
- The project has a tag system that allows users to create and execute custom commands.
- The project supports multiple GPT APIs, including the official OpenAI API and some free alternatives.
- The project has a local storage system to cache embeddings and other data.
- The project has a settings system that allows users to configure the addon's behavior.
- The project has a localization system that supports English and Chinese.
- The project has a build script that automates the process of building the addon.
- The project has a release script that automates the process of creating a new release.
- The project has a CI/CD pipeline that automatically publishes the addon to the GitHub releases page.
- The project has a test suite that is not yet implemented.
