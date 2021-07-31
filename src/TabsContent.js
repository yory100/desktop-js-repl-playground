import React, { useState } from 'react';

import runCode from './util/runcode';
import SideFiles from './components/SideFiles';
import FileManager from './util/FileManager';
import CodeEditor from './components/CodeEditor';
import CodeOutput from './components/CodeOutput';
import FileSys from './util/FileSys';

import Split from 'react-split';
let ipcRenderer = require('electron').ipcRenderer;

export default function TabsContent({ fontSize, lang, theme }) {

    const [codeVal, setCodeVal] = useState(FileSys.readTempFile());
    const [codeResult, setCodeResult] = useState('');
    const [codeError, setCodeError] = useState('');
    const [btnRunIsClicked, setBtnRunIsClicked] = useState(false);

    async function onEditorChange(newValue) {
        setCodeVal(newValue);
        await FileSys.writeTempFile(newValue);
    }


    React.useEffect(() => {
        FileSys.updateFileSysPath();
        FileSys.writeTempFile(FileSys.readTempFile())
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

    return (
        <div className="container">
            <Split
                sizes={[70, 30]}
                direction="horizontal"
                cursor="col-resize"
            >
                {/* <SideFiles
						setCodeVal={setCodeVal}
						selectLang={selectLang}
					/> */}

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
    );
}