import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSavedLanguage, saveLanguage } from '@/database/appstate';

type Language = 'en' | 'es';

type TranslationKey = keyof typeof translations.en;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const translations = {
  en: {
    choose_language_title: 'Please choose a language',
    english: 'English',
    spanish: 'Spanish',
    continue: 'Continue',
  },
  es: {
    choose_language_title: 'Por favor, elija un idioma',
    english: 'Ingles',
    spanish: 'Espanol',
    continue: 'Continuar',
  },
} as const;

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const loadLanguage = async () => {
      const saved = await getSavedLanguage();
      if (saved) {
        setLanguageState(saved);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    void saveLanguage(nextLanguage);
  };

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      setLanguage,
      t: (key: TranslationKey) => translations[language][key],
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
};
