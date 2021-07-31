import React, { useState } from 'react';

import runCode from './util/runcode';
import SideFiles from './components/SideFiles';
import FileManager from './util/FileManager';
import CodeEditor from './components/CodeEditor';
import CodeOutput from './components/CodeOutput';
import LangThemeFont from './util/LangFonSize';
import Footer from './components/Footer';
import FileSys from './util/FileSys';
import js_beautify from 'js-beautify';

import Split from 'react-split';
let ipcRenderer = require('electron').ipcRenderer;

export default function App () {

  const [codeVal, setCodeVal] = useState(FileSys.readTempFile());
  const [codeResult, setCodeResult] = useState('');
  const [codeError, setCodeError] = useState('');

  const [fontSize, setFontSize] = useState(LangThemeFont.getStoreFontSize());
  const [lang, setLang] = useState(LangThemeFont.getStoreLang());
  const [theme, setTheme] = useState(LangThemeFont.getStoreTheme());

  const [btnRunIsClicked, setBtnRunIsClicked] = useState(false);

  async function onEditorChange (newValue) {
    setCodeVal(newValue);
    await FileSys.writeTempFile(newValue);
  }


  React.useEffect(() => {
    FileSys.updateFileSysPath();
    // FileSys.writeTempFile(FileSys.readTempFile())
    ipcRenderer.on('run-code', () => {
      setBtnRunIsClicked(true);

      runCode().then(result => {
        setCodeResult(result);
        setCodeError('');
        if (result && result.length > 0) setBtnRunIsClicked(false);
      })
        .catch(e => {
          setCodeError(e);
          setCodeResult('');
          if (e && e.length > 0) setBtnRunIsClicked(false);
        });
    });

    ipcRenderer.on('new-file', async (channel) => {
      setCodeVal('');
    });

    ipcRenderer.on('save-as-file', async () => {
      await FileManager.saveAs();
    });
  }, []);

  const updateFont = (e) => {
    setFontSize(+e.target.value);
    LangThemeFont.updateFontSize(+e.target.value);
  }

  const selectLang = (e) => {
    setLang(e);
    LangThemeFont.updateLang(e);
    LangThemeFont.updateExtension(FileManager.getExtensionFromLang(e));
    const fileContent = FileSys.readTempFile();
    FileSys.updateFileSysPath();
    FileSys.writeTempFile(fileContent);
  }

  const changeTheme = (e) => {
    setTheme(e.target.value);
    LangThemeFont.updateTheme(e.target.value);
  }

  const formatCode = () => {
    if (codeVal && codeVal.length > 4) {
      if (lang === 'javascript' || lang === 'typescript' || lang === 'html' || lang === 'java' || lang === 'c_pp') {
        if (lang === 'html') {
          setCodeVal(js_beautify.html(codeVal));
        }
        else setCodeVal(js_beautify.js(codeVal, { indent_size: 2, space_in_empty_paren: true }));
      }
    }
  }

  return (
    <>
      <div className="container">

        <Split
          sizes={[17, 60, 24]}
          direction="horizontal"
          cursor="col-resize"
        >
          <SideFiles
            setCodeVal={setCodeVal}
            selectLang={selectLang}
          />

          <CodeEditor
            codeVal={codeVal}
            onChange={onEditorChange}
            fontSize={fontSize}
            mode={lang}
            theme={theme}
            nameId="ace-editor-col"
          />

          <CodeOutput
            codeError={codeError}
            codeResult={codeResult}
            fontSize={fontSize}
            language={lang}
            codeVal={codeVal}
            theme={theme}
            btnRunIsClicked={btnRunIsClicked}
          />
        </Split>
      </div>

      <Footer
        updateFont={updateFont}
        fontSize={fontSize}
        lang={lang}
        selectLang={selectLang}
        changeTheme={changeTheme}
        theme={theme}
      >
        <div className="info-configs p-left">{lang}</div>
        <div className="info-configs p-left">{fontSize + 'px'}</div>
        <div className="info-configs p-left">{theme}</div>
        <div className="info-configs p-left btn-format" onClick={formatCode}>Format code</div>
      </Footer>
    </>);
}