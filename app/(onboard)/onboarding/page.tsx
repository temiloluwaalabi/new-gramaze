"use client";
import React, { Suspense } from "react";

import { OnboardingClientPage } from "@/components/shared/onboarding/onboarding-page";

export default function Onboarding() {
  return (
    <Suspense>
      <OnboardingClientPage />
    </Suspense>
  );
}
