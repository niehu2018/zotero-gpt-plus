import { config } from "../../package.json";

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
  "readerSidePanel",
  "noteSidePanel",
  "popupShortcuts",
  "autoInsertAnnotation",
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

  init() {
    this.doc = document;
    this.loadAll();
    this.bindEvents();
    this.loadPrompts();
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
    if (dropdown) {
      if (api.includes("openai.com")) {
        dropdown.value = "https://api.openai.com";
      } else if (api.includes("openrouter.ai")) {
        dropdown.value = "https://openrouter.ai/api";
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
    apiProvider?.addEventListener("command", () => {
      const val = (apiProvider as any).value;
      if (val !== "custom") {
        const apiInput = this.$("pref-api") as HTMLInputElement;
        if (apiInput) {
          apiInput.value = val;
          this.setPref("api", val);
        }
      }
    });

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
        btn.setAttribute("label", "Show");
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

  editSystemPrompt() {
    const current = this.getPref("systemPrompt") || "";
    const newPrompt = prompt("System Prompt:", current);
    if (newPrompt !== null) {
      this.setPref("systemPrompt", newPrompt);
    }
  }
}
