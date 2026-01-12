'use client';

/**
 * Language Context & Provider
 * 
 * Provides language state and translation functions throughout the app
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Language, TranslationKeys } from './types';
import { translations } from './translations';

// Storage key for language preference
const LANGUAGE_STORAGE_KEY = 'jewelshot_language';

// Default language
const DEFAULT_LANGUAGE: Language = 'en';

// Context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
  isLoaded: boolean;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider props
interface LanguageProviderProps {
  children: React.ReactNode;
}

/**
 * Language Provider Component
 */
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && (stored === 'en' || stored === 'tr')) {
        setLanguageState(stored as Language);
      } else {
        // Try to detect browser language
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'tr') {
          setLanguageState('tr');
        }
      }
    } catch {
      // localStorage might not be available (SSR)
    }
    setIsLoaded(true);
  }, []);

  // Set language and persist to localStorage
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      // Update document lang attribute for accessibility
      document.documentElement.lang = lang;
    } catch {
      // localStorage might not be available
    }
  }, []);

  // Get current translations
  const t = useMemo(() => translations[language], [language]);

  // Update document lang on language change
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.lang = language;
    }
  }, [language, isLoaded]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    isLoaded,
  }), [language, setLanguage, t, isLoaded]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to access language context
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    // Return default values for SSR or when provider is not mounted
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => {},
      t: translations[DEFAULT_LANGUAGE],
      isLoaded: false,
    };
  }
  
  return context;
}

/**
 * Available languages configuration
 */
export const AVAILABLE_LANGUAGES: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
];
