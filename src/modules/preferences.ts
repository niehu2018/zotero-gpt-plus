import { config } from "../../package.json";

// Slider configs: [min, max, step]
const SLIDER_CONFIGS: Record<string, [number, number, number]> = {
  temperature: [0, 2, 0.1],
  chatNumber: [0, 20, 1],
  relatedNumber: [1, 30, 1],
  embeddingBatchNum: [1, 100, 1],
  maxCollectionPDFs: [1, 50, 1],
  deltaTime: [0, 500, 10],
};

export default class Preferences {
  private doc: Document | null = null;

  init() {
    this.doc = document;
    this.loadAll();
    this.bindEvents();
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
    this.loadTextInput("api");
    this.loadTextInput("secretKey");
    this.loadTextInput("model");
    this.loadTextInput("width");

    // Sliders
    Object.keys(SLIDER_CONFIGS).forEach(key => this.loadSlider(key));

    // API provider dropdown
    this.loadApiProvider();
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
    ["api", "secretKey", "model", "width"].forEach(key => {
      const el = this.$(`pref-${key}`);
      el?.addEventListener("change", () => {
        this.setPref(key, (el as HTMLInputElement).value);
      });
    });

    // Sliders
    Object.keys(SLIDER_CONFIGS).forEach(key => {
      const slider = this.$(`pref-${key}-slider`);
      const label = this.$(`pref-${key}-value`);
      slider?.addEventListener("input", () => {
        const val = (slider as HTMLInputElement).value;
        label?.setAttribute("value", val);
      });
      slider?.addEventListener("change", () => {
        const val = (slider as HTMLInputElement).value;
        // Temperature is stored as string, others as numbers
        if (key === "temperature") {
          this.setPref(key, val);
        } else {
          this.setPref(key, Number(val));
        }
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

  async testConnection() {
    const resultLabel = this.$("pref-test-result");
    const btn = this.$("pref-test-btn") as HTMLButtonElement;

    if (!resultLabel || !btn) return;

    btn.disabled = true;
    resultLabel.setAttribute("value", "Testing...");

    try {
      const api = this.getPref("api") || "https://api.openai.com";
      const secretKey = this.getPref("secretKey");
      const model = this.getPref("model") || "gpt-3.5-turbo";

      if (!secretKey) {
        resultLabel.setAttribute("value", "Error: API Key required");
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
}
