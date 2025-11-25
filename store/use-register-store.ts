// useRegisterStore.js
import { create } from "zustand";

interface RegisterState {
  currentStep: number;
  setCurrentStep: (key: number) => void;
  nextStep: (key: number) => void;
  prevStep: (key: number) => void;
}

export const useRegisterStore = create<RegisterState>((set) => ({
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
}));
