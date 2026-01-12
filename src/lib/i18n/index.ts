/**
 * i18n - Internationalization System
 * 
 * Provides multi-language support for Jewelshot
 * Currently supports: English (en), Turkish (tr)
 */

export { translations, en, tr } from './translations';
export type { Language, TranslationKeys, Translations } from './types';
export { LanguageProvider, useLanguage, AVAILABLE_LANGUAGES } from './LanguageContext';
