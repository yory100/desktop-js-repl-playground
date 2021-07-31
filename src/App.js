import React, { useState } from 'react';
import Tabs from "react-draggable-tabs"
import TabsContent from "./TabsContent";
import LangThemeFont from './util/LangFonSize';
import js_beautify from 'js-beautify';
import Footer from './components/Footer';

export default function App() {

	const [fontSize, setFontSize] = useState(LangThemeFont.getStoreFontSize());
	const [lang, setLang] = useState(LangThemeFont.getStoreLang());
	const [theme, setTheme] = useState(LangThemeFont.getStoreTheme());

	const [tabs, setTabs] = useState([
		{
			id: 1,
			content: "Cute Cat",
			active: true,
			display: <TabsContent fontSize={fontSize} lang={lang} theme={theme} />
		}
	])

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
			<Tabs tabs={tabs}>
				<button onClick={() => ""}>+</button>
			</Tabs>
			{tabs[0].display}
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
		</>
	);
}