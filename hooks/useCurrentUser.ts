/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { authService } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import { useUserStore } from "@/store/user-store";
import { User } from "@/types";

import useSession from "./use-session";

// ✅ Configuration for polling
const VERIFICATION_POLL_INTERVAL = 10000; // 10 seconds
const MAX_POLL_ATTEMPTS = 60; // Stop after 10 minutes (60 * 10s)

export function useCurrentUser() {
  const { session, isLoading: sessionLoading } = useSession();
  const { user: storedUser, setUser, logout } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const hasInitializedRef = useRef(false);
  const hasSeenSessionRef = useRef(false);
  const router = useRouter();

  // ✅ Polling state management
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollAttemptsRef = useRef(0);
  const isPollingRef = useRef(false);

  console.log("🔍 User Store Debug:", {
    session: session?.email,
    storedUser: storedUser?.email,
    sessionLoading,
    hasInitialized: hasInitializedRef.current,
    hasSeenSession: hasSeenSessionRef.current,
    userStatus: storedUser?.user_status,
    isPolling: isPollingRef.current,
    timestamp: new Date().toISOString(),
  });

  console.log("SESSION", session);
  console.log("HOOK USER", storedUser);

  // ✅ Helper function to map API response to User object
  const mapUserData = (apiUser: any): User => ({
    id: apiUser.id,
    first_name: apiUser.first_name,
    last_name: apiUser.last_name,
    email: apiUser.email,
    email_verified_at: apiUser.email_verified_at || null,
    agree_to_terms: apiUser.agree_to_terms || "",
    user_type: apiUser.user_type || null,
    user_role: apiUser.user_role || "",
    has_set_user_type: apiUser.has_set_user_type || "",
    plan: apiUser.plan || null,
    dob: apiUser.dob || null,
    gender: apiUser.gender || null,
    phone: apiUser.phone || null,
    has_set_bio_data: apiUser.has_set_bio_data || "",
    address: apiUser.address || null,
    medical_history: apiUser.medical_history || null,
    medical_file: apiUser.medical_file || null,
    has_set_medical_history: apiUser.has_set_medical_history || "",
    has_set_up_appointment: apiUser.has_set_up_appointment || "",
    has_set_plan: apiUser.has_set_plan || "",
    user_status: apiUser.user_status || "",
    last_login_time: apiUser.last_login_time || null,
    created_at: apiUser.created_at || "",
    updated_at: apiUser.updated_at || "",
    activities_notification: apiUser.activities_notification || null,
    factor_authentication: apiUser.factor_authentication || null,
    reminder_notification: apiUser.reminder_notification || null,
    dependents: apiUser.dependents || null,
    message_notification: apiUser.message_notification || null,
    relationship_to_emergency_contact:
      apiUser.relationship_to_emergency_contact || null,
    emergency_contact_name: apiUser.emergency_contact_name || null,
    emergency_contact_phone: apiUser.emergency_contact_phone || null,
    connected_device: apiUser.connected_device || null,
    image: apiUser.image || null,
  });

  // ✅ Function to fetch and update user data
  const fetchAndUpdateUser = async (): Promise<User | null> => {
    try {
      const res = await authService.getUserDetails();

      if (res instanceof ApiError) {
        throw res;
      }

      const userData = mapUserData(res.data.user);
      setUser(userData);

      console.log("✅ User data updated:", {
        email: userData.email,
        status: userData.user_status,
        timestamp: new Date().toISOString(),
      });

      return userData;
    } catch (err: any) {
      console.error("Failed to load user", err);

      if (err.status === 401 || err.status === 403) {
        logout();
      }
      return null;
    }
  };

  // ✅ Clear polling interval
  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
      isPollingRef.current = false;
      pollAttemptsRef.current = 0;
      console.log("🛑 Stopped polling for user verification");
    }
  };

  // ✅ Start polling for verification status
  const startPolling = () => {
    // Prevent multiple polling instances
    if (isPollingRef.current) {
      console.log("⚠️ Polling already active, skipping...");
      return;
    }

    isPollingRef.current = true;
    pollAttemptsRef.current = 0;

    console.log("🔄 Starting verification polling...");

    pollIntervalRef.current = setInterval(async () => {
      pollAttemptsRef.current += 1;

      console.log(
        `🔍 Polling attempt ${pollAttemptsRef.current}/${MAX_POLL_ATTEMPTS}`
      );

      const updatedUser = await fetchAndUpdateUser();

      // ✅ Stop polling if user is now active
      if (updatedUser?.user_status === "active") {
        console.log("✅ User verified! Stopping poll.");
        stopPolling();

        // ✅ Update session with verified status
        try {
          // You'll need to create this server action
          await fetch("/api/auth/session/update-verification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isVerified: true }),
          });

          toast.success("Your account has been verified");

          router.refresh();
        } catch (error) {
          console.error("Failed to update session:", error);
        }
      }

      // ✅ Stop after max attempts to prevent infinite polling
      if (pollAttemptsRef.current >= MAX_POLL_ATTEMPTS) {
        console.log("⏰ Max polling attempts reached, stopping...");
        stopPolling();
      }
    }, VERIFICATION_POLL_INTERVAL);
  };

  // ✅ Main effect for initial user sync
  useEffect(() => {
    const syncUserData = async () => {
      if (sessionLoading) {
        return;
      }

      if (session) {
        hasSeenSessionRef.current = true;
      }

      // Skip if we already have matching user data
      if (storedUser && storedUser.email === session?.email) {
        setIsLoading(false);
        return;
      }

      const userData = await fetchAndUpdateUser();
      setIsLoading(false);

      // ✅ Start polling if user is not active
      if (userData && userData.user_status !== "active") {
        console.log("👤 User not verified, starting polling...");
        startPolling();
      }
    };

    syncUserData();
  }, [session, sessionLoading, storedUser?.email]);

  // ✅ Effect to manage polling based on user status
  useEffect(() => {
    if (!storedUser) return;

    // Start polling if user becomes inactive
    if (storedUser.user_status !== "active" && !isPollingRef.current) {
      console.log("👤 User status changed to inactive, starting polling...");
      startPolling();
    }

    // Stop polling if user becomes active
    if (storedUser.user_status === "active" && isPollingRef.current) {
      console.log("✅ User status changed to active, stopping polling...");
      stopPolling();
    }
  }, [storedUser?.user_status]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  // Manual refetch function
  const refetchUser = async () => {
    if (!session) {
      logout();
      return;
    }

    setIsLoading(true);
    await fetchAndUpdateUser();
    setIsLoading(false);
  };

  return {
    user: storedUser,
    isLoading: isLoading || sessionLoading,
    refetchUser,
    isAuthenticated: !!session && !!storedUser,
    isPollingForVerification: isPollingRef.current, // ✅ Expose polling status
  };
}
