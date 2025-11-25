/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosError, AxiosResponse } from "axios";

import { ApiResponse } from "@/types";

import { ApiError, backendAPiClient } from "./api-client";
import logger from "../logger";

export interface ErrorResponse {
  data?: {
    message?: string;
    error?: Record<string, string[]> | string;
  };
  status?: boolean;
  success?: boolean;
  message?: string | string[];
  error?: Record<string, string[]> | string;
  errors?: Record<string, string[]>; // Added to handle your API's format  statusCode?: number;
  details?: Record<string, string[] | string>;
}

export const handleApiBackendError = (error: unknown): ApiError => {
  if (ApiError.isAPiError(error)) {
    return error as ApiError;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const status = axiosError.response?.status ?? 500;
    const responseData = axiosError.response?.data;

    if (responseData?.errors && typeof responseData.errors === "object") {
      const invalidMessages: string[] = [];
      const rawErrors: Record<string, unknown> = {};
      Object.entries(responseData.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          rawErrors[field] = messages;
          messages.forEach((msg) => invalidMessages.push(msg));
        } else if (typeof messages === "string") {
          rawErrors[field] = [messages];
          invalidMessages.push(`${field}: ${messages}`);
        }
      });

      return new ApiError({
        statusCode: status,
        message:
          invalidMessages.length > 0 ? invalidMessages : ["Validation Failed"],
        errorType: "VALIDATION_ERROR",
        rawErrors,
      });
    }

    // Handle validation errors in data.error
    if (responseData?.error && typeof responseData.error === "object") {
      const invalidMessages: string[] = [];
      const rawErrors: Record<string, unknown> = responseData.error;

      for (const [field, messages] of Object.entries(responseData.error)) {
        if (Array.isArray(messages)) {
          messages.forEach((msg) => invalidMessages.push(`${field}: ${msg}`));
        } else if (typeof messages === "string") {
          invalidMessages.push(`${field}: ${messages}`);
        }
      }

      return new ApiError({
        statusCode: status,
        message:
          invalidMessages.length > 0 ? invalidMessages : ["Validation Failed"],
        errorType: "VALIDATION_ERROR",
        rawErrors,
      });
    }

    // Handle validation errors in details
    if (responseData?.details && typeof responseData.details === "object") {
      const invalidMessages: string[] = [];
      Object.entries(responseData.details).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((msg) => invalidMessages.push(`${field}: ${msg}`));
        } else if (typeof messages === "string") {
          invalidMessages.push(`${field}: ${messages}`);
        }
      });

      if (invalidMessages.length > 0) {
        return new ApiError({
          statusCode: status,
          message: invalidMessages,
          errorType: "VALIDATION_ERROR",
          rawErrors: responseData.details,
        });
      }
    }

    // Standard error message
    const errorMessage = responseData?.message
      ? Array.isArray(responseData.message)
        ? responseData.message
        : [responseData.message]
      : [`Failed to process request. Status: ${status}`];

    // Error type by status
    let errorType = "API_ERROR";
    if (status === 400 || status === 422) errorType = "VALIDATION_ERROR";
    else if (status === 401) errorType = "AUTH_ERROR";
    else if (status === 403) errorType = "FORBIDDEN_ERROR";
    else if (status === 404) errorType = "NOT_FOUND_ERROR";
    else if (status === 429) errorType = "RATE_LIMIT_ERROR";
    else if (status >= 500) errorType = "SERVER_ERROR";

    return new ApiError({
      statusCode: status,
      message: errorMessage,
      errorType,
      rawErrors: responseData as Record<string, unknown>,
    });
  }

  // Error-like object (possibly backend error)
  if (typeof error === "object" && error !== null) {
    const errorObj = error as Record<string, any>;
    const statusCode = errorObj.statusCode ?? errorObj.status ?? 500;

    // Try to extract messages
    let messages: string[] = [];
    if (errorObj.message) {
      messages = Array.isArray(errorObj.message)
        ? errorObj.message
        : [errorObj.message];
    } else if (errorObj.error && typeof errorObj.error === "string") {
      messages = [errorObj.error];
    } else {
      messages = ["An error occurred"];
    }

    // Error type by status
    let errorType = "API_ERROR";
    if (statusCode === 400 || statusCode === 422)
      errorType = "VALIDATION_ERROR";
    else if (statusCode === 401) errorType = "AUTH_ERROR";
    else if (statusCode === 403) errorType = "FORBIDDEN_ERROR";
    else if (statusCode === 404) errorType = "NOT_FOUND_ERROR";
    else if (statusCode === 429) errorType = "RATE_LIMIT_ERROR";
    else if (statusCode >= 500) errorType = "SERVER_ERROR";

    return new ApiError({
      statusCode,
      message: messages,
      errorType,
      rawErrors: errorObj,
    });
  }

  // Standard JS Error
  if (error instanceof Error) {
    return new ApiError({
      statusCode: 500,
      message: error.message || "An unknown error occurred",
      errorType: "GENERIC_ERROR",
    });
  }

  // Unknown error
  return new ApiError({
    statusCode: 500,
    message: "An unknown error occurred",
    errorType: "UNKNOWN_ERROR",
  });
};

