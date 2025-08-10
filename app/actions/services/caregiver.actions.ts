"use server";

import { revalidatePath } from "next/cache";

import { billingService, caregiverServices } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import { Appointment, ApiResponse } from "@/types";

import { getSession } from "../session.actions";

export const getCaregiverHistory = async ({
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
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await caregiverServices.user.getCaregiverHistory({
      per_page,
      end_date,
      start_date,
      caregiver,
    });

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
            caregiver: {
              id: number;
              first_name: string;
              last_name: string;
            };
          }[];
          from: number;
          last_page: number;
          per_page: number;
          to: number;
          total: number;
        };
      };
      rawResponse: ApiResponse<{
        status: true;
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
            caregiver: {
              id: number;
              first_name: string;
              last_name: string;
            };
          }[];
          from: number;
          last_page: number;
          per_page: number;
          to: number;
          total: number;
        };
      }>;
    };

    console.log("SUCCESS RESPONSE", successResponse);
    return {
      success: true,
      message: successResponse.message,
      caregivers: successResponse.data.histories,
    };
  } catch (error) {
    console.error("Get Caregiver History Error:", error);

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

export const getCaregiverHistoryDetails = async (caregiver_id: string) => {
  try {
    if (!caregiver_id) {
      throw new ApiError({
        statusCode: 400,
        message: "Caregiver ID is required",
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
      await caregiverServices.user.getCaregiverHistoryDetails(caregiver_id);

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
        appointment: Appointment;
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        appointment: Appointment;
      }>;
    };

    console.log("SUCCESS RESPONSE", successResponse);
    return {
      success: true,
      message: successResponse.message,
      appointment: successResponse.data.appointment,
    };
  } catch (error) {
    console.error("Get Caregiver History Details Error:", error);

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

export const rateCaregiver = async (values: {
  caregiver_id: number;
  rating: number;
  feedback: string;
}) => {
  try {
    if (!values.caregiver_id || !values.rating) {
      throw new ApiError({
        statusCode: 400,
        message: "Caregiver ID and rating are required",
        errorType: "ValidationError",
      });
    }

    if (values.rating < 1 || values.rating > 5) {
      throw new ApiError({
        statusCode: 400,
        message: "Rating must be between 1 and 5",
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

    const response = await caregiverServices.user.rateCaregiver(values);

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
        appointment: Appointment;
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        appointment: Appointment;
      }>;
    };

    console.log("SUCCESS RESPONSE", successResponse);
    revalidatePath("/caregivers");
    revalidatePath("/history");
    return {
      success: true,
      message: successResponse.message,
      appointment: successResponse.data.appointment,
    };
  } catch (error) {
    console.error("Rate Caregiver Error:", error);

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
export const getUserBillHistory = async ({
  date,
  amount,
  status,
  per_page,
}: {
  date?: string;
  status?: string;
  per_page?: number;
  amount?: number;
} = {}) => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await billingService.getUserBillHistory({
      date,
      amount,
      status,
      per_page,
    });

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
        payments: {
          current_page: number;
          data: [];
          from: number;
          last_page: number;
          per_page: number;
          to: number;
          total: number;
        };
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        payments: {
          current_page: number;
          data: [];
          from: number;
          last_page: number;
          per_page: number;
          to: number;
          total: number;
        };
      }>;
    };

    console.log("SUCCESS RESPONSE", successResponse);
    return {
      success: true,
      message: successResponse.message,
      payments: successResponse.data.payments,
    };
  } catch (error) {
    console.error("Get Caregiver History Error:", error);

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
