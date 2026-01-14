import { config } from "../package.json";
import { getString, initLocale } from "./modules/locale";
import Views from "./modules/views";
import Utils from "./modules/utils";
import Preferences from "./modules/preferences";
import ReaderPanel from "./modules/readerPanel";
import PDFQuickMenu from "./modules/pdfQuickMenu";
import AnnotationHandler from "./modules/annotationHandler";

async function onStartup() {
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ]);
  initLocale();
  ztoolkit.ProgressWindow.setIconURI(
    "default",
    `chrome://${config.addonRef}/content/icons/favicon.png`
  );

  // Initialize modules
  try { Zotero[config.addonInstance].views = new Views(); } catch (e) { Zotero.logError(e); }
  try { Zotero[config.addonInstance].utils = new Utils(); } catch (e) { Zotero.logError(e); }
  try { Zotero[config.addonInstance].prefs = new Preferences(); } catch (e) { Zotero.logError(e); }
  try { Zotero[config.addonInstance].readerPanel = new ReaderPanel(); } catch (e) { Zotero.logError(e); }
  try { Zotero[config.addonInstance].pdfQuickMenu = new PDFQuickMenu(); } catch (e) { Zotero.logError(e); }
  try { Zotero[config.addonInstance].annotationHandler = new AnnotationHandler(); } catch (e) { Zotero.logError(e); }

  // Register preference pane (Zotero 7+)
  if (Zotero.PreferencePanes) {
    Zotero.PreferencePanes.register({
      pluginID: config.addonID,
      src: `chrome://${config.addonRef}/content/preferences.xhtml`,
      label: config.addonName,
      image: `chrome://${config.addonRef}/content/icons/favicon.png`,
    });
  }
}

function onShutdown(): void {
  ztoolkit.unregisterAll();
  // Remove addon object
  addon.data.alive = false;
  delete Zotero[config.addonInstance];
}

function onPrefsEvent(event: string): void {
  try {
    if (event === "load" || event === "show") {
      Zotero[config.addonInstance].prefs?.init();
    }
  } catch (e) {
    Zotero.logError(e);
  }
}

export default {
  onStartup,
  onShutdown,
  onPrefsEvent,
};
