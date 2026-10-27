/**
 * Language Context & Translation Provider
 * Supports real-time switching between Vietnamese and English.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '../types';
import { storageService } from '../services/storageService';
import { TranslationKey, translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  toggleLanguage: () => Promise<void>;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    storageService.getLanguage().then(setLanguageState);
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await storageService.saveLanguage(lang);
  };

  const toggleLanguage = async () => {
    const nextLang: Language = language === 'vi' ? 'en' : 'vi';
    await setLanguage(nextLang);
  };

  const t = (key: TranslationKey): string => {
    const langDict = translations[language] || translations.vi;
    return langDict[key] || translations.vi[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
