'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { profileApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const AGE_RANGES = ['18-25', '26-35', '36-45', '46-60', '60+'];
const USER_CATEGORIES = [
  { value: 'student', label: 'Student' },
  { value: 'farmer', label: 'Farmer' },
  { value: 'woman', label: 'Woman' },
  { value: 'professional', label: 'Working Professional' },
];
const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ta', label: 'Tamil' },
  { value: 'hi', label: 'Hindi' },
  { value: 'te', label: 'Telugu' },
  { value: 'ml', label: 'Malayalam' },
  { value: 'kn', label: 'Kannada' },
];
const FINANCIAL_GOALS = [
  'Emergency Fund',
  'Retirement Planning',
  'Education',
  'Home Ownership',
  'Business Growth',
  'Debt Repayment',
];
const RISK_LEVELS = [
  { value: 'low', label: 'Low - Prefer safe, guaranteed returns' },
  { value: 'medium', label: 'Medium - Balance between safety and growth' },
  { value: 'high', label: 'High - Willing to take risks for higher returns' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { token, setAuth, user } = useAuthStore();
  const { setProfile } = useProfileStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
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

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goal)
        ? prev.financialGoals.filter((g) => g !== goal)
        : [...prev.financialGoals, goal],
    }));
  };

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        if (!formData.ageRange || !formData.userCategory || !formData.language) {
          setError('Please fill in all fields');
          return false;
        }
        break;
      case 2:
        if (!formData.monthlyIncome || !formData.monthlyExpenses) {
          setError('Please fill in all fields');
          return false;
        }
        if (parseFloat(formData.monthlyExpenses) > parseFloat(formData.monthlyIncome)) {
          setError('Monthly expenses cannot exceed monthly income');
          return false;
        }
        break;
      case 3:
        if (formData.financialGoals.length === 0 || !formData.riskComfortLevel) {
          setError('Please select at least one financial goal and risk level');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setError('');
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setLoading(true);
    setError('');

    try {
      const profileData = {
        ageRange: formData.ageRange,
        userCategory: formData.userCategory as any,
        language: formData.language,
        monthlyIncome: parseFloat(formData.monthlyIncome),
        monthlyExpenses: parseFloat(formData.monthlyExpenses),
        financialGoals: formData.financialGoals,
        riskComfortLevel: formData.riskComfortLevel as any,
        hasEmergencyFund: formData.hasEmergencyFund,
        currentSavings: parseFloat(formData.currentSavings) || 0,
      };

      const response = await profileApi.save(token!, profileData);
      setProfile(response.profile);
      
      // Update user hasProfile status
      if (user) {
        setAuth({ ...user, hasProfile: true }, token!);
      }
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
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
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to FINORA</CardTitle>
          <CardDescription>
            Let's set up your financial profile to provide personalized guidance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Step {step} of 3</span>
              <span className="text-sm text-gray-500">
                {step === 1 && 'Basic Information'}
                {step === 2 && 'Financial Details'}
                {step === 3 && 'Goals and Preferences'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Age Range</Label>
                <div className="grid grid-cols-3 gap-2">
                  {AGE_RANGES.map((range) => (
                    <Button
                      key={range}
                      type="button"
                      variant={formData.ageRange === range ? 'default' : 'outline'}
                      onClick={() => handleInputChange('ageRange', range)}
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>I am a</Label>
                <div className="grid grid-cols-2 gap-2">
                  {USER_CATEGORIES.map((category) => (
                    <Button
                      key={category.value}
                      type="button"
                      variant={formData.userCategory === category.value ? 'default' : 'outline'}
                      onClick={() => handleInputChange('userCategory', category.value)}
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <div className="grid grid-cols-3 gap-2">
                  {LANGUAGES.map((lang) => (
                    <Button
                      key={lang.value}
                      type="button"
                      variant={formData.language === lang.value ? 'default' : 'outline'}
                      onClick={() => handleInputChange('language', lang.value)}
                    >
                      {lang.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Financial Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income (₹)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="Enter your monthly income"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyExpenses">Monthly Expenses (₹)</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  placeholder="Enter your monthly expenses"
                  value={formData.monthlyExpenses}
                  onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentSavings">Current Savings (₹)</Label>
                <Input
                  id="currentSavings"
                  type="number"
                  placeholder="Enter your current savings"
                  value={formData.currentSavings}
                  onChange={(e) => handleInputChange('currentSavings', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="hasEmergencyFund"
                  type="checkbox"
                  checked={formData.hasEmergencyFund}
                  onChange={(e) => handleInputChange('hasEmergencyFund', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="hasEmergencyFund" className="font-normal">
                  I have an emergency fund
                </Label>
              </div>
            </div>
          )}

          {/* Step 3: Goals and Preferences */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Financial Goals (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {FINANCIAL_GOALS.map((goal) => (
                    <Button
                      key={goal}
                      type="button"
                      variant={formData.financialGoals.includes(goal) ? 'default' : 'outline'}
                      onClick={() => toggleGoal(goal)}
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Risk Comfort Level</Label>
                <div className="space-y-2">
                  {RISK_LEVELS.map((risk) => (
                    <button
                      key={risk.value}
                      type="button"
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        formData.riskComfortLevel === risk.value
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('riskComfortLevel', risk.value)}
                    >
                      <div className="font-medium">{risk.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={handleNext}>
                Continue
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
