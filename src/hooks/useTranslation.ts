import { useState, useCallback } from 'react';
import { translations } from '../data/translations';
import { Language } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useTranslation() {
  const [language, setLanguage] = useLocalStorage<Language>('language', 'en');

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  const changeLanguage = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
  }, [setLanguage]);

  return {
    t,
    language,
    changeLanguage
  };
}