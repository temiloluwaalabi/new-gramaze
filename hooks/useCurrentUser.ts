/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useRef, useState } from "react";

import { authService } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import { useUserStore } from "@/store/user-store";
import { User } from "@/types";

import useSession from "./use-session";

export function useCurrentUser() {
  const { session, isLoading: sessionLoading } = useSession();
  const { user: storedUser, setUser, logout } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const hasInitializedRef = useRef(false); // ✅ Use ref instead of state
  const hasSeenSessionRef = useRef(false); // ✅ Track if we've ever seen a session

  console.log("🔍 User Store Debug:", {
    session: session?.email,
    storedUser: storedUser?.email,
    sessionLoading,
    hasInitialized: hasInitializedRef.current,
    hasSeenSession: hasSeenSessionRef.current,
    timestamp: new Date().toISOString(),
  });

  console.log("SESSION", session);
  console.log("HOOK USER", storedUser);
  useEffect(() => {
    const syncUserData = async () => {
      // ✅ Wait for session to finish loading before making decisions
      if (sessionLoading) {
        return;
      }
      // ✅ Track if we've ever had a session
      if (session) {
        hasSeenSessionRef.current = true;
      }

      // No session - logout only after initialization
      //  if (!session) {
      //   if (hasInitializedRef.current && hasSeenSessionRef.current) {
      //     console.log("🚪 Logging out - no session after having one");
      //     logout();
      //   }
      //   setIsLoading(false);
      //   hasInitializedRef.current = true;
      //   return;
      // }
      // ✅ Mark that we've seen the first session state
      // hasInitializedRef.current = true;

      // Skip if we already have matching user data
      if (storedUser && storedUser.email === session?.email) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await authService.getUserDetails();

        if (res instanceof ApiError) {
          throw res;
        }

        // ✅ Map the actual response data
        const userData: User = {
          id: res.data.user.id,
          first_name: res.data.user.first_name,
          last_name: res.data.user.last_name,
          email: res.data.user.email,
          email_verified_at: res.data.user.email_verified_at || null,
          agree_to_terms: res.data.user.agree_to_terms || "",
          user_type: res.data.user.user_type || null,
          user_role: res.data.user.user_role || "",
          has_set_user_type: res.data.user.has_set_user_type || "",
          plan: res.data.user.plan || null,
          dob: res.data.user.dob || null,
          gender: res.data.user.gender || null,
          phone: res.data.user.phone || null,
          has_set_bio_data: res.data.user.has_set_bio_data || "",
          address: res.data.user.address || null,
          medical_history: res.data.user.medical_history || null,
          medical_file: res.data.user.medical_file || null,
          has_set_medical_history: res.data.user.has_set_medical_history || "",
          has_set_up_appointment: res.data.user.has_set_up_appointment || "",
          has_set_plan: res.data.user.has_set_plan || "",
          user_status: res.data.user.user_status || "",
          last_login_time: res.data.user.last_login_time || null,
          created_at: res.data.user.created_at || "",
          updated_at: res.data.user.updated_at || "",
          activities_notification:
            res.data.user.activities_notification || null,
          factor_authentication: res.data.user.factor_authentication || null,
          reminder_notification: res.data.user.reminder_notification || null,
          dependents: res.data.user.dependents || null,
          message_notification: res.data.user.message_notification || null,
          relationship_to_emergency_contact:
            res.data.user.relationship_to_emergency_contact || null,
          emergency_contact_name: res.data.user.emergency_contact_name || null,
          emergency_contact_phone:
            res.data.user.emergency_contact_phone || null,
          connected_device: res.data.user.connected_device || null,
          image: res.data.user.image || null,
        };

        // Update the store with fresh user data
        setUser(userData);
      } catch (err: any) {
        console.error("Failed to load user", err);
        // ⚠️ Only logout on auth errors, not network errors
        if (err.status === 401 || err.status === 403) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    syncUserData();
  }, [session, sessionLoading, storedUser?.email]); // Re-sync when session changes

  useEffect(() => {
    console.log("🔍 User Store Debug:", {
      session: session?.email,
      storedUser: storedUser?.email,
      sessionLoading,
      hasInitialized: hasInitializedRef.current,
      timestamp: new Date().toISOString(),
    });
  }, [session, storedUser, sessionLoading]);

  // Manual refetch function that also updates the store
  const refetchUser = async () => {
    if (!session) {
      logout();
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.getUserDetails();

      if (!(res instanceof ApiError)) {
        const userData: User = {
          id: res.data.user.id,
          first_name: res.data.user.first_name,
          last_name: res.data.user.last_name,
          email: res.data.user.email,
          email_verified_at: res.data.user.email_verified_at || null,
          agree_to_terms: res.data.user.agree_to_terms || "",
          user_type: res.data.user.user_type || null,
          user_role: res.data.user.user_role || "",
          has_set_user_type: res.data.user.has_set_user_type || "",
          plan: res.data.user.plan || null,
          dob: res.data.user.dob || null,
          gender: res.data.user.gender || null,
          phone: res.data.user.phone || null,
          has_set_bio_data: res.data.user.has_set_bio_data || "",
          address: res.data.user.address || null,
          medical_history: res.data.user.medical_history || null,
          medical_file: res.data.user.medical_file || null,
          has_set_medical_history: res.data.user.has_set_medical_history || "",
          has_set_up_appointment: res.data.user.has_set_up_appointment || "",
          has_set_plan: res.data.user.has_set_plan || "",
          user_status: res.data.user.user_status || "",
          last_login_time: res.data.user.last_login_time || null,
          created_at: res.data.user.created_at || "",
          updated_at: res.data.user.updated_at || "",
          activities_notification:
            res.data.user.activities_notification || null,
          factor_authentication: res.data.user.factor_authentication || null,
          reminder_notification: res.data.user.reminder_notification || null,
          dependents: res.data.user.dependents || null,
          message_notification: res.data.user.message_notification || null,
          relationship_to_emergency_contact:
            res.data.user.relationship_to_emergency_contact || null,
          emergency_contact_name: res.data.user.emergency_contact_name || null,
          emergency_contact_phone:
            res.data.user.emergency_contact_phone || null,
          connected_device: res.data.user.connected_device || null,
          image: res.data.user.image || null,
        };

        setUser(userData);
      }
    } catch (err) {
      console.error("Failed to refetch user", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Return data from the store (single source of truth)
  return {
    user: storedUser,
    isLoading: isLoading || sessionLoading,
    refetchUser,
    isAuthenticated: !!session && !!storedUser,
  };
}
