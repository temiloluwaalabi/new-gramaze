"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getUserAppointments,
  getAppointmentDetail,
  rescheduleAppointment,
  getCaregiverAppointments,
  getCaregiverAppointmentDetails,
  markAppointmentAsArrived,
  confirmAppointmentArrival,
} from "@/app/actions/services/appointment.actions";
import {
  getAllHospitals,
  getALlLGAs,
  getAllStates,
} from "@/app/actions/services/hospital.actions";

import { handleMutationError } from "./handle-mutation-error";

// User Appointment Queries
export const useGetUserAppointments = ({
  date,
  caregiver,
  time,
  per_page,
  page,
}: {
  date?: string;
  caregiver?: string;
  time?: string;
  per_page?: number;
  page?: number;
} = {}) => {
  return useQuery({
    queryKey: [
      "appointments",
      "user",
      { date, caregiver, time, per_page, page },
    ],
    queryFn: () =>
      getUserAppointments({ date, caregiver, time, per_page, page }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGetAppointmentDetail = (appointmentId: string) => {
  return useQuery({
    queryKey: ["appointments", "detail", appointmentId],
    queryFn: () => getAppointmentDetail(appointmentId),
    enabled: !!appointmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// User Appointment Mutations
export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["appointments", "reschedule"],
    mutationFn: async (values: {
      id: number;
      date: string;
      time: string;
      additional_note: string;
    }) => {
      const data = await rescheduleAppointment(values);
      if (data.success) {
        return data;
      }
      throw new Error(data.message || "Rescheduling appointment failed");
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      toast.success(data.message || "Appointment rescheduled successfully!");

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["appointments", "user"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "detail"] });

      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};

// Caregiver Appointment Queries
export const useGetCaregiverAppointments = ({
  per_page,
  page,
}: {
  per_page?: number;
  page?: number;
} = {}) => {
  return useQuery({
    queryKey: ["appointments", "caregiver", { per_page, page }],
    queryFn: () => getCaregiverAppointments({ per_page, page }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGetCaregiverAppointmentDetails = (appointmentId: string) => {
  return useQuery({
    queryKey: ["appointments", "caregiver", "detail", appointmentId],
    queryFn: () => getCaregiverAppointmentDetails(appointmentId),
    enabled: !!appointmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
export const useGetAllHospitals = () => {
  return useQuery({
    queryKey: ["getAllHospitals"],
    queryFn: () => getAllHospitals(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
export const useGetAllStates = () => {
  return useQuery({
    queryKey: ["states"],
    queryFn: () => getAllStates(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
export const useGetAllLGAs = () => {
  return useQuery({
    queryKey: ["lgas"],
    queryFn: () => getALlLGAs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Caregiver Appointment Mutations
export const useMarkAppointmentAsArrived = (pathname: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["appointments", "markArrived"],
    mutationFn: async (values: FormData) => {
      console.log("FORMDATA", values);

      const data = await markAppointmentAsArrived(values, pathname);
      if (data.success) {
        return data;
      }
      throw new Error(data.message || "Marking appointment as arrived failed");
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      toast.success(
        data.message || "Appointment marked as arrived successfully!"
      );

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["appointments", "caregiver"],
      });
      queryClient.invalidateQueries({ queryKey: ["appointments", "detail"] });

      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};

export const useConfirmAppointmentArrival = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["appointments", "confirmArrival"],
    mutationFn: async (values: {
      id: string;
      arrival_photo: string;
      arrival_current_address: string;
    }) => {
      const data = await confirmAppointmentArrival(values);
      if (data.success) {
        return data;
      }
      throw new Error(data.message || "Confirming appointment arrival failed");
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      toast.success(
        data.message || "Appointment arrival confirmed successfully!"
      );

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["appointments", "caregiver"],
      });
      queryClient.invalidateQueries({ queryKey: ["appointments", "detail"] });

      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};

// Utility hook to refetch appointment data
export const useRefetchAppointments = () => {
  const queryClient = useQueryClient();

  return {
    refetchUserAppointments: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "user"] });
    },
    refetchCaregiverAppointments: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointments", "caregiver"],
      });
    },
    refetchAppointmentDetails: (appointmentId?: string) => {
      if (appointmentId) {
        queryClient.invalidateQueries({
          queryKey: ["appointments", "detail", appointmentId],
        });
        queryClient.invalidateQueries({
          queryKey: ["appointments", "caregiver", "detail", appointmentId],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["appointments", "detail"] });
      }
    },
    refetchAllAppointments: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  };
};
