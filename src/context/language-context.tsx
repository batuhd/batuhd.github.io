"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { translations, type Locale } from "@/config/translations";

const SUPPORTED_LOCALES: Locale[] = ["tr", "en", "de", "es"];

function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "tr";
  const browserLang = navigator.language.toLowerCase();
  const exact = SUPPORTED_LOCALES.find((l) => browserLang === l);
  if (exact) return exact;
  const prefix = browserLang.split("-")[0];
  return SUPPORTED_LOCALES.find((l) => l === prefix) || "tr";
}

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getLocalized: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: Record<string, any> | null | undefined,
    field: string,
    fallback?: string
  ) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("tr");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && translations[saved]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(saved);
    } else {
      const detected = detectBrowserLocale();
      setLocaleState(detected);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    let text = translations[locale]?.[key] || translations.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  /**
   * Get a localized field from a Supabase item.
   * Tries `field_locale` first, falls back to `field`.
   * Example: getLocalized(project, "title") → project.title_tr || project.title
   */
  const getLocalized = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: Record<string, any> | null | undefined,
    field: string,
    fallback = ""
  ) => {
    if (!item) return fallback;
    if (locale !== "en") {
      const localizedKey = `${field}_${locale}`;
      if (item[localizedKey] && String(item[localizedKey]).trim()) {
        return String(item[localizedKey]);
      }
    }
    return String(item[field] || fallback);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
