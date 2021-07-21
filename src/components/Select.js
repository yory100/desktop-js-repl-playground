import React from 'react';
import LangThemeFont from '../util/LangFonSize'

export default function Select({ items, onChange }) {
  return (
    <select onChange={onChange} defaultValue={LangThemeFont.getStoreLang()}>
      {items.map(item => <option value={item} key={item}>{item}</option>)}
    </select>
  );
}