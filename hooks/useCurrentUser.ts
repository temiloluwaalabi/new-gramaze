import { useEffect, useState } from "react";

import { authService } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import { User } from "@/types";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.getUserDetails();

        if (res instanceof ApiError) {
          throw res;
        }

        // ✅ Only pick plain serializable fields
        const userData: User = {
           id: res.data.user.id,
           first_name: res.data.user.first_name,
           last_name: res.data.user.last_name,
           email: res.data.user.email,
           email_verified_at: null,
           agree_to_terms: "",
           user_type: null,
           user_role: "",
           has_set_user_type: "",
           plan: null,
           dob: null,
           gender: null,
           phone: null,
           has_set_bio_data: "",
           address: null,
           medical_history: null,
           medical_file: null,
           has_set_medical_history: "",
           has_set_up_appointment: "",
           has_set_plan: "",
           user_status: "",
           last_login_time: null,
           created_at: "",
           updated_at: "",
           activities_notification: null,
           factor_authentication: null,
           reminder_notification: null,
           dependents: null,
           message_notification: null,
           relationship_to_emergency_contact: null,
           emergency_contact_name: null,
           emergency_contact_phone: null,
           connected_device: null,
           image: null
        };

        setUser(userData);
      } catch (err) {
        console.error("Failed to load user", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading };
}
