
import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';

type Language = 'en' | 'ar';

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const translations = {
  en: {
    appTitle: "Cheque Printer",
    selectBank: "Select Bank",
    selectTemplate: "Select Cheque Template",
    chequeInfo: "Cheque Information",
    payeeName: "Payee Name",
    amountDigits: "Amount (Digits)",
    amountWords: "Amount (Words)",
    date: "Date",
    signature: "Signature",
    printCheque: "Print Cheque",
    resetLayout: "Reset Layout",
    printOffsetX: "Print Offset X (mm)",
    printOffsetY: "Print Offset Y (mm)",
    previewMode: "Preview Mode",
    fieldProperties: "Field Properties",
    fontSize: "Font Size",
    fontWeight: "Font Weight",
    textAlign: "Text Alignment",
    exportTemplate: "Export Template",
    importTemplate: "Import Template",
    normal: "Normal",
    bold: "Bold",
    left: "Left",
    center: "Center",
    right: "Right",
    selectField: "Select a field to edit",
    noFieldSelected: "No field selected",
  },
  ar: {
    appTitle: "طباعة الشيكات",
    selectBank: "اختر البنك",
    selectTemplate: "اختر نموذج الشيك",
    chequeInfo: "معلومات الشيك",
    payeeName: "اسم المستفيد",
    amountDigits: "المبلغ (أرقام)",
    amountWords: "المبلغ (حروف)",
    date: "التاريخ",
    signature: "التوقيع",
    printCheque: "طباعة الشيك",
    resetLayout: "إعادة ضبط التصميم",
    printOffsetX: "إزاحة الطباعة الأفقية (مم)",
    printOffsetY: "إزاحة الطباعة الرأسية (مم)",
    previewMode: "وضع المعاينة",
    fieldProperties: "خصائص الحقل",
    fontSize: "حجم الخط",
    fontWeight: "سمك الخط",
    textAlign: "محاذاة النص",
    exportTemplate: "تصدير القالب",
    importTemplate: "استيراد القالب",
    normal: "عادي",
    bold: "غامق",
    left: "يسار",
    center: "وسط",
    right: "يمين",
    selectField: "اختر حقل للتعديل",
    noFieldSelected: "لم يتم اختيار حقل",
  },
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      return savedLang;
    }
    return 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};
