import { config } from "../../package.json";
import ConfigManager from "./configManager";

// Slider configs: [min, max, step, isString]
const SLIDER_CONFIGS: Record<string, [number, number, number, boolean?]> = {
  temperature: [0, 2, 0.1, true],
  maxTokens: [256, 32000, 256],
  chatNumber: [0, 20, 1],
  relatedNumber: [1, 30, 1],
  embeddingBatchNum: [1, 100, 1],
  maxCollectionPDFs: [1, 50, 1],
  deltaTime: [0, 500, 10],
};

// Checkbox configs
const CHECKBOX_KEYS = [
  "useCustomEmbeddings",
  "aiOutline",
  "readerSidePanel",
  "noteSidePanel",
  "popupShortcuts",
  "autoInsertAnnotation",
  "altSelection",
  "preserveReasoningClipboard",
  "preserveReasoningNote",
];

// Text input configs
const TEXT_KEYS = [
  "api", "secretKey", "model", "width",
  "embeddingApi", "embeddingKey", "embeddingModel",
];

interface Prompt {
  name: string;
  type: string;
  prompt: string;
}

export default class Preferences {
  private doc: Document | null = null;
  private selectedPromptIndex: number = -1;
  private prompts: Prompt[] = [];
  private configManager: ConfigManager = new ConfigManager();

  init() {
    if (this.doc === document) {
      return;
    }
    this.doc = document;
    this.loadAll();
    this.bindEvents();
    this.loadPrompts();
    this.loadConfigDropdown();
  }

  private getPref(key: string): any {
    return Zotero.Prefs.get(`${config.addonRef}.${key}`);
  }

  private setPref(key: string, value: any) {
    Zotero.Prefs.set(`${config.addonRef}.${key}`, value);
  }

  private $(id: string): HTMLElement | null {
    return this.doc?.getElementById(id) || null;
  }

  private loadAll() {
    // Text inputs
    TEXT_KEYS.forEach(key => this.loadTextInput(key));

    // Sliders
    Object.keys(SLIDER_CONFIGS).forEach(key => this.loadSlider(key));

    // Checkboxes
    CHECKBOX_KEYS.forEach(key => this.loadCheckbox(key));

    // API provider dropdown
    this.loadApiProvider();

    // Annotation color
    this.loadColor("annotationColor");
  }

  private loadTextInput(key: string) {
    const el = this.$(`pref-${key}`) as HTMLInputElement;
    if (el) {
      el.value = String(this.getPref(key) || "");
    }
  }

  private loadSlider(key: string) {
    const slider = this.$(`pref-${key}-slider`) as HTMLInputElement;
    const label = this.$(`pref-${key}-value`);
    if (slider && label) {
      const value = this.getPref(key);
      slider.value = String(value);
      label.setAttribute("value", String(value));
    }
  }

  private loadCheckbox(key: string) {
    const el = this.$(`pref-${key}`) as any;
    if (el) {
      el.checked = !!this.getPref(key);
    }
  }

  private loadColor(key: string) {
    const el = this.$(`pref-${key}`) as HTMLInputElement;
    if (el) {
      el.value = String(this.getPref(key) || "#b99bcf");
    }
  }

  private loadApiProvider() {
    const api = this.getPref("api") || "";
    const dropdown = this.$("pref-api-provider") as any;
    const apiMode = this.$("pref-api-mode") as any;
    if (apiMode) {
      apiMode.value = api.includes("/v1/") ? "full" : "base";
    }
    if (dropdown) {
      if (api.includes("openai.com")) {
        dropdown.value = "https://api.openai.com";
      } else if (api.includes("openrouter.ai")) {
        dropdown.value = "https://openrouter.ai/api";
      } else if (api.includes("api.deepseek.com")) {
        dropdown.value = "https://api.deepseek.com";
      } else if (api.includes("api.siliconflow.cn")) {
        dropdown.value = "https://api.siliconflow.cn";
      } else if (api.includes("ark.cn-beijing.volces.com/api")) {
        dropdown.value = "https://ark.cn-beijing.volces.com/api";
      } else if (api.includes("api.x.ai")) {
        dropdown.value = "https://api.x.ai";
      } else if (api.includes("generativelanguage.googleapis.com")) {
        dropdown.value = "https://generativelanguage.googleapis.com";
      } else if (api.includes("api.moonshot.cn")) {
        dropdown.value = "https://api.moonshot.cn";
      } else if (api.includes("dashscope.aliyuncs.com/compatible-mode")) {
        dropdown.value = "https://dashscope.aliyuncs.com/compatible-mode";
      } else if (api.includes("qianfan.aliyuncs.com")) {
        dropdown.value = "https://qianfan.aliyuncs.com";
      } else if (api.includes("open.bigmodel.cn/api/paas")) {
        dropdown.value = "https://open.bigmodel.cn/api/paas";
      } else if (api.includes("api.chatanywhere.tech")) {
        dropdown.value = "https://api.chatanywhere.tech";
      } else if (api.includes("openai.api2d.net")) {
        dropdown.value = "https://openai.api2d.net";
      } else {
        dropdown.value = "custom";
      }
    }
  }

