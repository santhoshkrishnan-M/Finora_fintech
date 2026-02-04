import { create } from 'zustand';

interface FinancialProfile {
  id: string;
  ageRange: string;
  userCategory: 'student' | 'farmer' | 'woman' | 'professional';
  language: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  financialGoals: string[];
  riskComfortLevel: 'low' | 'medium' | 'high';
  hasEmergencyFund: boolean;
  currentSavings: number;
}

interface ProfileState {
  profile: FinancialProfile | null;
  setProfile: (profile: FinancialProfile) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));
