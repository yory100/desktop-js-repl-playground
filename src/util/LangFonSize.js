import JsonStore from './JsonStore';

export default class LangThemeFont {
  // font size: 14
  static getStoreFontSize () {
    return parseInt(JsonStore.getPropVal('font-size'), 10) || 14;
  }

  static updateFontSize (newFontSize) {
    JsonStore.pushOrUpdate('font-size', newFontSize);
  }
  // language : javascript
  static getStoreLang () {
    return JsonStore.getPropVal('language') || 'language';
  }

  static updateLang (newLang) {
    JsonStore.pushOrUpdate('language', newLang);
  }

  static updateExtension (newExtension) {
    JsonStore.pushOrUpdate('file-extension', newExtension);
  }
  // theme: monokai
  static getStoreTheme () {
    return JsonStore.getPropVal('theme') || 'monokai';
  }

  static updateTheme (newTheme) {
    JsonStore.pushOrUpdate('theme', newTheme);
  }
}