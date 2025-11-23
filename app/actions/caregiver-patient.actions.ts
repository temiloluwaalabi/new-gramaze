"use server";

import { revalidatePath } from "next/cache";

import { adminServices, caregiverServices } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import { HealthNote, HealthReport, ServerActionResponse, User } from "@/types";

import { getSession } from "./session.actions";

export const updatePlan = async (
  values: { user_id: number; plan: string },
  pathname: string
) => {
  try {
    if (!values.user_id || !values.plan) {
      throw new ApiError({
        statusCode: 400,
        message: "User ID and plan are required",
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

    const response = await adminServices.patient_management.updatePlan(
      values,
      pathname
    );

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: {
        status: true;
        message: string;
        user: User;
      };
    };

    revalidatePath(pathname);
    revalidatePath("/admin/patients");
    return {
      success: true,
      message: successResponse.message,
      user: successResponse.data.user,
    };
  } catch (error) {
    console.error("Update Plan Error:", error);

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
// Define clear return types
// interface CaregiverHistorySuccess {
//   success: true;
//   message: string;
//   data: {
//     current_page: number;
//     data: {
//       id: number;
//       user_id: string;
//       caregiver_id: string;
//       start_date: string;
//       end_date: string;
//       created_at: string;
//       updated_at: string;
//       patient: Partial<User>;
//     }[];
//     from: number;
//     last_page: number;
//     per_page: number;
//     to: number;
//     total: number;
//   };
//   patients: Partial<User>[]; // For backward compatibility
// }

// interface CaregiverHistoryError {
//   success: false;
//   message: string;
//   histories: null;
//   patients: [];
// }

// type CaregiverHistoryResult = CaregiverHistorySuccess | CaregiverHistoryError;
export const fetchHealthTracker = async (values: { user_id: number }) => {
  try {
    if (!values.user_id) {
      throw new ApiError({
        statusCode: 400,
        message: "User ID is required",
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

    const response =
      await adminServices.patient_management.fetchHealthTracker(values);

    console.log("RESPONSE", response);
    if (ApiError.isAPiError(response)) {
      throw response;
    }

    const successResponse = response as {
      status: true;
      message: string;
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
      tracker: {
        id: number;
        user_id: string;
        caregiver_id: string;
        status: string;
        reason: string | null;
        created_at: string;
        updated_at: string;
        metrics: {
          name: string;
          value: string;
        }[];
        blood_glucose: string;
        blood_pressure: string;
        weight: string;
        pulse: string;
      }[];
    };

    return {
      success: true,
      message: successResponse.message,
      current_page: successResponse.current_page,
      per_page: successResponse.per_page,
      total: successResponse.total,
      last_page: successResponse.last_page,
      tracker: successResponse.tracker,
    };
  } catch (error) {
    console.error("Fetch Health Tracker Error:", error);

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
export const getCaregiverPatientHistory = async ({
  per_page,
  end_date,
  start_date,
  caregiver,
}: {
  start_date?: string;
  caregiver?: string;
  end_date?: string;
  per_page?: number;
} = {}): Promise<
  ServerActionResponse<{
    current_page: number;
    data: {
      id: number;
      user_id: string;
      caregiver_id: string;
      start_date: string;
      end_date: string;
      created_at: string;
      updated_at: string;
      patient: Partial<User>;
    }[];
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  }>
> => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      return {
        success: false,
        message: "No active session found",
        statusCode: 401,
        errorType: "AUTH_ERROR",
      };
    }
    const response = await caregiverServices.caregiver.getPatientHistory({
      per_page,
      end_date,
      start_date,
      caregiver,
    });

    // Check for API error properly
    if (ApiError.isAPiError(response)) {
      const apiError = response as ApiError;
      console.log("AYPGS", response);
      return {
        success: false,
        message: apiError.message,
        errors: apiError.rawErrors as Record<string, string[]>,
        statusCode: apiError.statusCode,
        errorType: apiError.errorType,
      };
    }

    console.log("RESPONSE  HIS", response);
    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: {
        current_page: number;
        data: {
          id: number;
          user_id: string;
          caregiver_id: string;
          start_date: string;
          end_date: string;
          created_at: string;
          updated_at: string;
          patient: Partial<User>;
        }[];
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
      };
    };
    return {
      success: true,
      message: successResponse.message || "Histories retrieved successfully",
      data: successResponse.data,
      // patients: successResponse.data.data.map((history) => history.patient), // For backward compatibility
    };
  } catch (error) {
    console.error("Get Caregiver History Error:", error);

    // If it's already an ApiError, re-throw it
    if (error instanceof ApiError) {
      throw error;
    }

    // For other errors, wrap in ApiError
    throw new ApiError({
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};
export const addHealthTracker = async (
  values: {
    [metricCode: string]: string | number; // Dynamic metric values
    user_id: number;
    caregiver_id: number;
  },
  pathname: string
) => {
  try {
    if (!values.user_id || !values.caregiver_id) {
      throw new ApiError({
        statusCode: 400,
        message: "User ID and caregiver ID are required",
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

    const response = await adminServices.patient_management.addHealthTracker(
      values,
      pathname
    );

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: {
        status: true;
        message: string;
        tracker: {
          id: number;
          blood_glucose: string;
          blood_pressure: string;
          weight: string;
          pulse: string;
          created_at: string;
          updated_at: string;
          user_id: number;
          caregiver_id: number;
        };
      };
    };

    revalidatePath(pathname);
    return {
      success: true,
      message: successResponse.message,
      tracker: successResponse.data.tracker,
    };
  } catch (error) {
    console.error("Add Health Tracker Error:", error);

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

export const updateHealthTracker = async (
  values: {
    [metricCode: string]: string | number; // Dynamic metric values

    user_id: number;
    caregiver_id: number;
    id: number;
  },
  pathname: string
) => {
  try {
    if (!values.user_id || !values.caregiver_id || !values.id) {
      throw new ApiError({
        statusCode: 400,
        message: "User ID, caregiver ID, and tracker ID are required",
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

    const response = await adminServices.patient_management.updateHealthTracker(
      values,
      pathname
    );

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: {
        status: true;
        message: string;
        tracker: {
          id: number;
          blood_glucose: string;
          blood_pressure: string;
          weight: string;
          pulse: string;
          created_at: string;
          updated_at: string;
          user_id: number;
          caregiver_id: number;
        };
      };
    };

    revalidatePath(pathname);
    revalidatePath("/admin/health-tracker");
    return {
      success: true,
      message: successResponse.message,
      data: successResponse.data.tracker,
    };
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);

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

export const AddHealthReport = async (
  values: FormData
): Promise<
  ServerActionResponse<{
    report_name: string;
    report_file: string;
    health_record_id: number;
    user_id: number;
    caregiver_id: number;
    updated_at: string;
    created_at: string;
    id: number;
  }>
> => {
  try {
    console.log("FORMDATA", values);
    const sessionToken = await getSession();
    if (!sessionToken) {
      return {
        success: false,
        message: "No active session found",
        statusCode: 401,
        errorType: "AUTH_ERROR",
      };
    }

    const response = await caregiverServices.healthReport.addReport(values);

    console.log("RESPONSE", response);

    if (ApiError.isAPiError(response)) {
      const apiError = response as ApiError;
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
        report_name: string;
        report_file: string;
        health_record_id: number;
        user_id: number;
        caregiver_id: number;
        updated_at: string;
        created_at: string;
        id: number;
      };
    };

    revalidatePath("/");
    return {
      success: true,
      message: successResponse.message,
      data: successResponse.data,
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

export const getPatientHealthReports = async (
  patient_id: string
): Promise<ServerActionResponse<HealthReport[]>> => {
  try {
    if (!patient_id || typeof patient_id !== "string") {
      return {
        success: false,
        message: "PATIENT_ID is required",
        statusCode: 401,
        errorType: "AUTH_ERROR",
      };
    }

    const sessionToken = await getSession();
    if (!sessionToken) {
      return {
        success: false,
        message: "No active session found",
        statusCode: 401,
        errorType: "AUTH_ERROR",
      };
    }

    const response =
      await caregiverServices.healthReport.getPatientHealthReports(patient_id);

    if (ApiError.isAPiError(response)) {
      const apiError = response as ApiError;
      return {
        success: false,
        message: apiError.message,
        errors: apiError.rawErrors as Record<string, string[]>,
        statusCode: apiError.statusCode,
        errorType: apiError.errorType,
      };
    }

    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: HealthReport[];
    };

    return {
      success: true,
      message: successResponse.message,
      data: successResponse.data,
    };
  } catch (error) {
    console.error("Get patient History Details Error:", error);

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
export const AddHealthNote = async (
  values: FormData
): Promise<ServerActionResponse<HealthNote>> => {
  try {
    console.log("FORMDATA", values);
    const sessionToken = await getSession();
    if (!sessionToken) {
      return {
        success: false,
        message: "No active session found",
        statusCode: 401,
        errorType: "AUTH_ERROR",
      };
    }

    const response = await caregiverServices.patientNotes.addNote(values);

    console.log("RESPONSE", response);

    if (ApiError.isAPiError(response)) {
      const apiError = response as ApiError;
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
      data: HealthNote;
    };

    revalidatePath("/");
    return {
      success: true,
      message: successResponse.message,
      data: successResponse.data,
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

export const getPatientHealthNotes = async (
  patient_id: string
): Promise<ServerActionResponse<HealthNote[]>> => {
  try {
    if (!patient_id || typeof patient_id !== "string") {
      return {
        success: false,
        message: "PATIENT_ID is required",
        statusCode: 401,
        errorType: "AUTH_ERROR",
      };
    }

    const sessionToken = await getSession();
    if (!sessionToken) {
      return {
        success: false,
        message: "No active session found",
        statusCode: 401,
        errorType: "AUTH_ERROR",
      };
    }

    const response =
      await caregiverServices.patientNotes.getUserHealthNotes(patient_id);

    if (ApiError.isAPiError(response)) {
      const apiError = response as ApiError;
      return {
        success: false,
        message: apiError.message,
        errors: apiError.rawErrors as Record<string, string[]>,
        statusCode: apiError.statusCode,
        errorType: apiError.errorType,
      };
    }

    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: HealthNote[];
    };

    return {
      success: true,
      message: successResponse.message,
      data: successResponse.data,
    };
  } catch (error) {
    console.error("Get patient History Details Error:", error);

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
