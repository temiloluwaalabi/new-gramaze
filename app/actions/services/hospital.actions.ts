"use server";

import { hospitalServices } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import { lgas, hospital, State } from "@/types";

import { getSession } from "../session.actions";

export const getAllStates = async () => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await hospitalServices.getAllStates();

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: State[];
      rawResponse?: unknown;
    };

    return {
      success: true,
      message: successResponse.message,
      states: successResponse.data,
    };
  } catch (error) {
    console.error("Get All States Error:", error);

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

export const getALlLGAs = async () => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await hospitalServices.getAllLGAs();

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: lgas[];

      rawResponse?: unknown;
    };

    return {
      success: true,
      message: successResponse.message,
      states: successResponse.data,
    };
  } catch (error) {
    console.error("Get All States Error:", error);

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
export const getAllHospitals = async () => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await hospitalServices.getAllHospitals();

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    const successResponse = response as unknown as {
      success: true;
      status: number;
      message: string;
      data: hospital[];

      rawResponse?: unknown;
    };

    return {
      success: true,
      message: successResponse.message,
      hospitals: successResponse.data,
    };
  } catch (error) {
    console.error("Get All Hospitals Error:", error);

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
