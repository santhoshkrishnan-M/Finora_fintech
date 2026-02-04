'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi, profileApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const AGE_RANGES = ['18-25', '26-35', '36-45', '46-60', '60+'];

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const t = useTranslations();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const USER_CATEGORIES = [
    { value: 'student', label: t('signup.student') },
    { value: 'farmer', label: t('signup.farmer') },
    { value: 'woman', label: t('signup.woman') },
    { value: 'professional', label: t('signup.professional') },
  ];

  const LANGUAGES = [
    { value: 'en', label: t('languages.en') },
    { value: 'ta', label: t('languages.ta') },
    { value: 'hi', label: t('languages.hi') },
    { value: 'te', label: t('languages.te') },
    { value: 'ml', label: t('languages.ml') },
    { value: 'kn', label: t('languages.kn') },
  ];

  const FINANCIAL_GOALS = [
    t('onboarding.emergencyFund'),
    t('onboarding.retirement'),
    t('onboarding.education'),
    t('onboarding.homeOwnership'),
    t('onboarding.businessGrowth'),
    t('onboarding.debtRepayment'),
  ];

  const RISK_LEVELS = [
    { value: 'low', label: t('signup.lowRisk') },
    { value: 'medium', label: t('signup.mediumRisk') },
    { value: 'high', label: t('signup.highRisk') },
  ];

  const [profileData, setProfileData] = useState({
    ageRange: '',
    userCategory: '',
    language: 'en',
    monthlyIncome: '',
    monthlyExpenses: '',
    financialGoals: [] as string[],
    riskComfortLevel: '',
    hasEmergencyFund: false,
    currentSavings: '',
  });

  const handleProfileChange = (field: string, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const toggleGoal = (goal: string) => {
    setProfileData((prev) => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goal)
        ? prev.financialGoals.filter((g) => g !== goal)
        : [...prev.financialGoals, goal],
    }));
  };

  const handleNextStep = () => {
    setError('');
    
    if (step === 1) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
    } else if (step === 2) {
      if (!profileData.ageRange || !profileData.userCategory || !profileData.language) {
        setError('Please fill in all fields');
        return;
      }
    } else if (step === 3) {
      if (!profileData.monthlyIncome || !profileData.monthlyExpenses) {
        setError('Please fill in all fields');
        return;
      }
      if (parseFloat(profileData.monthlyExpenses) > parseFloat(profileData.monthlyIncome)) {
        setError('Monthly expenses cannot exceed monthly income');
        return;
      }
    } else if (step === 4) {
      if (profileData.financialGoals.length === 0 || !profileData.riskComfortLevel) {
        setError('Please select at least one financial goal and risk level');
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.signup(email, password);
      setAuth(response.user, response.token);

      await profileApi.save(response.token, {
        ...profileData,
        monthlyIncome: parseFloat(profileData.monthlyIncome),
        monthlyExpenses: parseFloat(profileData.monthlyExpenses),
        currentSavings: parseFloat(profileData.currentSavings) || 0,
      });

      setAuth({ ...response.user, hasProfile: true }, response.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">{t('common.appName')}</CardTitle>
          <CardDescription className="text-center">
            {t('signup.title')}
          </CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 w-12 rounded ${
                  s === step ? 'bg-primary' : s < step ? 'bg-primary/50' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">{t('signup.stepProgress', { step })}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }}>
            
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('signup.step1Title')}</h3>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('signup.passwordMinLength')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t('auth.confirmPassword')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('signup.step2Title')}</h3>
                <div className="space-y-2">
                  <Label>{t('signup.ageRangeLabel')}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {AGE_RANGES.map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => handleProfileChange('ageRange', range)}
                        className={`p-3 border rounded text-sm ${
                          profileData.ageRange === range
                            ? 'bg-primary text-white'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('signup.userCategoryLabel')}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {USER_CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleProfileChange('userCategory', cat.value)}
                        className={`p-3 border rounded text-sm ${
                          profileData.userCategory === cat.value
                            ? 'bg-primary text-white'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('signup.preferredLanguageLabel')}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.value}
                        type="button"
                        onClick={() => handleProfileChange('language', lang.value)}
                        className={`p-3 border rounded text-sm ${
                          profileData.language === lang.value
                            ? 'bg-primary text-white'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('signup.step3Title')}</h3>
                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">{t('signup.monthlyIncomeLabel')}</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    placeholder="25000"
                    value={profileData.monthlyIncome}
                    onChange={(e) => handleProfileChange('monthlyIncome', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses">{t('signup.monthlyExpensesLabel')}</Label>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    placeholder="15000"
                    value={profileData.monthlyExpenses}
                    onChange={(e) => handleProfileChange('monthlyExpenses', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentSavings">{t('signup.currentSavingsLabel')}</Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    placeholder="50000"
                    value={profileData.currentSavings}
                    onChange={(e) => handleProfileChange('currentSavings', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">{t('signup.optional')}</p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('signup.step4Title')}</h3>
                <div className="space-y-2">
                  <Label>{t('signup.selectGoalsLabel')}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {FINANCIAL_GOALS.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleGoal(goal)}
                        className={`p-3 border rounded text-sm ${
                          profileData.financialGoals.includes(goal)
                            ? 'bg-primary text-white'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('signup.riskLevelLabel')}</Label>
                  <div className="space-y-2">
                    {RISK_LEVELS.map((risk) => (
                      <button
                        key={risk.value}
                        type="button"
                        onClick={() => handleProfileChange('riskComfortLevel', risk.value)}
                        className={`w-full p-3 border rounded text-sm text-left ${
                          profileData.riskComfortLevel === risk.value
                            ? 'bg-primary text-white'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {risk.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('signup.step5Title')}</h3>
                <div className="space-y-3">
                  <Label>{t('signup.emergencyFundQuestion')}</Label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleProfileChange('hasEmergencyFund', true)}
                      className={`flex-1 p-4 border rounded ${
                        profileData.hasEmergencyFund
                          ? 'bg-primary text-white'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {t('signup.yes')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleProfileChange('hasEmergencyFund', false)}
                      className={`flex-1 p-4 border rounded ${
                        !profileData.hasEmergencyFund
                          ? 'bg-primary text-white'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {t('signup.no')}
                    </button>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                  <p className="text-sm text-blue-800">
                    {t('signup.aiGuidanceNote')}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded mt-4">
                {error}
              </div>
            )}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                >
                  {t('common.back')}
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className={step === 1 ? 'w-full' : 'ml-auto'}
              >
                {loading ? t('signup.processing') : step === 5 ? t('signup.createAccount') : t('signup.next')}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            {t('signup.alreadyHaveAccount')}{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              {t('signup.loginLink')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
