// @flow
import * as React from "react";

import MedicalHistoryForm from "@/components/forms/medical-history-form";
import { useUserStore } from "@/store/user-store";

import { StepFooter } from "./step-footer";
import { StepHeader } from "./step-header";
export const MedicalHistoryStep = () => {
  const { user } = useUserStore();

  const has_set_medical_history = user?.has_set_medical_history;
  return (
    <div className="w-full">
      <StepHeader
        title="Brief medical history"
        description="Tell us about your medical history"
      />
      <div className="max-w-2xl">
        <MedicalHistoryForm />
        <StepFooter
          showSkip={has_set_medical_history === "yes"}
          skipText="Continue"
        />
      </div>
    </div>
  );
};
