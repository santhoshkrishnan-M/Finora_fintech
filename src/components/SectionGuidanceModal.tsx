'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore } from '@/store/languageStore';
import { fridayApi } from '@/lib/api';

interface SectionGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionType: string;
  sectionTitle: string;
}

export default function SectionGuidanceModal({
  isOpen,
  onClose,
  sectionType,
  sectionTitle,
}: SectionGuidanceModalProps) {
  const t = useTranslations();
  const [guidance, setGuidance] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuthStore();
  const { locale: language } = useLanguageStore();

  useEffect(() => {
    if (isOpen && sectionType && token) {
      loadGuidance();
    }
  }, [isOpen, sectionType]);

  const loadGuidance = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fridayApi.getGuidance(token!, sectionType, language);
      setGuidance(response.guidance);
    } catch (err) {
      console.error('Failed to load guidance:', err);
      setError(t('guidance.failed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <Card className="max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <CardHeader className="bg-primary text-white">
          <div className="flex justify-between items-center">
            <CardTitle>{sectionTitle}</CardTitle>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-gray-100 mt-1">
            {t('guidance.personalizedFrom')}
          </p>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-pulse text-gray-400 mb-2">
                  {t('guidance.generating')}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              {error}
              <Button
                onClick={loadGuidance}
                variant="outline"
                className="mt-3"
              >
                {t('guidance.retry')}
              </Button>
            </div>
          )}

          {!isLoading && !error && guidance && (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {guidance}
              </div>
            </div>
          )}
        </CardContent>

        <div className="border-t p-4 flex justify-end">
          <Button onClick={onClose} variant="outline">
            {t('guidance.close')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
