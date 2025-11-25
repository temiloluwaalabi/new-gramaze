// useRegisterStore.js
import { create } from "zustand";

interface LoginState {
  currentStep: number;
  setCurrentStep: (key: number) => void;
  nextStep: (key: number) => void;
  prevStep: (key: number) => void;
  clear: () => void;
}

export const useLoginStore = create<LoginState>((set) => ({
  // Current step of the registration form
  currentStep: 1,
  // Actions
  setCurrentStep: (step: number) => set({ currentStep: step }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 3),
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),
  clear: () => {
    set(() => ({
      currentStep: 1,
    }));
  },
}));
