import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  locale: string;
  setLocale: (locale: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale: string) => set({ locale }),
    }),
    {
      name: 'finora-language',
    }
  )
);
