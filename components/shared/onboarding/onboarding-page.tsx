"use client";

import { useSearchParams } from "next/navigation";
import * as React from "react";

import { AppointmentStep } from "./appointment-step";
import { BiodataStep } from "./biodata-step";
import { MedicalHistoryStep } from "./medical-history-step";
import { PlanSelectionStep } from "./plan-selection-step";

// Loading component
const OnboardingLoader = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <p className="text-sm text-gray-600">Loading onboarding...</p>
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
  const searchParams = useSearchParams();
  const step = searchParams.get("step") || "plan";

  // Render the current step
  const renderStep = () => {
    switch (step) {
      case "plan":
        return <PlanSelectionStep />;
      case "bio-data":
        return <BiodataStep />;
      case "medical-history":
        return <MedicalHistoryStep />;
      case "appointment":
        return <AppointmentStep />;
      default:
        return <StepNotFound step={step} />;
    }
  };

  return (
    <div className="flex h-full items-center justify-start">
      <React.Suspense fallback={<OnboardingLoader />}>
        <div className="mx-auto w-full px-4 py-8">{renderStep()}</div>
      </React.Suspense>
    </div>
  );
};
