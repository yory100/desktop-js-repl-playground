import JsonStore from './JsonStore';

const path = require("path");
const fs = require('fs');

const TEMP_FILE = path.join(__dirname, '/temp');
let TEMP_PATH = TEMP_FILE + ".js";
export default class FileSys {

  static updateFileSysPath() {
    const extension = JsonStore.getPropVal("file-extension");
    TEMP_PATH = `${TEMP_FILE}.${extension}`;
    console.log("updateFileSysPath -> ",{TEMP_PATH, TEMP_FILE, extension})
    JsonStore.pushOrUpdate("current-path", TEMP_PATH);
  }

  static readTempFile(prevPath) {
    let res = '';
    const path = prevPath || TEMP_PATH;
    console.log("readTempFile -> ", {TEMP_PATH, prevPath, path} )
    if (fs.existsSync(path)) {
      res = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
    }
    console.log("readTempFile -> ", {res} )
    return res;
  }

  static async writeTempFile(newCodeValue) {
    console.log("writeTempFile -> ", {TEMP_PATH, newCodeValue} )
    JsonStore.pushOrUpdate("current-path", TEMP_PATH);
    await fs.promises.writeFile(TEMP_PATH, newCodeValue, { flag: 'w+' });
  }

  static readOrCreateFile(filePath) {
    let res = '';
    if (fs.existsSync(filePath)) {
      res = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
    }
    else {
      fs.writeFile(filePath, '', { encoding: 'utf8', flag: 'w+' }, (err) => { });
    }
    return res;
  }

  static getDefaultFilePath() { return TEMP_PATH; }

}