  private bindEvents() {
    // Text inputs
    TEXT_KEYS.forEach(key => {
      const el = this.$(`pref-${key}`);
      el?.addEventListener("change", () => {
        this.setPref(key, (el as HTMLInputElement).value);
      });
    });

    // Sliders
    Object.keys(SLIDER_CONFIGS).forEach(key => {
      const slider = this.$(`pref-${key}-slider`);
      const label = this.$(`pref-${key}-value`);
      const [, , , isString] = SLIDER_CONFIGS[key];

      slider?.addEventListener("input", () => {
        const val = (slider as HTMLInputElement).value;
        label?.setAttribute("value", val);
      });

      slider?.addEventListener("change", () => {
        const val = (slider as HTMLInputElement).value;
        this.setPref(key, isString ? val : Number(val));
      });
    });

    // Checkboxes
    CHECKBOX_KEYS.forEach(key => {
      const el = this.$(`pref-${key}`);
      el?.addEventListener("command", () => {
        this.setPref(key, (el as any).checked);
      });
    });

    // API provider dropdown
    const apiProvider = this.$("pref-api-provider");
    const apiMode = this.$("pref-api-mode");
    const applyApiValue = () => {
      const providerVal = (apiProvider as any)?.value;
      const modeVal = (apiMode as any)?.value || "base";
      const apiInput = this.$("pref-api") as HTMLInputElement;
      if (!apiInput) return;
      let nextVal = apiInput.value;
      if (providerVal && providerVal !== "custom") {
        nextVal = providerVal;
      }
      if (modeVal === "full" && !/\/v1\/?$/.test(nextVal)) {
        nextVal = `${nextVal.replace(/\/+$/, "")}/v1`;
      } else if (modeVal === "base") {
        nextVal = nextVal.replace(/\/v1\/?$/, "");
      }
      apiInput.value = nextVal;
      this.setPref("api", nextVal);
    };
    apiProvider?.addEventListener("command", applyApiValue);
    apiMode?.addEventListener("command", applyApiValue);

    // Model preset dropdown
    const modelPreset = this.$("pref-model-preset");
    modelPreset?.addEventListener("command", () => {
      const val = (modelPreset as any).value;
      const modelInput = this.$("pref-model") as HTMLInputElement;
      if (modelInput) {
        modelInput.value = val;
        this.setPref("model", val);
      }
    });

    // Embedding model preset dropdown
    const embeddingModelPreset = this.$("pref-embeddingModel-preset");
    embeddingModelPreset?.addEventListener("command", () => {
      const val = (embeddingModelPreset as any).value;
      const modelInput = this.$("pref-embeddingModel") as HTMLInputElement;
      if (modelInput) {
        modelInput.value = val;
        this.setPref("embeddingModel", val);
      }
    });

    // Annotation color
    const colorInput = this.$("pref-annotationColor");
    colorInput?.addEventListener("change", () => {
      this.setPref("annotationColor", (colorInput as HTMLInputElement).value);
    });
  }

  togglePassword(key: string) {
    const input = this.$(`pref-${key}`) as HTMLInputElement;
    const btn = this.$(`pref-${key}-toggle`);
    if (input && btn) {
      if (input.type === "password") {
        input.type = "text";
        btn.setAttribute("label", "Hide");
      } else {
        input.type = "password";
        btn.setAttribute("label", "Click to display");
      }
    }
  }

  // === Prompts Management ===

  private loadPrompts() {
    try {
      const tagsStr = this.getPref("tags") || "[]";
      this.prompts = JSON.parse(tagsStr);
    } catch {
      this.prompts = [];
    }
    this.renderPrompts();
  }

  private savePrompts() {
    this.setPref("tags", JSON.stringify(this.prompts));
  }

