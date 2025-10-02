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
  markStepComplete: (step: string) => void;
  currentStep: string;
  goToStep: (step: string) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  resetState: () => void;
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
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<string>(
    searchParams.get("step") || "plan"
  );

  // const currentStep = searchParams.get('step') || 'plan';
  const router = useRouter();

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
  const goToStep = (step: string) => {
    setCurrentStep(step);
    router.push(`/onboarding?step=${step}`);
  };
  const goToNextStep = () => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    const nextStep = stepsOrder[currentIndex + 1];
    if (nextStep) {
      goToStep(nextStep);
    }
  };

  const goToPrevStep = () => {
    const currentIndex = stepsOrder.indexOf(currentStep);
    const prevStep = stepsOrder[currentIndex - 1];
    if (prevStep) {
      goToStep(prevStep);
    }
  };

  const resetState = () => {
    setData(getDefaultOnboardingData());
    setCompletedSteps([]);
    setCurrentStep("plan");
    router.push("/onboarding?step=plan");
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
