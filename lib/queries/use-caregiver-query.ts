"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getCaregiverHistory,
  getCaregiverHistoryDetails,
  rateCaregiver,
} from "@/app/actions/services/caregiver.actions";

import { handleMutationError } from "./handle-mutation-error";
import { updatePlan } from "@/app/actions/caregiver-patient.actions";

// ============= CAREGIVER QUERIES =============
export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "patients", "updatePlan"],
    mutationFn: async (values: {
      user_id: number;
      plan: string;
      pathname: string;
    }) => {
      const data = await updatePlan(
        { user_id: values.user_id, plan: values.plan },
        values.pathname
      );
      if (data.success) {
        return data;
      }
      throw new Error(data.message || "Updating plan failed");
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      // toast.success(data.message || "Plan updated successfully!");

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["admin", "patients"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });

      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};

// Get Caregiver History
export const useGetCaregiverHistory = ({
  per_page,
  end_date,
  start_date,
  caregiver,
}: {
  start_date?: string;
  caregiver?: string;
  end_date?: string;
  per_page?: number;
} = {}) => {
  return useQuery({
    queryKey: [
      "caregivers",
      "history",
      { per_page, end_date, start_date, caregiver },
    ],
    queryFn: () =>
      getCaregiverHistory({ per_page, end_date, start_date, caregiver }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Caregiver History Details
export const useGetCaregiverHistoryDetails = (caregiver_id: string) => {
  return useQuery({
    queryKey: ["caregivers", "history", "details", caregiver_id],
    queryFn: () => getCaregiverHistoryDetails(caregiver_id),
    enabled: !!caregiver_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ============= CAREGIVER MUTATIONS =============

// Rate Caregiver Mutation
export const useRateCaregiver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["caregivers", "rate"],
    mutationFn: async (values: {
      caregiver_id: number;
      rating: number;
      feedback: string;
    }) => {
      const data = await rateCaregiver(values);
      if (data.success) {
        return data;
      }
      throw new Error(data.message || "Rating caregiver failed");
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      toast.success(data.message || "Caregiver rated successfully!");

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["caregivers", "history"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });

      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};
// Caregiver Utility Hook
export const useRefetchCaregivers = () => {
  const queryClient = useQueryClient();

  return {
    refetchCaregiverHistory: () => {
      queryClient.invalidateQueries({ queryKey: ["caregivers", "history"] });
    },
    refetchCaregiverDetails: (caregiver_id?: string) => {
      if (caregiver_id) {
        queryClient.invalidateQueries({
          queryKey: ["caregivers", "history", "details", caregiver_id],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["caregivers", "history", "details"],
        });
      }
    },
    refetchAllCaregivers: () => {
      queryClient.invalidateQueries({ queryKey: ["caregivers"] });
    },
  };
};
