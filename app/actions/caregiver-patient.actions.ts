"use server";

import { revalidatePath } from "next/cache";

import { adminServices } from "@/lib/api/api";
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
