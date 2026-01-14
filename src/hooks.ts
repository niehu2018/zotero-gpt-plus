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
  Zotero[config.addonInstance].views = new Views();
  Zotero[config.addonInstance].utils = new Utils();
  Zotero[config.addonInstance].prefs = new Preferences();
  Zotero[config.addonInstance].readerPanel = new ReaderPanel();
  Zotero[config.addonInstance].pdfQuickMenu = new PDFQuickMenu();
  Zotero[config.addonInstance].annotationHandler = new AnnotationHandler();

  // Register preference pane
  Zotero.PreferencePanes.register({
    pluginID: config.addonID,
    src: `chrome://${config.addonRef}/content/preferences.xhtml`,
    label: config.addonName,
    image: `chrome://${config.addonRef}/content/icons/favicon.png`,
  });
}

function onShutdown(): void {
  ztoolkit.unregisterAll();
  // Remove addon object
  addon.data.alive = false;
  delete Zotero[config.addonInstance];
}

export default {
  onStartup,
  onShutdown,
};