type ApiRequestBody = FormData | Record<string, any> | undefined;

interface MakeApiRequestOptions {
  params: Record<string, string | number | boolean>;
  pathname: string;
  body: ApiRequestBody;
  dataKey: string | string[];
}

const extractNestedData = (obj: any, path: string | string[]): any => {
  if (typeof path === "string") {
    return obj?.[path];
  }

  return path.reduce((current, key) => current?.[key], obj);
};

export const makeApiRequest = async <T>(
  endpoint: string,
  method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
  options: Partial<MakeApiRequestOptions> = {}
): Promise<
  | {
      success: true;
      status: number;
      message: string;
      data: T;
      // rawResponse: ApiResponse<T>;
    }
  | ApiError
> => {
  const { body, params, dataKey = "data" } = options;

  try {
    logger.info(`Making ${method} request to ${endpoint}`, {
      bodyType: body instanceof FormData ? "FormData" : typeof body,
      bodyKeys:
        body instanceof FormData ? [...body.keys()] : Object.keys(body || {}),
      params: params || {},
    });

    let response: AxiosResponse<ApiResponse<T>>;

    if (method === "GET") {
      response = await backendAPiClient.get(endpoint, { params });
    } else if (method === "DELETE") {
      response = await backendAPiClient.delete(endpoint, { params });
    } else {
      const isFormData = body instanceof FormData;

      if (isFormData) {
        let hasFiles = false;
        body.forEach((value: any) => {
          if (
            typeof value === "object" &&
            value !== null &&
            (value instanceof File || value instanceof Blob)
          ) {
            hasFiles = true;
          }
        });

        if (!hasFiles) {
          const formDataObj: Record<string, any> = {};
          body.forEach((value, key) => {
            formDataObj[key] = value;
          });

          logger.info(
            "Converted FormData to object with parsed fields:",
            formDataObj
          );

          response = await backendAPiClient[
            method.toLowerCase() as "post" | "put" | "patch"
          ]<ApiResponse<T>>(endpoint, formDataObj, {
            headers: {
              "Content-Type": "application/json",
            },
            params,
          });
        } else {
          response = await backendAPiClient[
            method.toLowerCase() as "post" | "put" | "patch"
          ]<ApiResponse<T>>(endpoint, body, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            params,
          });
        }
      } else {
        response = await backendAPiClient[
          method.toLowerCase() as "post" | "put" | "patch"
        ]<ApiResponse<T>>(endpoint, body, {
          params,
        });
      }
    }

    const data = response.data;

    if (data.success === false || data.status === false) {
      if (data.errors && typeof data.errors === "object") {
        const errorMessages: string[] = [];
        const rawErrors: Record<string, string[]> = {};

        Object.entries(data.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            rawErrors[field] = messages;
            messages.forEach((msg: string) =>
              errorMessages.push(`${field}: ${msg}`)
            );
          } else if (typeof messages === "string") {
            rawErrors[field] = [messages as string];
            errorMessages.push(`${field}: ${messages}`);
          }
        });

        return new ApiError({
          statusCode: response.status || 400,
          message:
            errorMessages.length > 0
              ? errorMessages
              : [data.message || "Validation failed"],
          errorType: "VALIDATION_ERROR",
          rawErrors,
        });
      }
      return new ApiError({
        statusCode: response.status || 400,
        message: Array.isArray(data.message)
          ? data.message
          : [data.message || "Request failed"],
        errorType: "API_ERROR",
        rawErrors: data,
      });
    }

    const extractedData = dataKey ? extractNestedData(data, dataKey) : data;

    // // Log extraction for debugging
    // logger.info("Data extraction:", {
    //     dataKey,
    //     extractedData,
    //     fullResponse: data,
    // });

    return {
      success: true,
      status: response.status || 200,
      message: data.message || "Request Completed Successfully",
      data: extractedData || data,
      // rawResponse: data,
    };
  } catch (error) {
    logger.error(`Error in ${endpoint}:`, error);
    return handleApiBackendError(error);
  }
};
