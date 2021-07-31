import JsonStore from "./JsonStore";
import FileSys from "./FileSys";

const path = require("path");
const fs = require('fs');
const { dialog } = require('electron').remote;

let currentFilePath = __dirname + '/temp';

const LANG_EXT = [
  { ext: '.txt', lang: 'text' },
  { ext: '.js', lang: 'javascript' },
  { ext: '.ts', lang: 'typescript' },
  { ext: '.py', lang: 'python' },
  { ext: '.html', lang: 'html' },
  { ext: '.go', lang: 'golang' },
  { ext: '.java', lang: 'java' },
  { ext: '.c', lang: 'c_cpp' },
  { ext: '.md', lang: 'text' }
];

export default class FileManager {

  static async loadFile () {

    let result = await dialog.showOpenDialog();
    let fileContent = '', fileName = '';

    currentFilePath = result.filePaths[0];

    if (!result.canceled) {
      fileName = path.basename(currentFilePath);
      fileContent = FileSys.readOrCreateFile(currentFilePath);
      await this.updateFileInfos(currentFilePath, fileName, fileContent);
    }
    return { fileName, fileContent, filePath: currentFilePath };
  }

  static async updateFileInfos (filePath, fileName, fileContent) {
    if (fileName) {
      JsonStore.pushOrUpdate("language", this.getLangFromExt(fileName));
      JsonStore.pushOrUpdate("current-path", filePath);
      JsonStore.pushOrUpdate("filename", fileName);

      await FileSys.writeTempFile(fileContent);
    }
  }

  // get language from file using extension: .js - .ts - .html - .py
  static getLangFromExt (fileName) {
    let language = 'text';
    if (fileName) {
      let fileExtension = path.extname(fileName);
      if (fileExtension) { language = LANG_EXT.find(l => l.ext === fileExtension).lang; }
    }
    return language;
  }

  static getExtensionFromLang (lang) {
    let ext = 'md';
    if (lang) {
      ext = LANG_EXT.find(l => l.lang === lang).ext;
    }

    return ext;
  }

  static async saveAs () {
    try {
      let result = await dialog.showSaveDialog();
      if (!result.canceled) {
        currentFilePath = result.filePath;

        let codeVal = FileSys.readTempFile();

        await fs.promises.writeFile(currentFilePath, codeVal, { flag: 'w' });
        JsonStore.pushOrUpdate("filename", path.basename(currentFilePath));
        JsonStore.pushOrUpdate("current-path", currentFilePath);
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async saveCurrent () {
    currentFilePath = JsonStore.getPropVal("current-path");
    let codeVal = FileSys.readTempFile();
    await fs.promises.writeFile(currentFilePath, codeVal, { flag: 'w' });
    return 'The file has been saved!';
  }

  // add loaded files into the store
  static updateFilesToStore (currentFilePath, fileName) {
    let listFiles = this.getFilesFromStore();
    if (!listFiles.some(f => f.fileName === fileName)) {
      listFiles.push({ fileName, currentFilePath });
      JsonStore.pushOrUpdate('files', listFiles);
    }
    return listFiles;
  }

  static getFilesFromStore () {
    return JsonStore.getPropVal('files') || [];
  }

  // remove file ,update  store / side files (ui)
  static removeFileFromStore (filename) {
    let listFiles = this.getFilesFromStore();
    let tmp = [];
    tmp = listFiles.filter(f => f.fileName !== filename);
    JsonStore.pushOrUpdate('files', tmp);
    return tmp;
  }
}