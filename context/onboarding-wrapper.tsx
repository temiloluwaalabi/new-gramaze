/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// components/OnboardingWrapper.tsx
"use client";

import { ReactNode, Suspense, useEffect, useState } from "react";

import { OnboardingProvider } from "@/context/onboarding-context";

export default function OnboardingWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => { 
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <Suspense>
      <OnboardingProvider>{children}</OnboardingProvider>
    </Suspense>
  );
}
