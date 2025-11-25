"use client";

import { useRegisterStore } from "@/store/use-register-store";

import { RegisterVerifyOTPStep } from "./register-step-verify-otp";
import SignUpForm from "./sign-up-form";

// StepIndicator component
const StepIndicator = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  return (
    <div className="mb-3 flex items-center justify-center">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className={`mr-2 flex h-1 w-12 items-center justify-center rounded-full ${
              index + 1 === currentStep
                ? "bg-blue-500 text-white dark:bg-red-600"
                : index + 1 < currentStep
                  ? "text-primary bg-blue-500 dark:bg-red-600"
                  : "bg-gray-200 text-gray-500 dark:bg-red-200"
            }`}
          />
          {/* {index < totalSteps - 1 && (
            <div
              className={`h-1 w-12 ${
                index + 1 < currentStep ? "bg-primary" : "bg-gray-200"
              }`}
            />
          )} */}
        </div>
      ))}
    </div>
  );
};

// Step content wrapper
const StepContent = () => {
  const { currentStep } = useRegisterStore();

  switch (currentStep) {
    case 1:
      return <SignUpForm />;
    case 2:
      return <RegisterVerifyOTPStep isPasswordReset={false} />;
    default:
      return <div>Unknown step</div>;
  }
};

// Main component
export const RegisterForm = () => {
  const { currentStep } = useRegisterStore();

  return (
    <div className="flex w-full flex-col items-center">
      <StepIndicator currentStep={currentStep} totalSteps={2} />
      <div className="w-full">
        <StepContent />
      </div>
    </div>
  );
};
