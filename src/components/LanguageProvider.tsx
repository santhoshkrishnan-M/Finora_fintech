'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useLanguageStore } from '@/store/languageStore';
import { ReactNode, useEffect, useState } from 'react';

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const { locale } = useLanguageStore();
  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    // Dynamically load translation messages
    import(`@/i18n/messages/${locale}.json`)
      .then((module) => setMessages(module.default))
      .catch(() => import('@/i18n/messages/en.json').then((module) => setMessages(module.default)));
  }, [locale]);

  if (!messages) {
    return <div>{children}</div>; // Return children while loading
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
