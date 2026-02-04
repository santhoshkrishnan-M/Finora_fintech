'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/languageStore';
import { useAuthStore } from '@/store/authStore';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguageStore();
  const { user, token } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = async (langCode: string) => {
    setLocale(langCode);
    setIsOpen(false);
    
    // If user is authenticated and has profile, update in database
    if (user && user.hasProfile && token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/profile/language`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ language: langCode })
        });
      } catch (error) {
        console.error('Failed to update language in profile:', error);
      }
    }
  };

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-w-[120px]"
      >
        <span>{currentLanguage.name}</span>
        <span className="text-xs">▼</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 ${
                  locale === lang.code ? 'bg-blue-50 text-primary font-medium' : ''
                }`}
              >
                <span>{lang.name}</span>
                {locale === lang.code && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
