"use server";

import { chatsServices } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import { ApiResponse } from "@/types";

import { getSession } from "../session.actions";

export const fetchMessages = async (user_id: number) => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await chatsServices.fetchMessages(user_id);

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
        messages: [];
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        messages: [];
      }>;
    };

    console.log("SUCCESS RESPONSE", successResponse);
    return {
      success: true,
      message: successResponse.message,
      messages: successResponse.data.messages,
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
