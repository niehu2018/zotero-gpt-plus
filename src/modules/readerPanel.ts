import { config } from "../../package.json";
import Meet from "./Meet/api";

const PANEL_ID = "zoterogptplus-reader-panel";

interface QuickAction {
  name: string;
  prompt: string;
  type: string;
}

export default class ReaderPanel {
  private panel: HTMLElement | null = null;
  private reader: any = null;
  private outputDiv: HTMLElement | null = null;
  private inputDiv: HTMLElement | null = null;

  constructor() {
    this.registerReaderPanel();
  }

  private registerReaderPanel() {
    // Register for all reader instances
    Zotero.Reader.registerEventListener("renderToolbar", this.onReaderToolbar.bind(this));
  }

  private onReaderToolbar(event: any) {
    const { reader, append } = event;
    this.reader = reader;

    // Check if side panel is enabled
    const enabled = Zotero.Prefs.get(`${config.addonRef}.readerSidePanel`);
    if (!enabled) return;

    // Add GPT button to toolbar
    const button = this.createToolbarButton();
    append(button);
  }

  private createToolbarButton(): HTMLElement {
    const button = document.createElement("button");
    button.className = "toolbar-button";
    button.title = "Zotero GPT Plus";
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    `;
    button.addEventListener("click", () => this.togglePanel());
    return button;
  }

  private togglePanel() {
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
      return;
    }
    this.createPanel();
  }

  private createPanel() {
    const readerWindow = this.reader?._iframeWindow || window;
    const container = readerWindow.document.querySelector(".reader") || readerWindow.document.body;

    this.panel = readerWindow.document.createElement("div");
    this.panel.id = PANEL_ID;
    this.panel.innerHTML = this.getPanelHTML();
    this.applyStyles();

    container.appendChild(this.panel);
    this.bindPanelEvents();
    this.loadQuickActions();
  }

  private getPanelHTML(): string {
    const model = Zotero.Prefs.get(`${config.addonRef}.model`) || "gpt-3.5-turbo";

    return `
      <div class="gpt-panel-header">
        <div class="gpt-panel-title">
          <img src="chrome://${config.addonRef}/content/icons/favicon.png" width="20" height="20"/>
          <span>${model}</span>
        </div>
        <div class="gpt-panel-actions">
          <button class="gpt-btn-copy" title="Copy">📋</button>
          <button class="gpt-btn-clear" title="Clear">🗑️</button>
          <button class="gpt-btn-close" title="Close">✕</button>
        </div>
      </div>
      <div class="gpt-panel-quick-actions" id="gpt-quick-actions">
        <!-- Quick action buttons loaded dynamically -->
      </div>
      <div class="gpt-panel-output" id="gpt-output">
        <div class="gpt-welcome">Select text or click a quick action to start</div>
      </div>
      <div class="gpt-panel-input">
        <textarea id="gpt-input" placeholder="Ask about this PDF..." rows="2"></textarea>
        <button class="gpt-btn-send" id="gpt-send">Send</button>
      </div>
      <div class="gpt-panel-footer">
        <select id="gpt-model-select">
          <option value="gpt-3.5-turbo">GPT-3.5</option>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4o-mini">GPT-4o-mini</option>
        </select>
      </div>
    `;
  }

  private applyStyles() {
    if (!this.panel) return;

    const style = document.createElement("style");
    style.textContent = `
      #${PANEL_ID} {
        position: fixed;
        right: 0;
        top: 0;
        width: 350px;
        height: 100%;
        background: #fff;
        border-left: 1px solid #ddd;
        display: flex;
        flex-direction: column;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      #${PANEL_ID} .gpt-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border-bottom: 1px solid #eee;
        background: #f8f9fa;
      }
      #${PANEL_ID} .gpt-panel-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
      }
      #${PANEL_ID} .gpt-panel-actions button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px 8px;
        font-size: 14px;
        opacity: 0.7;
      }
      #${PANEL_ID} .gpt-panel-actions button:hover { opacity: 1; }
      #${PANEL_ID} .gpt-panel-quick-actions {
        padding: 8px 12px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        border-bottom: 1px solid #eee;
      }
      #${PANEL_ID} .gpt-quick-btn {
        padding: 6px 12px;
        background: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 16px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
      }
      #${PANEL_ID} .gpt-quick-btn:hover {
        background: #e3f2fd;
        border-color: #90caf9;
      }
      #${PANEL_ID} .gpt-panel-output {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
        font-size: 14px;
        line-height: 1.6;
      }
      #${PANEL_ID} .gpt-welcome {
        color: #999;
        text-align: center;
        margin-top: 40%;
      }
      #${PANEL_ID} .gpt-panel-input {
        display: flex;
        gap: 8px;
        padding: 12px;
        border-top: 1px solid #eee;
        background: #f8f9fa;
      }
      #${PANEL_ID} .gpt-panel-input textarea {
        flex: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        resize: none;
        font-size: 13px;
      }
      #${PANEL_ID} .gpt-btn-send {
        padding: 8px 16px;
        background: #1976d2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      #${PANEL_ID} .gpt-btn-send:hover { background: #1565c0; }
      #${PANEL_ID} .gpt-panel-footer {
        padding: 8px 12px;
        border-top: 1px solid #eee;
        background: #f8f9fa;
      }
      #${PANEL_ID} .gpt-panel-footer select {
        width: 100%;
        padding: 6px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      #${PANEL_ID} .gpt-message {
        margin-bottom: 12px;
        padding: 10px;
        border-radius: 8px;
      }
      #${PANEL_ID} .gpt-message.user {
        background: #e3f2fd;
        margin-left: 20%;
      }
      #${PANEL_ID} .gpt-message.assistant {
        background: #f5f5f5;
        margin-right: 20%;
      }
    `;
    this.panel.appendChild(style);
  }

  private bindPanelEvents() {
    if (!this.panel) return;

    this.outputDiv = this.panel.querySelector("#gpt-output");
    this.inputDiv = this.panel.querySelector("#gpt-input") as HTMLTextAreaElement;

    // Close button
    this.panel.querySelector(".gpt-btn-close")?.addEventListener("click", () => {
      this.panel?.remove();
      this.panel = null;
    });

    // Clear button
    this.panel.querySelector(".gpt-btn-clear")?.addEventListener("click", () => {
      if (this.outputDiv) {
        this.outputDiv.innerHTML = '<div class="gpt-welcome">Select text or click a quick action to start</div>';
      }
      Meet.Global.views?.messages.splice(0);
    });

    // Copy button
    this.panel.querySelector(".gpt-btn-copy")?.addEventListener("click", () => {
      const text = this.outputDiv?.textContent || "";
      navigator.clipboard.writeText(text);
    });

    // Send button
    this.panel.querySelector("#gpt-send")?.addEventListener("click", () => {
      this.sendMessage();
    });

    // Enter to send
    this.inputDiv?.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Model select
    const modelSelect = this.panel.querySelector("#gpt-model-select") as HTMLSelectElement;
    const currentModel = Zotero.Prefs.get(`${config.addonRef}.model`) || "gpt-3.5-turbo";
    modelSelect.value = currentModel;
    modelSelect.addEventListener("change", () => {
      Zotero.Prefs.set(`${config.addonRef}.model`, modelSelect.value);
      const titleSpan = this.panel?.querySelector(".gpt-panel-title span");
      if (titleSpan) titleSpan.textContent = modelSelect.value;
    });
  }

  private loadQuickActions() {
    const container = this.panel?.querySelector("#gpt-quick-actions");
    if (!container) return;

    // Default quick actions
    const defaultActions: QuickAction[] = [
      { name: "Summarize", prompt: "Summarize this text concisely:", type: "text" },
      { name: "Translate", prompt: "Translate to Chinese:", type: "text" },
      { name: "Explain", prompt: "Explain this in simple terms:", type: "text" },
      { name: "Key Points", prompt: "List the key points:", type: "text" },
    ];

    // Load custom prompts
    let customPrompts: QuickAction[] = [];
    try {
      const tagsStr = Zotero.Prefs.get(`${config.addonRef}.tags`) || "[]";
      customPrompts = JSON.parse(tagsStr);
    } catch { /* ignore */ }

    const actions = customPrompts.length > 0 ? customPrompts.slice(0, 6) : defaultActions;

    container.innerHTML = "";
    actions.forEach(action => {
      const btn = document.createElement("button");
      btn.className = "gpt-quick-btn";
      btn.textContent = action.name;
      btn.addEventListener("click", () => this.executeQuickAction(action));
      container.appendChild(btn);
    });
  }

  private async executeQuickAction(action: QuickAction) {
    // Get selected text from PDF
    const selection = await Meet.Zotero.getPDFSelection();
    if (!selection) {
      this.showOutput("Please select some text in the PDF first.", "system");
      return;
    }

    const fullPrompt = `${action.prompt}\n\n${selection}`;
    this.showOutput(fullPrompt, "user");
    await this.getResponse(fullPrompt);
  }

  private async sendMessage() {
    const input = this.inputDiv as HTMLTextAreaElement;
    const text = input?.value?.trim();
    if (!text) return;

    // Check if we should include PDF selection
    let fullPrompt = text;
    if (text.toLowerCase().includes("this") || text.toLowerCase().includes("pdf")) {
      const selection = await Meet.Zotero.getPDFSelection();
      if (selection) {
        fullPrompt = `${text}\n\nContext from PDF:\n${selection}`;
      }
    }

    input.value = "";
    this.showOutput(text, "user");
    await this.getResponse(fullPrompt);
  }

  private showOutput(text: string, role: "user" | "assistant" | "system") {
    if (!this.outputDiv) return;

    // Remove welcome message
    const welcome = this.outputDiv.querySelector(".gpt-welcome");
    if (welcome) welcome.remove();

    const div = document.createElement("div");
    div.className = `gpt-message ${role}`;
    div.textContent = text;
    this.outputDiv.appendChild(div);
    this.outputDiv.scrollTop = this.outputDiv.scrollHeight;
  }

  private async getResponse(prompt: string) {
    try {
      this.showOutput("Thinking...", "assistant");

      const response = await Meet.OpenAI.getGPTResponse(prompt);

      // Replace "Thinking..." with actual response
      const messages = this.outputDiv?.querySelectorAll(".gpt-message.assistant");
      const lastMsg = messages?.[messages.length - 1];
      if (lastMsg) {
        lastMsg.textContent = response;
      }
    } catch (e: any) {
      this.showOutput(`Error: ${e.message}`, "system");
    }
  }

  destroy() {
    this.panel?.remove();
    this.panel = null;
  }
}
