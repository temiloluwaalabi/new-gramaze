// hooks/useVerification.tsx or providers/VerificationProvider.tsx
"use client";

import React, { createContext, useContext } from "react";

type VerificationContextType = {
  isVerified: boolean;
  isRouteAccessible: (route: string) => boolean;
};

const VerificationContext = createContext<VerificationContextType | null>(null);

export function VerificationProvider({
  children,
  isVerified,
}: {
  children: React.ReactNode;
  isVerified: boolean;
}) {
  // Only these routes are accessible for unverified users
  const accessibleRoutes = ["/dashboard", "/dashboard/appointment"];

  const isRouteAccessible = (route: string) => {
    if (isVerified) return true; // Verified users can access everything

    // Check if route is in the accessible list
    return accessibleRoutes.some(
      (accessible) => route === accessible || route.endsWith(`${accessible}/`)
    );
  };

  return (
    <VerificationContext.Provider value={{ isVerified, isRouteAccessible }}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error("useVerification must be used within VerificationProvider");
  }
  return context;
}
