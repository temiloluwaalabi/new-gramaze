// components/onboarding/StepFooter.tsx
"use client";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/onboarding-context";

type StepFooterProps = {
  showSkip?: boolean;
  skipText?: string;
  disableFooter?: boolean;
  onBack?: () => void;
  onSkip?: () => void;
  disabled?: boolean;
  hideBackButton?: boolean;
};

export const StepFooter = ({
  showSkip = true,
  disableFooter = false,
  onBack,
  skipText,
  onSkip,
  disabled,
  hideBackButton = false,
}: StepFooterProps) => {
  const { markStepComplete, currentStep, goToNextStep, goToPrevStep } =
    useOnboarding();

  if (disableFooter) return null;

  return (
    <div className="flex items-center justify-between pt-10">
      {!hideBackButton && (
        <Button
          variant="ghost"
          type="button"
          className="flex cursor-pointer items-center gap-1 p-0"
          // disabled={!onBack || disabled}
          onClick={onBack || goToPrevStep}
          aria-disabled={!onBack || disabled ? true : undefined}
        >
          <ArrowLeft />
          Back
        </Button>
      )}

      {showSkip !== false && (
        <Button
          variant="secondary"
          className="ml-auto h-fit cursor-pointer rounded-[6px] bg-blue-600 px-6 py-2 text-base font-medium text-white hover:bg-blue-800"
          disabled={disabled}
          type="button"
          aria-disabled={disabled || undefined}
          onClick={() => {
            if (onSkip) {
              onSkip();
            } else {
              markStepComplete(currentStep);
              goToNextStep();
            }
          }}
        >
          {skipText || "Skip"}
        </Button>
      )}
    </div>
  );
};
