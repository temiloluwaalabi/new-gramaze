// components/guards/VerificationGuard.tsx
import { ReactNode } from "react";

import { useVerification } from "@/providers/verification-provider";

export function VerificationGuard({
  route,
  children,
  fallback,
}: {
  route: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isRouteAccessible } = useVerification();

  if (!isRouteAccessible(route)) {
    return fallback || null;
  }

  return <>{children}</>;
}
