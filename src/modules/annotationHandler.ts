import { config } from "../../package.json";
import Meet from "./Meet/api";

export default class AnnotationHandler {
  private notifierID: string | null = null;

  constructor() {
    this.registerNotifier();
  }

  private registerNotifier() {
    // Register for annotation changes
    this.notifierID = Zotero.Notifier.registerObserver(
      {
        notify: async (event: string, type: string, ids: (number | string)[]) => {
          if (type !== "item" || event !== "add") return;

          const autoInsert = Zotero.Prefs.get(`${config.addonRef}.autoInsertAnnotation`);
          if (!autoInsert) return;

          for (const id of ids) {
            await this.handleNewAnnotation(Number(id));
          }
        },
      },
      ["item"],
      "ZoteroGPTPlus-AnnotationHandler"
    );
  }

  private async handleNewAnnotation(itemID: number) {
    try {
      const item = await Zotero.Items.getAsync(itemID);
      if (!item || !item.isAnnotation?.()) return;

      // Get annotation text
      const text = item.annotationText;
      if (!text || text.length < 10) return; // Skip very short annotations

      // Check if comment is already set
      const existingComment = item.annotationComment;
      if (existingComment && existingComment.trim()) return;

      // Get GPT response for this annotation
      const annotationType = item.annotationType;
      let prompt = "";

      if (annotationType === "note") {
        prompt = `Expand on this note with additional context (1-2 sentences):\n\n"${text}"`;
      } else {
        // For highlight, image, ink types - just explain/summarize
        prompt = `Briefly explain or summarize this text (1-2 sentences):\n\n"${text}"`;
      }

      // Get GPT response
      const response = await Meet.OpenAI.getGPTResponse(prompt);

      // Set annotation comment
      item.annotationComment = response;
      await item.saveTx();

      // Show notification
      this.showNotification("GPT comment added to annotation");
    } catch (err: any) {
      Zotero.debug(`[ZoteroGPTPlus] Error processing annotation: ${err.message}`);
    }
  }

  private showNotification(message: string) {
    const progressWindow = new ztoolkit.ProgressWindow(config.addonName);
    progressWindow.createLine({ text: message, type: "success" });
    progressWindow.show();
    progressWindow.startCloseTimer(2000);
  }

  destroy() {
    if (this.notifierID) {
      Zotero.Notifier.unregisterObserver(this.notifierID);
      this.notifierID = null;
    }
  }
}
