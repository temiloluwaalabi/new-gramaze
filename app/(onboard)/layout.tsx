"use client";
import React from "react";

import OnboardingSidebar from "@/components/shared/onboarding/step-sidebar";

// app/onboarding/layout.tsx
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <OnboardingSidebar
        steps={[
          {
            id: "plan",
            label: "Choose Plan",
            description: "Find the right plan for your needs.",
          },
          {
            id: "bio-data",
            label: "Personal Info",
            description: "Tell us about yourself.",
          },
          {
            id: "medical-history",
            label: "Brief Medical History",
            description: "Tell us about your medical history.",
          },
          {
            id: "appointment",
            label: "Schedule an appointment",
            description: "Book a health assessment.",
          },
        ]}
      />
      {/* <div className="flex-1 pl-[350px] 2xl:pl-[398px] py-8 pr-[50px]">{children}</div> */}
      <div className="flex-1 px-4 pt-22 pb-10 lg:pt-8 lg:pr-[50px] lg:pl-[350px] 2xl:pl-[398px]">
        {children}
      </div>
    </div>
  );
}
