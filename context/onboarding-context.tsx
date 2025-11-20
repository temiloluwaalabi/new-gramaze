"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

type OnboardingData = {
  forWhom: string;
  plan: string;
  personalInfo: {
    fullName: string;
    dateOfBirth: Date;
    gender: string;
    address: string;
    phoneNumber: string;
  };
  medicalHistory: {
    history: "";
    files: File[] | [];
  };
  appointment: {
    type: "virtual" | "physical";
    date: Date;
    physicalType?: string;
    time: string;
    address?: string;
    hospitalId?: number;
    hospitalName?: string;
    state?: string;
    interestedPhysicalAppointment?: string;
    proposedHospitalArea?: string;
    lga?: string;
    email: string;
    notes?: string;
  };
  appointmentReadyForReview: boolean;
};

export const getDefaultOnboardingData = (): OnboardingData => ({
  forWhom: "",
  plan: "",
  personalInfo: {
    fullName: "",
    dateOfBirth: new Date(),
    gender: "",
    address: "",
    phoneNumber: "",
  },
  medicalHistory: {
    history: "",
    files: [],
  },
  appointment: {
    type: "virtual",
    date: new Date(),
    time: "",
    email: "",
  },
  appointmentReadyForReview: false,
});

type OnboardingContextType = {
  data: OnboardingData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateData: (field: keyof OnboardingData, value: any) => void;
  completedSteps: string[];
  markStepComplete: (stepId: string) => void;
  currentStep: string;
  goToStep: (step: string) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  resetState: () => void;
  isStepAccessible: (stepId: string) => boolean;
};

export const defaultData: OnboardingData = {
  forWhom: "",
  plan: "",
  personalInfo: {
    fullName: "",
    dateOfBirth: new Date(),
    gender: "",
    address: "",
    phoneNumber: "",
  },
  medicalHistory: {
    history: "",
    files: [],
  },
  appointment: {
    type: "virtual",
    date: new Date(),
    time: "",
    email: "",
  },
  appointmentReadyForReview: false,
};
const stepsOrder = ["plan", "bio-data", "medical-history", "appointment"];

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL or default to first step
  const [currentStep, setCurrentStep] = useState<string>(() => {
    return searchParams.get("step") || "plan";
  });

  const [data, setData] = useState<OnboardingData>(defaultData);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // const currentStep = searchParams.get('step') || 'plan';

  useEffect(() => {
    const stored = localStorage.getItem("GRAMAZE_ONBOARD");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCurrentStep(parsed.currentStep);
      setCompletedSteps(parsed.completedSteps || []);
      setData(parsed.data || {});
    }
  }, []);
  useEffect(() => {
    const state = { currentStep, completedSteps, data };
    localStorage.setItem("GRAMAZE_ONBOARD", JSON.stringify(state));
  }, [currentStep, completedSteps, data]);

  useEffect(() => {
    // Determine the first incomplete step
    const firstIncompleteStep = stepsOrder.find(
      (step) => !completedSteps.includes(step)
    );
    // Determine requested step from the URL
    const requestedStep = searchParams.get("step") || "plan";
    const requestedIndex = stepsOrder.indexOf(requestedStep);
    const allowedIndex = stepsOrder.indexOf(
      firstIncompleteStep ?? "appointment"
    );

    // If the requested step is ahead of the user's current progress, redirect
    if (requestedIndex > allowedIndex) {
      setCurrentStep(firstIncompleteStep ?? "appointment");
      router.replace(
        `/onboarding?step=${firstIncompleteStep ?? "appointment"}`
      );
    }
  }, [completedSteps, router, searchParams]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const markStepComplete = (step: string) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step]);
    }
  };
  const goToStep = (stepId: string) => {
    if (isStepAccessible(stepId)) {
      router.push(`/onboarding?step=${stepId}`);
      setCurrentStep(stepId);
    }
  };
  const goToNextStep = () => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    if (currentIndex < stepsOrder.length - 1) {
      // Mark current step as complete
      markStepComplete(currentStep);
      const nextStep = stepsOrder[currentIndex + 1];
      goToStep(nextStep);
    }
  };

  const goToPrevStep = () => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStep = stepsOrder[currentIndex - 1];
      goToStep(prevStep);
    }
  };

  const isStepAccessible = (stepId: string) => {
    // First step is always accessible
    if (stepId === "plan") return true;

    // Current step is accessible
    if (stepId === currentStep) return true;

    // Completed steps are accessible
    if (completedSteps.includes(stepId)) return true;

    // Check if all previous steps are completed
    const stepIndex = stepsOrder.indexOf(stepId);
    const previousSteps = stepsOrder.slice(0, stepIndex);
    return previousSteps.every((step) => completedSteps.includes(step));
  };

  const resetState = () => {
    setData(getDefaultOnboardingData());
    setCompletedSteps([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("GRAMAZE_ONBOARD");
    }
    goToStep("plan");
  };
  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateData,
        completedSteps,
        markStepComplete,
        currentStep,
        goToStep,
        goToNextStep,
        isStepAccessible,
        goToPrevStep,
        resetState,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
