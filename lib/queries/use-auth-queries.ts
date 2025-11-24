"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getOtherUsersInfo,
  InitiatePasswordReset,
  LoginAction,
  OnboardUserPlan,
  OnboardUserType,
  PhysicalHomeAppointment,
  PhysicalHospitalAppointment,
  RegisterStepOne,
  ResetPassword,
  UpdateMedicalReport,
  UpdateNotificationSettings,
  UpdateUserBiodate,
  UpdateUserProfile,
  VirtualAppointment,
} from "@/app/actions/auth.actions";

import { handleMutationError } from "./handle-mutation-error";
import {
  BiodataSchemaType,
  LoginSchemaType,
  RegisterSchemaType,
} from "../schemas/user.schema";

export const useRegisterStepOne = () => {
  return useMutation({
    mutationKey: ["auth", "registerStepOne"],
    mutationFn: async (values: RegisterSchemaType) => {
      const data = await RegisterStepOne(values);
      console.log("DATA", data);
      if (!data.success) {
        throw data;
      }
      return data;
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      toast.success(
        "Registration successful! Please check your email for verification."
      );
      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};
export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: async (values: LoginSchemaType) => {
      const data = await LoginAction(values);
      if (!data.success) {
        throw data;
      }
      // Optionally, throw an error or return a value for unsuccessful cases
      return data;
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      // Show a success toast message
      toast.success(data.message || "Login successful!");
      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};
export const useSetUserTypeMutation = () => {
  return useMutation({
    mutationKey: ["onboarding", "userType"],
    mutationFn: async (userType: string) => {
      const data = await OnboardUserType(userType);
      if (data.success) {
        return data;
      }
      // Optionally, throw an error or return a value for unsuccessful cases
      throw new Error(data.message || "Setting user type failed");
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      // Show a success toast message
      // toast.success(data.message || "User type set successfully!");
      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};
export const useSetUserPlanMutation = () => {
  return useMutation({
    mutationKey: ["onboarding", "userPlan"],
    mutationFn: async (userPlan: string) => {
      const data = await OnboardUserPlan(userPlan);
      if (data.success) {
        return data;
      }
      // Optionally, throw an error or return a value for unsuccessful cases
      throw new Error(data.message || "Setting user plan failed");
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      // Show a success toast message
      // toast.success(data.message || "User plan set successfully!");
      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};
export const useUpdateBiodate = () => {
  return useMutation({
    mutationKey: ["onboard", "biodata"],
    mutationFn: async (values: BiodataSchemaType) => {
      const data = await UpdateUserBiodate(values);
      if (!data.success) {
        throw data;
      }
      // Optionally, throw an error or return a value for unsuccessful cases
      return data;
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      // Show a success toast message
      toast.success(data.message || "Login successful!");
      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};
export const useUpdateMedicalReport = () => {
  return useMutation({
    mutationKey: ["onboard", "medicalReport"],
    mutationFn: async (values: FormData) => {
      console.log("FORMDATA", FormData);
      const data = await UpdateMedicalReport(values);
      if (data.success) {
        return data;
      }
      // Optionally, throw an error or return a value for unsuccessful cases
      throw new Error(data.message);
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      // Show a success toast message
      toast.success(data.message || "Medical report updated successfully!");
      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};
export const useVirtualAppointment = () => {
  return useMutation({
    mutationKey: ["onboard", "virtualAppointment"],
    mutationFn: async (values: {
      appointment_type: string;
      date: string;
      time: string;
      location: string;
      meeting_link: string;
      additional_address: string;
      interested_physical_appointment?: string;
      proposed_hospital_area?: string;
    }) => {
      const data = await VirtualAppointment(values);
      if (data.success) {
        return data;
      }
      // Optionally, throw an error or return a value for unsuccessful cases
      throw new Error(data.message);
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      // Show a success toast message
      toast.success(
        data.message || "Virtual appointment scheduled successfully!"
      );
      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};
export const usePhysicalVirtualAppointment = () => {
  return useMutation({
    mutationKey: ["onboard", "physcialVirtualAppointment"],
    mutationFn: async (values: {
      appointment_type: string;
      visit_type: string;
      date: string;
      time: string;
      home_address: string;
      contact: string;
      additional_note: string;
    }) => {
      const data = await PhysicalHomeAppointment(values);
      if (data.success) {
        return data;
      }
      // Optionally, throw an error or return a value for unsuccessful cases
      throw new Error(data.message);
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      // Show a success toast message
      toast.success(
        data.message || "Physical home appointment scheduled successfully!"
      );
      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};
export const usePhysicalHospitalAppointment = () => {
  return useMutation({
    mutationKey: ["onboard", "physicalHospitalAppointment"],
    mutationFn: async (values: {
      appointment_type: string;
      visit_type: string;
      date: string;
      time: string;
      hospital_name: string;
      hospital_address: string;
      contact: string;
      additional_note: string;
    }) => {
      console.log("VALUES IN HOOK", values);
      const data = await PhysicalHospitalAppointment(values);
      if (data.success) {
        return data;
      }
      // Optionally, throw an error or return a value for unsuccessful cases
      throw new Error(data.message);
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      // Show a success toast message
      toast.success(
        data.message || "Physical hospital appointment scheduled successfully!"
      );
      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};
export const useUpdateProfile = () => {
  return useMutation({
    mutationKey: ["user", "profile"],
    mutationFn: async (values: BiodataSchemaType) => {
      const data = await UpdateUserProfile(values);
      if (data.success) {
        return data;
      }
      // Optionally, throw an error or return a value for unsuccessful cases
      throw new Error(data.message);
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      // Show a success toast message
      toast.success(data.message || "Login successful!");
      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};
export const useUpdateNotificationSetting = () => {
  return useMutation({
    mutationKey: ["settings", "notification"],
    mutationFn: async (values: {
      activities_notification: string;
      factor_authentication: string;
      reminder_notification: string;
    }) => {
      const data = await UpdateNotificationSettings(values);
      if (data.success) {
        return data;
      }
      // Optionally, throw an error or return a value for unsuccessful cases
      throw new Error(data.message);
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      // Show a success toast message
      // toast.success(data.message || "Login successful!");
      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};
export const usePasswordReset = () => {
  return useMutation({
    mutationKey: ["auth", "password-reset"],
    mutationFn: async (values: {
      email: string;
      token: string;
      password: string;
      password_confirmation: string;
    }) => {
      const data = await ResetPassword(values);
      if (data.success) {
        return data;
      }
      // Optionally, throw an error or return a value for unsuccessful cases
      throw new Error(data.message);
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      // Show a success toast message
      // toast.success(data.message || "Login successful!");
      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};
export const useInitiatePasswordReset = (authSide?: boolean) => {
  return useMutation({
    mutationKey: ["auth", "password-reset-initiate"],
    mutationFn: async (values?: { email?: string }) => {
      const data = await InitiatePasswordReset(values, authSide);
      if (data.success) {
        return data;
      }
      // Optionally, throw an error or return a value for unsuccessful cases
      throw new Error(data.message);
    },
    onSuccess: (data) => {
      console.log("SUCCESS DATA", data);
      // Show a success toast message
      // toast.success(data.message || "Login successful!");
      return data;
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};
// Combined Utility Hook for Dashboard/Overview Pages
export const useRefetchDashboardData = () => {
  const queryClient = useQueryClient();

  return {
    refetchDashboard: () => {
      // Refresh all critical dashboard data
      queryClient.invalidateQueries({ queryKey: ["healthTracker", "last"] });
      queryClient.invalidateQueries({
        queryKey: ["healthTracker", "reports", "lastThree"],
      });
      queryClient.invalidateQueries({
        queryKey: ["healthTracker", "notes", "lastThree"],
      });
      queryClient.invalidateQueries({ queryKey: ["appointments", "user"] });
      queryClient.invalidateQueries({ queryKey: ["caregivers", "history"] });
    },
  };
};
export const useGetOtherUser = ({ user_id }: { user_id: number }) => {
  return useQuery({
    queryKey: ["users", "others", { user_id }],
    queryFn: () => getOtherUsersInfo(user_id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
