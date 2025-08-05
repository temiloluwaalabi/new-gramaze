// @flow
import * as React from "react";

import BiodataForm from "@/components/forms/bio-data-form";
import { useUserStore } from "@/store/user-store";

import { StepFooter } from "./step-footer";
import { StepHeader } from "./step-header";
export const BiodataStep = () => {
  const { user } = useUserStore();

  const hasFilledBiodata = user?.has_set_bio_data;
  return (
    <div className="w-full">
      <StepHeader
        title="Basic information & Bio Data"
        description="Tell us about yourself"
      />{" "}
      <div className="max-w-xl">
        <BiodataForm />
        <StepFooter showSkip={hasFilledBiodata === "yes"} skipText="Continue" />
      </div>
    </div>
  );
};
