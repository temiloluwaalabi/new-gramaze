/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { revalidatePath } from "next/cache";

import { adminServices, authService } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import {
  BiodataSchema,
  BiodataSchemaType,
  LoginSchema,
  LoginSchemaType,
  RegisterSchema,
  RegisterSchemaType,
  RegisterVerifyEmailStepSchema,
  RegisterVerifyEmailStepType,
  ResendOTPSchema,
  ResendOTPSchemaType,
} from "@/lib/schemas/user.schema";
import { ApiResponse, Appointment, ServerActionResponse, User } from "@/types";

import {
  getSession,
  LoginSession,
  OnboardSession,
  RegisterSession,
  RegisterStepTwoSession,
} from "./session.actions";

export const RegisterStepOne = async (
  values: RegisterSchemaType
): Promise<
  ServerActionResponse<{
    status: true;
    message: string;
    token: string;
    user_data: {
      first_name: string;
      last_name: string;
      email: string;
      agree_to_terms: boolean;
      updated_at: string;
      created_at: string;
      id: number;
    };
  }>
> => {
  try {
    const validatedValues = RegisterSchema.safeParse(values);

    if (!validatedValues.success) {
      const fieldErrors: Record<string, string[]> = {};

      Object.entries(validatedValues.error.flatten().fieldErrors).forEach(
        ([key, value]) => {
          if (value) {
            fieldErrors[key] = value;
          }
        }
      );

      // Return error object instead of throwing
      return {
        success: false,
        message: "Validation failed",
        errors: fieldErrors as Record<string, string[]>,
        statusCode: 400,
        errorType: "VALIDATION_ERROR",
      };
    }

    const response = await authService.registerStepOne(
      validatedValues.data,
      "/register"
    );

    if (ApiError.isAPiError(response)) {
      const apiError = response as ApiError;
      // Return the error with all its details
      return {
        success: false,
        message: apiError.message,
        errors: apiError.rawErrors as Record<string, string[]>,
        statusCode: apiError.statusCode,
        errorType: apiError.errorType,
      };
    }

    // At this point, response is not an ApiError
    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: {
        status: true;
        message: string;
        token: string;
        user_data: {
          first_name: string;
          last_name: string;
          email: string;
          agree_to_terms: boolean;
          updated_at: string;
          created_at: string;
          id: number;
        };
      };
    };

    await RegisterSession(
      successResponse.data.token,
      successResponse.data.user_data
    );
    return {
      success: true,
      message: successResponse.message,
      data: successResponse.data,
    };
  } catch (error) {
    console.error("RegisterStepOne error:", error);
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errors: error.rawErrors as Record<string, string[]>,
        statusCode: error.statusCode,
        errorType: error.errorType,
      };
    }

    // For any other error
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
      errorType: "UnknownError",
    };
  }
};
export const LoginAction = async (
  values: LoginSchemaType
): Promise<
  ServerActionResponse<{
    status: true;
    message: string;
    token: string;
    user: User;
  }>