  private renderPrompts() {
    const tbody = this.$("prompts-tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    this.prompts.forEach((p, i) => {
      const tr = this.doc!.createElementNS("http://www.w3.org/1999/xhtml", "tr") as HTMLTableRowElement;
      tr.innerHTML = `
        <td>${this.escapeHtml(p.name)}</td>
        <td>${this.escapeHtml(p.type || "text")}</td>
        <td>${this.escapeHtml(p.prompt?.slice(0, 50) || "")}${p.prompt?.length > 50 ? "..." : ""}</td>
      `;
      if (i === this.selectedPromptIndex) {
        tr.classList.add("selected");
      }
      tr.addEventListener("click", () => this.selectPrompt(i));
      tbody.appendChild(tr);
    });
  }

  private escapeHtml(str: string): string {
    const div = this.doc!.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  private selectPrompt(index: number) {
    this.selectedPromptIndex = index;
    this.renderPrompts();
  }

  movePrompt(direction: number) {
    const i = this.selectedPromptIndex;
    const newIndex = i + direction;
    if (i < 0 || newIndex < 0 || newIndex >= this.prompts.length) return;

    const temp = this.prompts[i];
    this.prompts[i] = this.prompts[newIndex];
    this.prompts[newIndex] = temp;
    this.selectedPromptIndex = newIndex;
    this.savePrompts();
    this.renderPrompts();
  }

  addPrompt() {
    const name = prompt("Prompt name:");
    if (!name) return;

    const type = prompt("Type (text/pageText/pagesText/abstractPagesText):", "text");
    const promptText = prompt("Prompt text:");

    if (name && promptText) {
      this.prompts.push({ name, type: type || "text", prompt: promptText });
      this.savePrompts();
      this.renderPrompts();
    }
  }

  editPrompt() {
    const i = this.selectedPromptIndex;
    if (i < 0 || i >= this.prompts.length) {
      alert("Please select a prompt first");
      return;
    }

    const p = this.prompts[i];
    const name = prompt("Prompt name:", p.name);
    if (!name) return;

    const type = prompt("Type:", p.type);
    const promptText = prompt("Prompt text:", p.prompt);

    if (name && promptText) {
      this.prompts[i] = { name, type: type || "text", prompt: promptText };
      this.savePrompts();
      this.renderPrompts();
    }
  }

  deletePrompt() {
    const i = this.selectedPromptIndex;
    if (i < 0 || i >= this.prompts.length) {
      alert("Please select a prompt first");
      return;
    }

    if (confirm(`Delete prompt "${this.prompts[i].name}"?`)) {
      this.prompts.splice(i, 1);
      this.selectedPromptIndex = -1;
      this.savePrompts();
      this.renderPrompts();
    }
  }

  // === Test Functions ===

  async testConnection() {
    const resultLabel = this.$("pref-test-result");
    const btn = this.$("pref-test-btn") as HTMLButtonElement;

    if (!resultLabel || !btn) return;

    btn.disabled = true;
    resultLabel.setAttribute("value", "Testing...");
    resultLabel.style.color = "";

    try {
      const api = this.getPref("api") || "https://api.openai.com";
      const secretKey = this.getPref("secretKey");
      const model = this.getPref("model") || "gpt-3.5-turbo";

      if (!secretKey) {
        resultLabel.setAttribute("value", "Error: API Key required");
        resultLabel.style.color = "red";
        btn.disabled = false;
        return;
      }

      const response = await fetch(`${api}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${secretKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "user", content: "Hi" }],
          max_tokens: 5,
        }),
      });

      if (response.ok) {
        resultLabel.setAttribute("value", "Success!");
        resultLabel.style.color = "green";
      } else {
        const data = await response.json();
        resultLabel.setAttribute("value", `Error: ${data.error?.message || response.status}`);
        resultLabel.style.color = "red";
      }
    } catch (e: any) {
      resultLabel.setAttribute("value", `Error: ${e.message}`);
      resultLabel.style.color = "red";
    }

    btn.disabled = false;
  }

  async testEmbeddings() {
    const resultLabel = this.$("pref-embedding-test-result");
    if (!resultLabel) return;

    resultLabel.setAttribute("value", "Testing...");
    resultLabel.style.color = "";

    try {
      const api = this.getPref("embeddingApi") || this.getPref("api") + "/v1/embeddings";
      const key = this.getPref("embeddingKey") || this.getPref("secretKey");
      const model = this.getPref("embeddingModel") || "text-embedding-ada-002";

      if (!key) {
        resultLabel.setAttribute("value", "Error: Key required");
        resultLabel.style.color = "red";
        return;
      }

      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: model,
          input: "test",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const dim = data.data?.[0]?.embedding?.length || 0;
        resultLabel.setAttribute("value", `Success! (dim=${dim})`);
        resultLabel.style.color = "green";
      } else {
        const data = await response.json();
        resultLabel.setAttribute("value", `Error: ${data.error?.message || response.status}`);
        resultLabel.style.color = "red";
      }
    } catch (e: any) {
      resultLabel.setAttribute("value", `Error: ${e.message}`);
      resultLabel.style.color = "red";
    }
  }

  // === Text Editor Dialog ===

  openTextEditor(key: string, title: string) {
    const current = String(this.getPref(key) || "");

    // Create editor window
    const win = window.open(
      "",
      `${config.addonRef}-editor-${key}`,
      "width=600,height=400,resizable=yes"
    );
    if (!win) {
      alert("Failed to open editor window. Please allow popups.");
      return;
    }

    win.document.title = title;
    win.document.body.innerHTML = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; padding: 12px; height: 100vh; display: flex; flex-direction: column; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .header h3 { font-size: 14px; color: #333; }
        .actions button { padding: 6px 16px; margin-left: 8px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: #f5f5f5; }
        .actions button.primary { background: #1976d2; color: white; border-color: #1976d2; }
        .actions button:hover { opacity: 0.9; }
        textarea { flex: 1; width: 100%; padding: 12px; font-family: Monaco, Consolas, "Courier New", monospace; font-size: 13px; line-height: 1.5; border: 1px solid #ddd; border-radius: 4px; resize: none; }
        textarea:focus { outline: none; border-color: #1976d2; }
        .line-numbers { position: absolute; left: 12px; top: 58px; bottom: 12px; width: 30px; padding: 12px 0; font-family: Monaco, Consolas, monospace; font-size: 13px; line-height: 1.5; color: #999; text-align: right; user-select: none; overflow: hidden; }
      </style>
      <div class="header">
        <h3>${title}</h3>
        <div class="actions">
          <button onclick="window.close()">Cancel</button>
          <button class="primary" id="save-btn">Save</button>
        </div>
      </div>
      <textarea id="editor" spellcheck="false">${this.escapeHtml(current)}</textarea>
    `;

    const textarea = win.document.getElementById("editor") as HTMLTextAreaElement;
    const saveBtn = win.document.getElementById("save-btn");

    saveBtn?.addEventListener("click", () => {
      const value = textarea.value;

      // Validate JSON for extraParams
      if (key === "extraParams") {
        try {
          JSON.parse(value);
        } catch {
          win.alert("Invalid JSON format. Please fix and try again.");
          return;
        }
      }

      this.setPref(key, value);
      win.close();
    });

    // Focus textarea
    textarea.focus();
  }

  resetSystemPrompt() {
    const defaultPrompt = "You are a large language model serving Zotero plugin called Awesome GPT. You can directly output markdown language.";
    if (confirm("Reset System Prompt to default?")) {
      this.setPref("systemPrompt", defaultPrompt);
      alert("System Prompt reset to default.");
    }
  }

  resetExtraParams() {
    if (confirm("Reset Extra Params to empty?")) {
      this.setPref("extraParams", "{}");
      alert("Extra Params reset to {}.");
    }
  }

  // === Config Management ===

  loadConfigDropdown() {
    const dropdown = this.$("pref-config-select") as any;
    if (!dropdown) return;

    const popup = dropdown.querySelector("menupopup") || this.doc!.createElement("menupopup");
    popup.innerHTML = "";

    const configs = this.configManager.getConfigs();
    const current = this.configManager.getCurrentConfigName();

    configs.forEach(cfg => {
      const item = this.doc!.createElement("menuitem");
      item.setAttribute("label", cfg.name);
      item.setAttribute("value", cfg.name);
      popup.appendChild(item);
    });

    if (!dropdown.querySelector("menupopup")) {
      dropdown.appendChild(popup);
    }

    if (current && configs.some(c => c.name === current)) {
      dropdown.value = current;
    }
  }

  saveConfig() {
    const name = prompt("Config name:", this.configManager.getCurrentConfigName() || "My Config");
    if (name && this.configManager.saveCurrentAsConfig(name)) {
      this.loadConfigDropdown();
      alert(`Config "${name}" saved!`);
    }
  }

  switchConfig() {
    const dropdown = this.$("pref-config-select") as any;
    const name = dropdown?.value;
    if (name && this.configManager.switchToConfig(name)) {
      this.loadAll();
      alert(`Switched to "${name}"`);
    }
  }

  deleteConfig() {
    const dropdown = this.$("pref-config-select") as any;
    const name = dropdown?.value;
    if (!name) {
      alert("Please select a config first");
      return;
    }
    if (confirm(`Delete config "${name}"?`) && this.configManager.deleteConfig(name)) {
      this.loadConfigDropdown();
      alert(`Config "${name}" deleted`);
    }
  }
}
