/* eslint-disable no-undef */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SessionData } from "@/lib/auth/session";
import { useUserStore } from "@/store/user-store";

const sessionApiRoute = "/api/auth/session";

export async function fetchJSON<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  return fetch(input, {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    ...init,
  }).then((res) => {
    if (!res.ok) {
      // toast(`Error: ${res.statusText}`);
      throw new Error(`Error: ${res.statusText}`);
    }

    return res.json();
  });
}

export default function useSession() {
  const [session, setSession] = useState<SessionData | null>(null); // ✅ Start with null
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);

      try {
        const data = await fetchJSON<SessionData>(sessionApiRoute);
        setSession(data);
        setError(null);
      } catch (error) {
        setError(error as Error);
        setSession(null)
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  // // Update the session and lastActivity in localStorage or backend
  // const updateActivity = async () => {
  //   // setLastActivity(Date.now());
  //   try {
  //     await fetchJSON<SessionData>(sessionApiRoute, {
  //       method: "POST",
  //       body: JSON.stringify({ lastActivity: Date.now() }), // Send new lastActivity to the backend if needed
  //     });
  //   } catch (error) {
  //     toast(`Error updating session activity: ${error}`);
  //   }
  // };

  // Handle login
  const clientLoginSession = async (username: string) => {
    setIsLoading(true);
    try {
      const data = await fetchJSON<SessionData>(sessionApiRoute, {
        method: "POST",
        body: JSON.stringify({ username }),
      });
      setSession(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err as Error);
      setSession(null)
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const clientLogoutSession = async () => {
    setIsLoading(true);
    try {
     await fetchJSON<SessionData>(sessionApiRoute, {
        method: "DELETE",
      });
      useUserStore.getState().logout();
      setSession(null);
      setError(null);
      router.push("/");
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    session,
    clientLoginSession,
    clientLogoutSession,
    isLoading,
    error,
  };
}