> => {
  try {
    const validatedValues = LoginSchema.safeParse(values);

    if (!validatedValues.success) {
      const fieldErrors: Record<string, string[]> = {};

      Object.entries(validatedValues.error.flatten().fieldErrors).forEach(
        ([key, value]) => {
          if (value) {
            fieldErrors[key] = value;
          }
        }
      );

      return {
        success: false,
        message: "Validation failed",
        errors: fieldErrors as Record<string, string[]>,
        statusCode: 400,
        errorType: "VALIDATION_ERROR",
      };
    }

    const response = await authService.Login(validatedValues.data, "/sign-in");

    if (ApiError.isAPiError(response)) {
      const apiError = response as ApiError;
      console.log("AYPGS", response);

      // Return the error with all its details
      return {
        success: false,
        message: apiError.message,
        errors: apiError.rawErrors as Record<string, string[]>,
        statusCode: apiError.statusCode,
        errorType: apiError.errorType,
      };
    }
    // At this point, response is not an ApiError
    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: { status: true; message: string; token: string; user: User };
    };

    console.log("RESPONSE", successResponse);

    await LoginSession(successResponse.data.user, successResponse.data.token);
    if (successResponse.data.user.factor_authentication === "yes") {
      const token = await Resend2faOTP(
        {
          email: successResponse.data.user.email,
        },
        "/sign-in"
      );

      console.log("2FA TOken sent", token);
    }
    if (successResponse.data.user.factor_authentication !== "yes") {
      await RegisterStepTwoSession();
    }
    revalidatePath("/");
    return {
      success: true,
      message: successResponse.message,
      data: successResponse.data,
    };
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errors: error.rawErrors as Record<string, string[]>,
        statusCode: error.statusCode,
        errorType: error.errorType,
      };
    }

    // For any other error
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
      errorType: "UnknownError",
    };
  }
};
export const OnboardUserType = async (userType: string) => {
  try {
    if (!userType) {
      throw new ApiError({
        statusCode: 400,
        message: "User type is required",
        errorType: "ValidationError",
      });
    }

    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await authService.onboardSetUserType(
      userType,
      "/onboarding"
    );

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    // At this point, response is not an ApiError
    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: { status: true; message: string };
      rawResponse: ApiResponse<{ status: true; message: string }>;
    };

    revalidatePath("/onboarding");
    return {
      success: true,
      message: successResponse.message,
    };
  } catch (error) {
    console.error(" Onboard User Error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError({
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};
export const OnboardUserPlan = async (userPlan: string) => {
  try {
    if (!userPlan) {
      throw new ApiError({
        statusCode: 400,
        message: "User type is required",
        errorType: "ValidationError",
      });
    }

    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await authService.onboardSetUserPlan(
      userPlan,
      "/onboarding"
    );

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    // At this point, response is not an ApiError
    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: { status: true; message: string };
      rawResponse: ApiResponse<{ status: true; message: string }>;
    };

    revalidatePath("/onboarding");
    return {
      success: true,
      message: successResponse.message,
    };
  } catch (error) {
    console.error("Onboard USER PLAN ERROR:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError({
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};
export const UpdateUserBiodate = async (
  values: BiodataSchemaType
): Promise<ServerActionResponse<User>> => {
  try {
    const validatedValues = BiodataSchema.safeParse(values);

    if (!validatedValues.success) {
      const fieldErrors: Record<string, string[]> = {};

      Object.entries(validatedValues.error.flatten().fieldErrors).forEach(
        ([key, value]) => {
          if (value) {
            fieldErrors[key] = value;
          }
        }
      );

      return {
        success: false,
        message: "Validation failed",
        errors: fieldErrors as Record<string, string[]>,
        statusCode: 400,
        errorType: "VALIDATION_ERROR",
      };
    }

    console.log("VALUES", values);
    const response = await authService.UpdateuserBiodata(validatedValues.data);

    console.log("RESPONSE", response);

    if (ApiError.isAPiError(response)) {
      const apiError = response as ApiError;
      console.log("AYPGS", response);

      // Return the error with all its details
      return {
        success: false,
        message: apiError.message,
        errors: apiError.rawErrors as Record<string, string[]>,
        statusCode: apiError.statusCode,
        errorType: apiError.errorType,
      };
    }

    // At this point, response is not an ApiError
    const successResponse = response as unknown as {
      status: true;
      message: string;
      user: User;
    };

    revalidatePath("/");
    return {
      success: true,
      message: successResponse.message,
      data: successResponse.user,
    };
  } catch (error) {
    console.error("Update BIODATA ERROR:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errors: error.rawErrors as Record<string, string[]>,
        statusCode: error.statusCode,
        errorType: error.errorType,
      };
    }

    // For any other error
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
      errorType: "UnknownError",
    };
  }
};
export const UpdateUserProfile = async (values: BiodataSchemaType) => {
  try {
    const validatedValues = BiodataSchema.safeParse(values);

    if (!validatedValues.success) {
      const fieldErrors: Record<string, string[]> = {};

      Object.entries(validatedValues.error.flatten().fieldErrors).forEach(
        ([key, value]) => {
          if (value) {
            fieldErrors[key] = value;
          }
        }
      );

      throw new ApiError({
        statusCode: 400,
        message: "Validation failed",
        errorType: "ValidationError",
        rawErrors: fieldErrors,
      });
    }

    console.log("VALUES", values);
    const response = await authService.UpdateuserProfile(validatedValues.data);

    console.log("RESPONSE", response);

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    // At this point, response is not an ApiError
    const successResponse = response as unknown as {
      success: boolean;
      status: number;
      message: string;
      data: {
        status: boolean;
        message: string;
        user: User;
      };
    };

    revalidatePath("/");
    return {
      success: true,
      message: successResponse.message,
      user: successResponse.data.user,
    };
  } catch (error) {
    console.error("Update BIODATA ERROR:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError({
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};
export const UpdateNotificationSettings = async (values: {
  activities_notification: string;
  message_notification: string;
  reminder_notification: string;
}) => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    console.log("VALUES", values);
    const response = await authService.UpdateNotificationSettings(values);

    console.log("RESPONSE", response);

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    // At this point, response is not an ApiError
    const successResponse = response as unknown as {
      status: true;
      message: string;
      user: User;
    };

    revalidatePath("/");
    return {
      success: true,
      message: successResponse.message,
      user: successResponse.user,
    };
  } catch (error) {
    console.error("Update NOTIFICATION ERROR:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError({
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};
export const Update2FA = async (values: { factor_authentication: string }) => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      return {
        success: false,
        message: "Not Authorized",
        statusCode: 500,
        errorType: "VALIDATION_ERROR",
      };
    }

    const response = await authService.Update2FA(values);

    if (ApiError.isAPiError(response)) {
      const apiError = response as ApiError;
      // Return the error with all its details
      return {
        success: false,
        message: apiError.message,
        errors: apiError.rawErrors as Record<string, string[]>,
        statusCode: apiError.statusCode,
        errorType: apiError.errorType,
      };
    }

    // At this point, response is not an ApiError
    const successResponse = response as unknown as {
      status: true;
      message: string;
      user: User;
    };

    revalidatePath("/");
    return {
      success: true,
      message: successResponse.message,
      user: successResponse.user,
    };
  } catch (error) {
    console.error("Update NOTIFICATION ERROR:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errors: error.rawErrors as Record<string, string[]>,
        statusCode: error.statusCode,
        errorType: error.errorType,
      };
    }

    // For any other error
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
      errorType: "UnknownError",
    };
  }
};
export const ResetPassword = async (values: {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}) => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    console.log("VALUES", values);
    const response = await authService.ResetPassword(values);

    console.log("RESPONSE", response);

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    // At this point, response is not an ApiError
    const successResponse = response as unknown as {
      status: true;
      message: string;
      user: User;
    };

    revalidatePath("/");
    return {
      success: true,
      message: successResponse.message,
      user: successResponse.user,
    };
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError({
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};
export const InitiatePasswordReset = async (
  values?: { email?: string },
  authSide?: boolean
) => {
  try {
    console.log("VALUES", values);
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await authService.InitiatePasswordReset(values, authSide);

    console.log("RESPONSE", response);

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    // At this point, response is not an ApiError
    const successResponse = response as unknown as {
      status: true;
      message: string;
    };

    revalidatePath("/");
    return {
      success: true,
      message: successResponse.message,
    };
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError({
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};
export const UpdateMedicalReport = async (values: FormData) => {
  try {
    console.log("FORMDATA", values);
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await authService.UpdateMedicalReport(
      values,
      "/onboarding"
    );

    console.log("RESPONSE", response);

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    // At this point, response is not an ApiError
    const successResponse = response as unknown as {
      success: true;
      status: true;
      message: string;
      data: {
        status: true;
        message: string;
        user: User;
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        user: User;
      }>;
    };

    revalidatePath("/");
    return {
      success: true,
      message: successResponse.message,
      user: successResponse.data.user,
    };
  } catch (error) {
    console.error("Update BIODATA ERROR:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError({
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};
export const VirtualAppointment = async (values: {
  appointment_type: string;
  date: string;
  time: string;
  location: string;
  meeting_link: string;
  additional_address: string;
  interested_physical_appointment?: string;
  proposed_hospital_area?: string;
}) => {
  try {
    console.log("VALUES", values);
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await authService.VirtualAppointment(
      values,
      "/onboarding"
    );

    console.log("RESPONSE", response);

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    // At this point, response is not an ApiError
    const successResponse = response as unknown as {
      success: true;
      status: true;
      message: string;
      data: {
        status: true;
        message: string;
        appointment: Appointment;
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        appointment: Appointment;
      }>;
    };

    revalidatePath("/");

    if (!sessionToken.isBoarded) {
      await OnboardSession();
    }
    return {
      success: true,
      message: successResponse.message,
      appointment: successResponse.data.appointment,
    };
  } catch (error) {
    console.error("Virtual Appointment Error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError({
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};
export const PhysicalHomeAppointment = async (values: {
  appointment_type: string;
  visit_type: string;
  date: string;
  time: string;
  home_address: string;
  contact: string;
  additional_note: string;
}) => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await authService.PhysicalHomeAppointment(
      values,
      "/onboarding"
    );

    console.log("RESPONSE", response);

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    // At this point, response is not an ApiError
    const successResponse = response as unknown as {
      success: true;
      status: true;
      message: string;
      data: {
        status: true;
        message: string;
        appointment: Appointment;
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        appointment: Appointment;
      }>;
    };

    revalidatePath("/");
    if (!sessionToken.isBoarded) {
      await OnboardSession();
    }
    return {
      success: true,
      message: successResponse.message,
      appointment: successResponse.data.appointment,
    };
  } catch (error) {
    console.error("Physical Home Appointment Error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError({
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};
export const PhysicalHospitalAppointment = async (values: {
  appointment_type: string;
  visit_type: string;
  date: string;
  time: string;
  hospital_name: string;
  hospital_address: string;
  contact: string;
  additional_note: string;
}) => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await authService.PhysicalHospitalAppointment(
      values,
      "/onboarding"
    );

    console.log("RESPONSE", response);

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    // At this point, response is not an ApiError
    const successResponse = response as unknown as {
      success: true;
      status: true;
      message: string;
      data: {
        status: true;
        message: string;
        appointment: Appointment;
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        appointment: Appointment;
      }>;
    };

    revalidatePath("/");
    if (!sessionToken.isBoarded) {
      await OnboardSession();
    }
    return {
      success: true,
      message: successResponse.message,
      appointment: successResponse.data.appointment,
    };
  } catch (error) {
    console.error("Physical Home Appointment Error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError({
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};
export const getUserInfo = async () => {
  try {
    const response = await authService.getUserDetails();
    if (ApiError.isAPiError(response)) {
      throw response;
    }

    const successResponse = response as unknown as {
      success: true;
      status: number;
      message: string;
      data: { status: true; message: string; user: User };
      rawResponse: ApiResponse<{ status: true; message: string; user: User }>;
    };

    return {
      success: true,
      message: successResponse.message,
      user: successResponse.data.user,
    };
  } catch (error) {
    console.error("GET USER INFO ERROR:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError({
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};
export const getOtherUsersInfo = async (user_id: number) => {
  try {
    console.log("GET USER CALLED", user_id);
    const response =
      await adminServices.user_management.getUserDetails(user_id);
    if (ApiError.isAPiError(response)) {
      throw response;
    }

    const successResponse = response as unknown as {
      success: true;
      status: number;
      message: string;
      data: { status: true; message: string; user: User };
      rawResponse: ApiResponse<{ status: true; message: string; user: User }>;
    };

    return {
      success: true,
      message: successResponse.message,
      user: successResponse.data.user,
    };
  } catch (error) {
    console.error("GET USER INFO ERROR:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError({
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};

export const ResendOTP = async (
  values: ResendOTPSchemaType,
  pathname: string
): Promise<
  ServerActionResponse<{
    status: true;
    message: string;
  }>
> => {
  try {
    const validatedValues = ResendOTPSchema.safeParse(values);

    if (!validatedValues.success) {
      const fieldErrors: Record<string, string[]> = {};

      Object.entries(validatedValues.error.flatten().fieldErrors).forEach(
        ([key, value]) => {
          if (value) {
            fieldErrors[key] = value;
          }
        }
      );

      return {
        success: false,
        message: "Validation failed",
        errors: fieldErrors as Record<string, string[]>,
        statusCode: 400,
        errorType: "VALIDATION_ERROR",
      };
    }

    const response = await authService.resendOTP(
      validatedValues.data,
      "/sign-in"
    );

    if (ApiError.isAPiError(response)) {
      const apiError = response as ApiError;
      console.log("AYPGS", response);

      // Return the error with all its details
      return {
        success: false,
        message: apiError.message,
        errors: apiError.rawErrors as Record<string, string[]>,
        statusCode: apiError.statusCode,
        errorType: apiError.errorType,
      };
    }
    // At this point, response is not an ApiError
    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: {
        status: boolean;
        message: string;
      };
    };
    revalidatePath(pathname);
    return {
      success: true,
      message: successResponse.message,
    };
  } catch (error) {
    console.error("Resend OTP error:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errors: error.rawErrors as Record<string, string[]>,
        statusCode: error.statusCode,
        errorType: error.errorType,
      };
    }

    // For any other error
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
      errorType: "UnknownError",
    };
  }
};
export const VerifyOTP = async (
  values: RegisterVerifyEmailStepType,
  pathname: string,
  isVerify?: boolean
): Promise<
  ServerActionResponse<{
    status: true;
    message: string;
  }>
> => {
  try {
    const validatedValues = RegisterVerifyEmailStepSchema.safeParse(values);

    if (!validatedValues.success) {
      const fieldErrors: Record<string, string[]> = {};

      Object.entries(validatedValues.error.flatten().fieldErrors).forEach(
        ([key, value]) => {
          if (value) {
            fieldErrors[key] = value;
          }
        }
      );

      return {
        success: false,
        message: "Validation failed",
        errors: fieldErrors as Record<string, string[]>,
        statusCode: 400,
        errorType: "VALIDATION_ERROR",
      };
    }

    const response = await authService.verifyOTP(
      validatedValues.data,
      "/sign-in"
    );

    if (ApiError.isAPiError(response)) {
      const apiError = response as ApiError;
      console.log("AYPGS", response);

      // Return the error with all its details
      return {
        success: false,
        message: apiError.message,
        errors: apiError.rawErrors as Record<string, string[]>,
        statusCode: apiError.statusCode,
        errorType: apiError.errorType,
      };
    }
    // At this point, response is not an ApiError
    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: {
        status: boolean;
        message: string;
      };
    };
    await RegisterStepTwoSession();
    revalidatePath(pathname);
    return {
      success: true,
      message: successResponse.message,
    };
  } catch (error) {
    console.error("Resend OTP error:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errors: error.rawErrors as Record<string, string[]>,
        statusCode: error.statusCode,
        errorType: error.errorType,
      };
    }

    // For any other error
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
      errorType: "UnknownError",
    };
  }
};
export const Resend2faOTP = async (
  values: ResendOTPSchemaType,
  pathname: string
): Promise<
  ServerActionResponse<{
    status: true;
    message: string;
  }>
> => {
  try {
    const validatedValues = ResendOTPSchema.safeParse(values);

    if (!validatedValues.success) {
      const fieldErrors: Record<string, string[]> = {};

      Object.entries(validatedValues.error.flatten().fieldErrors).forEach(
        ([key, value]) => {
          if (value) {
            fieldErrors[key] = value;
          }
        }
      );

      return {
        success: false,
        message: "Validation failed",
        errors: fieldErrors as Record<string, string[]>,
        statusCode: 400,
        errorType: "VALIDATION_ERROR",
      };
    }

    const response = await authService.resend2FAOTP(
      validatedValues.data,
      "/sign-in"
    );

    if (ApiError.isAPiError(response)) {
      const apiError = response as ApiError;
      console.log("AYPGS", response);

      // Return the error with all its details
      return {
        success: false,
        message: apiError.message,
        errors: apiError.rawErrors as Record<string, string[]>,
        statusCode: apiError.statusCode,
        errorType: apiError.errorType,
      };
    }
    // At this point, response is not an ApiError
    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: {
        status: boolean;
        message: string;
      };
    };
    revalidatePath(pathname);
    return {
      success: true,
      message: successResponse.message,
    };
  } catch (error) {
    console.error("Resend OTP error:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errors: error.rawErrors as Record<string, string[]>,
        statusCode: error.statusCode,
        errorType: error.errorType,
      };
    }

    // For any other error
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
      errorType: "UnknownError",
    };
  }
};
export const Verify2faOTP = async (
  values: RegisterVerifyEmailStepType,
  pathname: string,
  isVerify?: boolean
): Promise<
  ServerActionResponse<{
    status: true;
    message: string;
  }>
> => {
  try {
    const validatedValues = RegisterVerifyEmailStepSchema.safeParse(values);

    if (!validatedValues.success) {
      const fieldErrors: Record<string, string[]> = {};

      Object.entries(validatedValues.error.flatten().fieldErrors).forEach(
        ([key, value]) => {
          if (value) {
            fieldErrors[key] = value;
          }
        }
      );

      return {
        success: false,
        message: "Validation failed",
        errors: fieldErrors as Record<string, string[]>,
        statusCode: 400,
        errorType: "VALIDATION_ERROR",
      };
    }

    const response = await authService.verify2FAOTP(
      validatedValues.data,
      "/sign-in"
    );

    if (ApiError.isAPiError(response)) {
      const apiError = response as ApiError;
      console.log("AYPGS", response);

      // Return the error with all its details
      return {
        success: false,
        message: apiError.message,
        errors: apiError.rawErrors as Record<string, string[]>,
        statusCode: apiError.statusCode,
        errorType: apiError.errorType,
      };
    }
    // At this point, response is not an ApiError
    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: {
        status: boolean;
        message: string;
      };
    };
    await RegisterStepTwoSession();
    revalidatePath(pathname);
    return {
      success: true,
      message: successResponse.message,
    };
  } catch (error) {
    console.error("Resend OTP error:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errors: error.rawErrors as Record<string, string[]>,
        statusCode: error.statusCode,
        errorType: error.errorType,
      };
    }

    // For any other error
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
      errorType: "UnknownError",
    };
  }
};
export const UpdateProfileImage = async (values: FormData) => {
  try {
    console.log("FORMDATA", values);
    const sessionToken = await getSession();
    if (!sessionToken) {
      return {
        success: false,
        message: "Validation failed",
        statusCode: 400,
        errorType: "VALIDATION_ERROR",
      };
    }

    const response = await authService.UpdateProfileImage(values, "/settings");

    console.log("RESPONSE", response);

    if (ApiError.isAPiError(response)) {
      const apiError = response as ApiError;
      console.log("AYPGS", response);

      // Return the error with all its details
      return {
        success: false,
        message: apiError.message,
        errors: apiError.rawErrors as Record<string, string[]>,
        statusCode: apiError.statusCode,
        errorType: apiError.errorType,
      };
    }

    // At this point, response is not an ApiError
    const successResponse = response as unknown as {
      success: true;
      status: true;
      message: string;
      data: {
        status: true;
        message: string;
        user: User;
      };
    };

    revalidatePath("/settings");
    return {
      success: true,
      message: successResponse.message,
      user: successResponse.data.user,
    };
  } catch (error) {
    console.error("Update BIODATA ERROR:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errors: error.rawErrors as Record<string, string[]>,
        statusCode: error.statusCode,
        errorType: error.errorType,
      };
    }

    // For any other error
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
      errorType: "UnknownError",
    };
  }
};
