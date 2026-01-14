import { config } from "../../package.json";
import Meet from "./Meet/api";

const MENU_ID = "zoterogptplus-pdf-quickmenu";

interface QuickMenuItem {
  icon: string;
  label: string;
  action: () => Promise<void>;
}

export default class PDFQuickMenu {
  private menu: HTMLElement | null = null;
  private reader: any = null;

  constructor() {
    this.registerListener();
  }

  private registerListener() {
    Zotero.Reader.registerEventListener("renderToolbar", this.onReaderReady.bind(this));
  }

  private onReaderReady(event: any) {
    const { reader } = event;
    this.reader = reader;

    // Check if feature is enabled
    const enabled = Zotero.Prefs.get(`${config.addonRef}.readerSidePanel`);
    if (!enabled) return;

    // Wait for PDF to load, then add menu
    setTimeout(() => this.createMenu(), 500);
  }

  private createMenu() {
    const readerWindow = this.reader?._iframeWindow;
    if (!readerWindow) return;

    const container = readerWindow.document.querySelector(".viewerContainer");
    if (!container) return;

    // Remove existing menu
    readerWindow.document.getElementById(MENU_ID)?.remove();

    const menu = readerWindow.document.createElement("div");
    menu.id = MENU_ID;
    menu.innerHTML = this.getMenuHTML();
    this.menu = menu;
    this.applyStyles(readerWindow.document);
    container.appendChild(menu);
    this.bindEvents();
  }

  private getMenuItems(): QuickMenuItem[] {
    return [
      {
        icon: "📄",
        label: "Summarize Page",
        action: async () => this.summarizePage(),
      },
      {
        icon: "🌐",
        label: "Translate Page",
        action: async () => this.translatePage(),
      },
      {
        icon: "📝",
        label: "Summarize Selection",
        action: async () => this.summarizeSelection(),
      },
      {
        icon: "💡",
        label: "Explain Selection",
        action: async () => this.explainSelection(),
      },
    ];
  }

  private getMenuHTML(): string {
    const items = this.getMenuItems();
    return items.map((item, i) => `
      <button class="quick-menu-btn" data-index="${i}" title="${item.label}">
        ${item.icon}
      </button>
    `).join("");
  }

  private applyStyles(doc: Document) {
    let style = doc.getElementById(`${MENU_ID}-style`);
    if (!style) {
      style = doc.createElement("style");
      style.id = `${MENU_ID}-style`;
      doc.head.appendChild(style);
    }

    style.textContent = `
      #${MENU_ID} {
        position: fixed;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 9999;
        background: rgba(255, 255, 255, 0.95);
        padding: 8px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.15);
      }
      #${MENU_ID} .quick-menu-btn {
        width: 36px;
        height: 36px;
        border: none;
        background: #f5f5f5;
        border-radius: 6px;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      #${MENU_ID} .quick-menu-btn:hover {
        background: #e3f2fd;
        transform: scale(1.1);
      }
      #${MENU_ID} .quick-menu-btn:active {
        transform: scale(0.95);
      }
      #${MENU_ID} .quick-menu-btn.loading {
        opacity: 0.5;
        pointer-events: none;
      }
    `;
  }

  private bindEvents() {
    if (!this.menu) return;

    const items = this.getMenuItems();
    this.menu.querySelectorAll(".quick-menu-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const index = parseInt((e.target as HTMLElement).dataset.index || "0");
        const item = items[index];
        if (item) {
          (e.target as HTMLElement).classList.add("loading");
          try {
            await item.action();
          } catch (err: any) {
            this.showToast(`Error: ${err.message}`);
          }
          (e.target as HTMLElement).classList.remove("loading");
        }
      });
    });
  }

  private async summarizePage() {
    const pageText = await this.getCurrentPageText();
    if (!pageText) {
      this.showToast("No text found on current page");
      return;
    }
    await this.sendToGPT("Summarize this page concisely:\n\n" + pageText);
  }

  private async translatePage() {
    const pageText = await this.getCurrentPageText();
    if (!pageText) {
      this.showToast("No text found on current page");
      return;
    }
    await this.sendToGPT("Translate to Chinese:\n\n" + pageText);
  }

  private async summarizeSelection() {
    const selection = await Meet.Zotero.getPDFSelection();
    if (!selection) {
      this.showToast("Please select text first");
      return;
    }
    await this.sendToGPT("Summarize this text concisely:\n\n" + selection);
  }

  private async explainSelection() {
    const selection = await Meet.Zotero.getPDFSelection();
    if (!selection) {
      this.showToast("Please select text first");
      return;
    }
    await this.sendToGPT("Explain this in simple terms:\n\n" + selection);
  }

  private async getCurrentPageText(): Promise<string> {
    try {
      const pageIndex = this.reader?._state?.pageIndex || 0;
      const pdfDocument = this.reader?._internalReader?._primaryView?._pdfView?._pdfDocument;
      if (!pdfDocument) return "";

      const page = await pdfDocument.getPage(pageIndex + 1);
      const textContent = await page.getTextContent();
      return textContent.items.map((item: any) => item.str).join(" ");
    } catch {
      return "";
    }
  }

  private async sendToGPT(prompt: string) {
    try {
      // Open side panel if not open
      const readerPanel = Zotero[config.addonInstance]?.readerPanel;
      if (readerPanel && !readerPanel.panel) {
        readerPanel.togglePanel?.();
      }

      // Show in panel or popup
      const response = await Meet.OpenAI.getGPTResponse(prompt);

      // Try to show in reader panel
      if (readerPanel?.showOutput) {
        readerPanel.showOutput(prompt.slice(0, 100) + "...", "user");
        readerPanel.showOutput(response, "assistant");
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(response);
        this.showToast("Response copied to clipboard");
      }
    } catch (err: any) {
      this.showToast(`Error: ${err.message}`);
    }
  }

  private showToast(message: string) {
    const readerWindow = this.reader?._iframeWindow;
    if (!readerWindow) return;

    let toast = readerWindow.document.getElementById(`${MENU_ID}-toast`);
    if (!toast) {
      toast = readerWindow.document.createElement("div");
      toast.id = `${MENU_ID}-toast`;
      toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s;
      `;
      readerWindow.document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";
    setTimeout(() => {
      toast!.style.opacity = "0";
    }, 3000);
  }

  destroy() {
    this.menu?.remove();
    this.menu = null;
  }
}
