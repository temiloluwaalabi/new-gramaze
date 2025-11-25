"use server";

import { revalidatePath } from "next/cache";

import { billingService, notificationServices } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import { ApiResponse } from "@/types";

import { getSession } from "./session.actions";

export const InitiatePayment = async (
  values: {
    payment_notification_id: number;
    callback_url: string;
  },
  pathname: string
) => {
  try {
    if (!values.payment_notification_id || !values.callback_url) {
      return {
        success: false,
        message: "Invalid credentials",
      };
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
      await notificationServices.payFromPaymentNotification(values);

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
        initiate_payment_data: {
          authorization_url: string;
          access_code: string;
          reference: string;
        };
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        initiate_payment_data: {
          authorization_url: string;
          access_code: string;
          reference: string;
        };
      }>;
    };

    revalidatePath(pathname);
    return {
      success: true,
      message: successResponse.message,
      authorization_url:
        successResponse.data.initiate_payment_data.authorization_url,
      reference: successResponse.data.initiate_payment_data.reference,
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
export const VerifyPayment = async (pathname: string, reference: string) => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await billingService.verifyPayment(reference);

    if (ApiError.isAPiError(response)) {
      return {
        success: false,
        message: response.message,
      };
    }

    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: {
        status: true;
        message: string;
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
      }>;
    };

    revalidatePath(pathname);

    return {
      success: true,
      message: successResponse.message,
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
export const getUserPaymentNotifications = async () => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await notificationServices.getUserPaymentNotifications();

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
        payment_notification: {
          id: number;
          pay_reference: string;
          user_id: number;
          plan_code: string;
          amount: string;
          status: string;
          message: string;
          created_at: string;
          updated_at: string;
        }[];
      };
      rawResponse?: unknown;
    };

    return {
      success: true,
      message: successResponse.message,
      payment_notifications: successResponse.data.payment_notification,
    };
  } catch (error) {
    console.error("Get All PAYMENT NOTIFICATIONS Error:", error);

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
