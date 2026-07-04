"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/language-context";

export function HtmlLangUpdater() {
  const { locale } = useLanguage();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}
