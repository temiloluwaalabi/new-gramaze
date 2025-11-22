// providers/SessionProvider.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";

import { SessionData } from "@/lib/auth/session";

const SessionContext = createContext<SessionData | null>(null);

export function SessionProvider({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession: SessionData;
}) {
  return (
    <SessionContext.Provider value={initialSession}>
      {children}
    </SessionContext.Provider>
  );
}

export function useServerSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useServerSession must be used within SessionProvider");
  }
  return context;
}