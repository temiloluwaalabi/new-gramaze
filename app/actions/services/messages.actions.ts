"use server";

"use server";

import { revalidatePath } from "next/cache";

import { adminServices } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import { ServerActionResponse, User } from "@/types";
import {
  Conversation,
  ConversationUser,
  SendMessagePayload,
  SendMessageResponse,
} from "@/types/new-messages";

import { getSession } from "../session.actions";

export const getChatList = async (): Promise<ServerActionResponse<User[]>> => {
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

    const response = await adminServices.messages.getChatList();

    console.log("CHAT LIST RESPONSE", response);

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
      data: User[];
    };

    return {
      success: true,
      message: successResponse.message,
      data: successResponse.data,
    };
  } catch (error) {
    console.error("Get Chat List Error:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errors: error.rawErrors as Record<string, string[]>,
        statusCode: error.statusCode,
        errorType: error.errorType,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
      errorType: "UnknownError",
    };
  }
};

export const getConversations = async (): Promise<
  ServerActionResponse<Conversation[]>
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

    const response = await adminServices.messages.getConversations();

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
      data: Conversation[];
    };

    return {
      success: true,
      message: "Conversations fetched successfully",
      data: successResponse.data,
    };
  } catch (error) {
    console.error("Get Conversations Error:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errors: error.rawErrors as Record<string, string[]>,
        statusCode: error.statusCode,
        errorType: error.errorType,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
      errorType: "UnknownError",
    };
  }
};

export const getMessages = async (
  userId: number
): Promise<
  ServerActionResponse<
    {
      id: number;
      sender_id: number;
      receiver_id: number;
      message: string;
      reat_at: string;
      created_at: string;
      updated_at: string;
      sender: ConversationUser;
      receiver: ConversationUser;
    }[]
  >
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

    const response = await adminServices.messages.getMessages(userId);

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
      data: {
        id: number;
        sender_id: number;
        receiver_id: number;
        message: string;
        reat_at: string;
        created_at: string;
        updated_at: string;
        sender: ConversationUser;
        receiver: ConversationUser;
      }[];
    };

    return {
      success: true,
      message: "Messages fetched successfully",
      data: successResponse.data,
    };
  } catch (error) {
    console.error("Get Messages Error:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errors: error.rawErrors as Record<string, string[]>,
        statusCode: error.statusCode,
        errorType: error.errorType,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
      errorType: "UnknownError",
    };
  }
};

export const sendMessage = async (
  payload: SendMessagePayload,
  pathname: string
): Promise<ServerActionResponse<SendMessageResponse>> => {
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

    const response = await adminServices.messages.sendMessage(payload);

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
      data: SendMessageResponse;
    };

    revalidatePath(pathname);
    return {
      success: true,
      message: "Message sent successfully",
      data: successResponse.data,
    };
  } catch (error) {
    console.error("Send Message Error:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errors: error.rawErrors as Record<string, string[]>,
        statusCode: error.statusCode,
        errorType: error.errorType,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
      errorType: "UnknownError",
    };
  }
};

export const searchUsers = async (
  query: string
): Promise<ServerActionResponse<User[]>> => {
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

    const response = await adminServices.messages.searchUsers(query);

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
      data: User[];
    };

    return {
      success: true,
      message: "Users found",
      data: successResponse.data,
    };
  } catch (error) {
    console.error("Search Users Error:", error);

    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        errors: error.rawErrors as Record<string, string[]>,
        statusCode: error.statusCode,
        errorType: error.errorType,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      statusCode: 500,
      errorType: "UnknownError",
    };
  }
};
