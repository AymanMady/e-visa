"use client";
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const CurrentLanguage = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', icon: 'fr' },
    { code: 'en', name: 'English', flag: '🇺🇸', icon: 'en' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', icon: 'ar' }
  ];

  const currentLanguage = languages.find(lang => lang.code === router.locale) || languages[0];

  // Icône SVG pour la langue
  const LanguageIcon = () => (
    <svg 
      className="w-4 h-4 mr-2" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
      />
    </svg>
  );

  return (
    <div className="flex items-center text-sm font-medium">
      <LanguageIcon />
      <span className="mr-1">{currentLanguage.flag}</span>
      <span>{currentLanguage.name}</span>
    </div>
  );
};

export default CurrentLanguage;