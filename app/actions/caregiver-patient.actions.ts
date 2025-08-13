"use server";

import { revalidatePath } from "next/cache";

import { adminServices, caregiverServices } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import { User } from "@/types";

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
interface CaregiverHistorySuccess {
  success: true;
  message: string;
  histories: {
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
  patients: Partial<User>[]; // For backward compatibility
}

interface CaregiverHistoryError {
  success: false;
  message: string;
  histories: null;
  patients: [];
}

type CaregiverHistoryResult = CaregiverHistorySuccess | CaregiverHistoryError;

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
} = {}): Promise<CaregiverHistoryResult> => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await caregiverServices.caregiver.getPatientHistory({
      per_page,
      end_date,
      start_date,
      caregiver,
    });

    // Check for API error properly
    if (ApiError.isAPiError(response)) {
      return {
        success: false,
        message: response.message || "An error occurred",
        histories: null,
        patients: [],
      };
    }

    // Type guard to ensure response has expected structure
    if (!response?.data?.histories) {
      return {
        success: false,
        message: "Invalid response format",
        histories: null,
        patients: [],
      };
    }

    return {
      success: true,
      message: response.message || "Histories retrieved successfully",
      histories: response.data.histories,
      patients: response.data.histories.data.map((history) => history.patient), // For backward compatibility
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
