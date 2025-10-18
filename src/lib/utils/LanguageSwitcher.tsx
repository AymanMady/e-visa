"use client";
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];

  const currentLanguage = languages.find(lang => lang.code === router.locale) || languages[0];

  const changeLanguage = (locale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        aria-label="language switcher"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-2 dark:bg-dark-bg flex cursor-pointer items-center justify-center rounded-full text-black dark:text-white px-3 py-2 text-sm"
      >
        <span className="hidden sm:block">{currentLanguage.code.toUpperCase()}</span>
        <svg
          className={`ml-1 h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg dark:bg-black border border-gray-200 dark:border-gray-700 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`flex w-full items-center px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${
                router.locale === language.code ? ' text-primary' : ''
              }`}
            >
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;