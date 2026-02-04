'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import FRIDAYChat from '@/components/FRIDAYChat';
import SectionGuidanceModal from '@/components/SectionGuidanceModal';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const t = useTranslations();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<{
    type: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    } else if (!user.hasProfile) {
      router.push('/onboarding');
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const openGuidance = (sectionType: string, sectionTitle: string) => {
    setSelectedSection({ type: sectionType, title: sectionTitle });
    setModalOpen(true);
  };

  const closeGuidance = () => {
    setModalOpen(false);
    setSelectedSection(null);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">{t('common.appName')}</h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="text-sm text-gray-600">{user.email}</span>
            <Button variant="outline" onClick={handleLogout}>
              {t('common.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">{t('dashboard.welcome')}</h2>
          <p className="text-gray-600">{t('dashboard.overview')}</p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{t('dashboard.budgetPlanner')}</CardTitle>
              <CardDescription>
                {t('dashboard.budgetPlannerDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {t('dashboard.budgetPlannerDetails')}
              </p>
              <div className="flex gap-2">
                <Link href="/budget" className="flex-1">
                  <Button className="w-full">{t('buttons.open')}</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => openGuidance('budget', t('dashboard.budgetPlanner'))}
                >
                  {t('guidance.aiGuide')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{t('dashboard.savingsStrategies')}</CardTitle>
              <CardDescription>
                {t('dashboard.savingsStrategiesDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {t('dashboard.savingsStrategiesDetails')}
              </p>
              <div className="flex gap-2">
                <Link href="/savings" className="flex-1">
                  <Button className="w-full">{t('buttons.open')}</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => openGuidance('savings', t('dashboard.savingsStrategies'))}
                >
                  {t('guidance.aiGuide')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{t('dashboard.scenarios')}</CardTitle>
              <CardDescription>
                {t('dashboard.scenariosDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {t('dashboard.scenariosDetails')}
              </p>
              <div className="flex gap-2">
                <Link href="/scenarios" className="flex-1">
                  <Button className="w-full">{t('buttons.open')}</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => openGuidance('learning-scenarios', t('dashboard.scenarios'))}
                >
                  {t('guidance.aiGuide')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{t('dashboard.learningPath')}</CardTitle>
              <CardDescription>
                {t('dashboard.learningPathDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {t('dashboard.learningPathDetails')}
              </p>
              <div className="flex gap-2">
                <Link href="/learning" className="flex-1">
                  <Button className="w-full">{t('buttons.open')}</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => openGuidance('learning-path', t('dashboard.learningPath'))}
                >
                  {t('guidance.aiGuide')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{t('dashboard.profile')}</CardTitle>
              <CardDescription>
                {t('dashboard.profileDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {t('dashboard.profileDetails')}
              </p>
              <div className="flex gap-2">
                <Link href="/profile" className="flex-1">
                  <Button className="w-full">{t('buttons.open')}</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => openGuidance('profile', t('dashboard.profile'))}
                >
                  {t('guidance.aiGuide')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">{t('dashboard.gettingStarted')}</CardTitle>
              <CardDescription>
                {t('dashboard.gettingStartedDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">
                {t('dashboard.gettingStartedDetails')}
              </p>
              <Button
                variant="outline"
                onClick={() => openGuidance('getting-started', t('dashboard.gettingStarted'))}
                className="w-full"
              >
                {t('guidance.getAIGuidance')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* FRIDAY Chat */}
      <FRIDAYChat />

      {/* Section Guidance Modal */}
      {selectedSection && (
        <SectionGuidanceModal
          isOpen={modalOpen}
          onClose={closeGuidance}
          sectionType={selectedSection.type}
          sectionTitle={selectedSection.title}
        />
      )}
    </div>
  );
}
