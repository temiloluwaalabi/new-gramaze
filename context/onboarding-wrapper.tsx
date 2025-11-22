/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// components/OnboardingWrapper.tsx
"use client";

import { ReactNode, Suspense, useEffect, useState } from "react";

import { OnboardingProvider } from "@/context/onboarding-context";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SessionData } from "@/lib/auth/session";
import { SessionProvider } from "@/providers/SessionProvider";

export default function OnboardingWrapper({
  children,
  serverSession
}: {
  children: ReactNode;
  serverSession:SessionData
}) {
  const [isMobile, setIsMobile] = useState(false);
  useCurrentUser();
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
      <SessionProvider initialSession={serverSession}>

      <OnboardingProvider>{children}</OnboardingProvider>
      </SessionProvider>
    </Suspense>
  );
}
