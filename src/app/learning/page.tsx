'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SectionGuidanceModal from '@/components/SectionGuidanceModal';
import FRIDAYChat from '@/components/FRIDAYChat';

export default function LearningPage() {
  const router = useRouter();
  const t = useTranslations();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('pages.learning.title')}</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setModalOpen(true)}>
              {t('pages.learning.getAIGuidance')}
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              {t('pages.learning.backToDashboard')}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('pages.learning.journeyTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              {t('pages.learning.description')}
            </p>
            <Button onClick={() => setModalOpen(true)}>
              {t('pages.learning.getPersonalizedGuidance')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <FRIDAYChat />
      
      <SectionGuidanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sectionType="learning-path"
        sectionTitle={t('pages.learning.title')}
      />
    </div>
  );
}
