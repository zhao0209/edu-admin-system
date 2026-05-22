import React, { createContext, useState, useContext } from 'react';
import zh from './locales/zh';
import ru from './locales/ru';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('ru');
  const translations = { zh, ru };

  const t = (key) => translations[locale][key] || key;
  const toggleLanguage = () => setLocale(prev => prev === 'zh' ? 'ru' : 'zh');

  return (
    <LanguageContext.Provider value={{ locale, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}