import React, { createContext, useContext, useState, useEffect } from 'react';
import zh_TW from './locales/zh_TW.json';
import en from './locales/en.json';

const I18nContext = createContext();

const builtinLocales = {
  zh_TW: { name: '繁體中文', data: zh_TW },
  en: { name: 'English', data: en }
};

export const I18nProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('dme_lang') || 'zh_TW';
  });

  const [customLocales, setCustomLocales] = useState(() => {
    try {
      const saved = localStorage.getItem('dme_custom_locales');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('dme_lang', currentLang);
  }, [currentLang]);

  useEffect(() => {
    localStorage.setItem('dme_custom_locales', JSON.stringify(customLocales));
  }, [customLocales]);

  const addCustomLocale = (code, name, jsonObject) => {
    setCustomLocales(prev => ({
      ...prev,
      [code]: { name, data: jsonObject }
    }));
    setCurrentLang(code);
  };

  const removeCustomLocale = (code) => {
    setCustomLocales(prev => {
      const next = { ...prev };
      delete next[code];
      return next;
    });
    if (currentLang === code) {
      setCurrentLang('zh_TW');
    }
  };

  const availableLocales = {
    ...builtinLocales,
    ...customLocales
  };

  const t = (keyPath, params = {}) => {
    const activeData = availableLocales[currentLang]?.data || builtinLocales.zh_TW.data;
    const keys = keyPath.split('.');
    let val = activeData;
    
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k];
      } else {
        // Fallback to zh_TW
        let fallback = builtinLocales.zh_TW.data;
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return keyPath;
          }
        }
        val = fallback;
        break;
      }
    }

    if (typeof val === 'string') {
      return val.replace(/\{\{(\w+)\}\}/g, (_, k) => params[k] !== undefined ? params[k] : `{{${k}}}`);
    }
    return val || keyPath;
  };

  return (
    <I18nContext.Provider value={{
      currentLang,
      setCurrentLang,
      availableLocales,
      addCustomLocale,
      removeCustomLocale,
      t
    }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
