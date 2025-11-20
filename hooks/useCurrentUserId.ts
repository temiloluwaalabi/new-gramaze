import { useEffect, useState } from "react";

import { authService } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";

export function useCurrentUserId() {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.getUserDetails();

        if (res instanceof ApiError) {
          console.error("Error fetching user details:", res.message);
          return;
        }

        setUserId(res.data.user.id); 
      } catch (err) {
        console.error("Unexpected error loading user:", err);
      }
    };

    fetchUser();
  }, []);

  return userId;
}
