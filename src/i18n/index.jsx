import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import zh_TW from './locales/zh_TW.json';
import zh_CN from './locales/zh_CN.json';
import en from './locales/en.json';
import ja_JP from './locales/ja_JP.json';

const I18nContext = createContext();

const builtinLocales = {
  zh_TW: { name: '繁體中文', data: zh_TW },
  zh_CN: { name: '简体中文', data: zh_CN },
  en: { name: 'English', data: en },
  ja_JP: { name: '日本語', data: ja_JP }
};

// Helper to normalize language codes (e.g., 'zh_tw', 'zh-tw' => 'zh_TW')
const normalizeCode = (code) => {
  if (!code) return 'zh_TW';
  const c = String(code).replace('-', '_');
  if (c.toLowerCase() === 'zh_tw') return 'zh_TW';
  if (c.toLowerCase() === 'en' || c.toLowerCase() === 'en_us') return 'en';
  return c;
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

  // addCustomLocale with Code Normalization to prevent duplicate 'zh_TW' / 'zh_tw'
  const addCustomLocale = useCallback((code, name, jsonObject) => {
    const normCode = normalizeCode(code);

    // If it's a builtin code, merge item_names into builtin data instead of creating a duplicate key
    if (builtinLocales[normCode]) {
      setCustomLocales(prev => ({
        ...prev,
        [normCode]: {
          name: builtinLocales[normCode].name,
          data: {
            ...builtinLocales[normCode].data,
            ...jsonObject,
            item_names: {
              ...(builtinLocales[normCode].data.item_names || {}),
              ...(jsonObject.item_names || {})
            }
          }
        }
      }));
    } else {
      setCustomLocales(prev => ({
        ...prev,
        [normCode]: { name, data: jsonObject }
      }));
    }
  }, []);

  const removeCustomLocale = useCallback((code) => {
    const normCode = normalizeCode(code);
    setCustomLocales(prev => {
      const next = { ...prev };
      delete next[normCode];
      return next;
    });
    if (currentLang === normCode) {
      setCurrentLang('zh_TW');
    }
  }, [currentLang]);

  const availableLocales = useMemo(() => {
    const merged = { ...builtinLocales };
    for (const [k, v] of Object.entries(customLocales)) {
      const normK = normalizeCode(k);
      if (builtinLocales[normK]) {
        merged[normK] = {
          name: builtinLocales[normK].name,
          data: {
            ...builtinLocales[normK].data,
            ...(v.data || {}),
            item_names: {
              ...(builtinLocales[normK].data.item_names || {}),
              ...(v.data?.item_names || {})
            }
          }
        };
      } else {
        merged[normK] = v;
      }
    }
    return merged;
  }, [customLocales]);

  const t = useCallback((keyPath, params = {}) => {
    const normLang = normalizeCode(currentLang);
    const activeData = availableLocales[normLang]?.data || builtinLocales.zh_TW.data;
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
  }, [currentLang, availableLocales]);

  const contextValue = useMemo(() => ({
    currentLang: normalizeCode(currentLang),
    setCurrentLang,
    availableLocales,
    addCustomLocale,
    addCustomLanguage: addCustomLocale,
    removeCustomLocale,
    t
  }), [currentLang, availableLocales, addCustomLocale, removeCustomLocale, t]);

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
