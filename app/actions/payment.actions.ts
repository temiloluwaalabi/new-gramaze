"use server";

import { revalidatePath } from "next/cache";

import { billingService } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import { ApiResponse } from "@/types";
import { getSession } from "./session.actions";

export const InitiatePayment = async (
  values: {
    plan_code: string;
    callback_url: string;
  },
  pathname: string
) => {
  console.log("VALUES", values);
  try {
    if (!values.plan_code || !values.callback_url) {
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

    const response = await billingService.initiatePayment(values);

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

    console.log("SUCCESS RESPONSE", successResponse);
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
      throw response;
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
    console.log("SUCCESS RESPONSE", successResponse);
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
