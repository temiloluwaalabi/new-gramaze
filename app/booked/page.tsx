import React, { Suspense } from "react";

import OnboardingSuccess from "@/components/shared/onboarding/onboarding-successful-page";

export default function OnboardingBookedPage() {
  return (
    <Suspense>
      <OnboardingSuccess />
    </Suspense>
  );
}
