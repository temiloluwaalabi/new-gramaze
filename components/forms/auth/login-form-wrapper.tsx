"use client";

import { useLoginStore } from "@/store/use-login-store";

import SignInForm from "./sign-in-form";
import { TwoFactorStep } from "./two-factor-auth-step";

// StepIndicator component
export const StepIndicator = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  return (
    <div className="mb-2 flex items-center justify-center">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className={`mr-2 flex h-1 w-12 items-center justify-center rounded-full ${
              index + 1 === currentStep
                ? "bg-primary text-white dark:bg-red-600"
                : index + 1 < currentStep
                  ? "bg-primary text-primary dark:bg-red-600"
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
  const { currentStep } = useLoginStore();

  switch (currentStep) {
    case 1:
      return <SignInForm />;
    case 2:
      return <TwoFactorStep isPasswordReset={false} />;
    default:
      return <div>Unknown step</div>;
  }
};

// Main component
export const LoginForm = () => {
  // const { currentStep } = useLoginStore();

  return (
    <div className="">
      {/* <StepIndicator currentStep={currentStep} totalSteps={3} /> */}
      <StepContent />
    </div>
  );
};
