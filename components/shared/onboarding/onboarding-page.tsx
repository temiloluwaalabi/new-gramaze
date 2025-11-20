/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { useOnboarding } from "@/context/onboarding-context";

import { AppointmentStep } from "./appointment-step";
import { BiodataStep } from "./biodata-step";
import { MedicalHistoryStep } from "./medical-history-step";
import { PlanSelectionStep } from "./plan-selection-step";

// Loading component
const StepLoader = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="text-center">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500" />
      <p className="mt-4 text-sm text-gray-600">Loading step...</p>
    </div>
  </div>
);

// Step not found component
const StepNotFound = ({ step }: { step: string }) => (
  <div className="flex h-64 items-center justify-center">
    <div className="text-center">
      <h2 className="mb-2 text-xl font-semibold text-gray-800">
        Step Not Found
      </h2>
      <p className="mb-4 text-gray-600">
        The step &quot;{step}&quot; is not available.
      </p>
      <button
        onClick={() => (window.location.href = "/onboarding?step=plan")}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Go to First Step
      </button>
    </div>
  </div>
);

export const OnboardingClientPage = () => {
  const {
    currentStep,
    goToNextStep,
    goToPrevStep,
    data,
    updateData,
    markStepComplete,
    isStepAccessible,
  } = useOnboarding();
  const searchParams = useSearchParams();
  const step = searchParams.get("step") || "plan";
  const router = useRouter();

  // Redirect if step is not accessible
  React.useEffect(() => {
    if (!isStepAccessible(currentStep)) {
      router.push("/onboarding?step=plan");
    }
  }, [currentStep, isStepAccessible, router]);

  // Handle step completion and navigation
  const handleStepComplete = async (stepData?: any) => {
    // Save step data if provided
    if (stepData) {
      updateData(currentStep as any, stepData);
    }
    // Mark current step as complete
    markStepComplete(currentStep);
    // Move to next step
    if (currentStep === "appointment") {
      // Last step - handle final submission
      handleFinalSubmission();
    } else {
      goToNextStep();
    }
  };

  const handleFinalSubmission = async () => {
    try {
      // Here you would typically send all the data to your backend
      console.log("Submitting onboarding data:", data);
      // Redirect to dashboard or success page
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to submit onboarding:", error);
      // Handle error appropriately
    }
  };

  // Render the current step
  const renderStep = () => {
    const commonProps = {
      onNext: handleStepComplete,
      onPrevious: goToPrevStep,
      data: data[currentStep as keyof typeof data],
      allData: data,
    };

    switch (currentStep) {
      case "plan":
        return <PlanSelectionStep {...commonProps} />;
      case "bio-data":
        return <BiodataStep {...commonProps} />;
      case "medical-history":
        return <MedicalHistoryStep {...commonProps} />;
      case "appointment":
        return <AppointmentStep {...commonProps} />;
      default:
        return <StepNotFound step={step} />;
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Step content with proper spacing for mobile */}
      <div className="flex-1 overflow-auto">
        <div className="flex h-full items-center justify-start">
          <React.Suspense fallback={<StepLoader />}>
            <div className="mx-auto w-full px-4 py-8">{renderStep()}</div>
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};
