"use server";

import { adminServices } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import { User } from "@/types";

import { getSession } from "../session.actions";

// User Management Actions
export const getUserDetails = async (userId: number) => {
  try {
    if (!userId) {
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

    const response = await adminServices.user_management.getUserDetails(userId);

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

    return {
      success: true,
      message: successResponse.message,
      user: successResponse.data.user,
    };
  } catch (error) {
    console.error("Get User Details Error:", error);

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

export const getAllUsers = async () => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await adminServices.user_management.getAllUsers();

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    console.log("SUCES RESPONSE", response);
    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: {
        status: true;
        message: string;
        data: {
          users: User[];
          pagination: {
            page: number;
            per_page: number;
            last_page: number;
            total: number;
          };
        };
      };
    };

    return {
      success: true,
      message: successResponse.message,
      users: successResponse.data.data.users,
      pagination: successResponse.data.data.pagination,
    };
  } catch (error) {
    console.error("Get All Users Error:", error);

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

export const getActiveUsers = async () => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await adminServices.user_management.getActiveUsers();

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
        data: {
          users: User[];
          pagination: {
            page: number;
            per_page: number;
            last_page: number;
            total: number;
          };
        };
      };
    };

    return {
      success: true,
      message: successResponse.message,
      users: successResponse.data.data.users,
      pagination: successResponse.data.data.pagination,
    };
  } catch (error) {
    console.error("Get Active Users Error:", error);

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

export const getInactiveUsers = async () => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await adminServices.user_management.getInactiveUsers();

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
        data: {
          users: User[];
          pagination: {
            page: number;
            per_page: number;
            last_page: number;
            total: number;
          };
        };
      };
    };

    return {
      success: true,
      message: successResponse.message,
      users: successResponse.data.data.users,
      pagination: successResponse.data.data.pagination,
    };
  } catch (error) {
    console.error("Get Inactive Users Error:", error);

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

export const getSuspendedUsers = async () => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await adminServices.user_management.getSuspendedUsers();

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
        data: {
          users: User[];
          pagination: {
            page: number;
            per_page: number;
            last_page: number;
            total: number;
          };
        };
      };
    };

    return {
      success: true,
      message: successResponse.message,
      users: successResponse.data.data.users,
      pagination: successResponse.data.data.pagination,
    };
  } catch (error) {
    console.error("Get Suspended Users Error:", error);

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
