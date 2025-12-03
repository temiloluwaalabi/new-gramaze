/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SessionData } from "@/lib/auth/session";
import { useServerSession } from "@/providers/SessionProvider";
import { User } from "@/types";

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
  const serverSession = useServerSession();
  const [session, setSession] = useState<SessionData | null>(serverSession); // ✅ Start with null
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (!serverSession?.isLoggedIn) {
      return;
    }
    const fetchSession = async () => {
      setIsLoading(true);

      try {
        const data = await fetchJSON<SessionData>(sessionApiRoute);
        setSession(data);
        setError(null);
      } catch (error) {
        setError(error as Error);
        setSession(null);
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

  const clientLoginSession = async (user: User, accessToken: string) => {
    setIsLoading(true);
    try {
      // POST request will redirect to dashboard, so we handle it differently
      const response = await fetch(sessionApiRoute, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({ user, accessToken }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // If redirect happened, the browser will navigate
      // If not redirected, update session state
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        const data = await response.json();
        setSession(data);
        setError(null);
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err as Error);
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
      // setSession(null);
      // setError(null);
      window.location.href = "/sign-in"; // Redirect to login page
      // router.refresh();
      // useUserStore.getState().logout();
    } catch (err) {
      setError(err as Error);
      setIsLoading(false); // Only set loading false on error
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
