/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosError, AxiosResponse } from "axios";

import { ApiResponse, MakeApiSuccess } from "@/types";
 
import { ApiError, backendAPiClient } from "./api-client";
import logger from "../logger"; 

export interface ErrorResponse {
  data?: {
    message?: string;
    error?: Record<string, string[]> | string;
  };
  message?: string | string[];
  error?: string;
  statusCode?: number;
  status?: number;
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

    // Handle validation errors in data.error
    if (responseData?.data?.error) {
      const invalidFields = responseData.data.error;
      const invalidMessages: string[] = [];
      let rawErrors: Record<string, unknown> = {};

      if (typeof invalidFields === "object" && invalidFields !== null) {
        rawErrors = invalidFields;
        for (const [field, messages] of Object.entries(invalidFields)) {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => invalidMessages.push(msg));
          } else if (typeof messages === "string") {
            invalidMessages.push(messages);
          }
        }
      } else if (typeof invalidFields === "string") {
        invalidMessages.push(invalidFields);
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
          messages.forEach((msg) => invalidMessages.push(msg));
        } else if (typeof messages === "string") {
          invalidMessages.push(messages);
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
    if (status === 400) errorType = "VALIDATION_ERROR";
    else if (status === 401) errorType = "AUTH_ERROR";
    else if (status === 403) errorType = "FORBIDDEN_ERROR";
    else if (status === 404) errorType = "NOT_FOUND_ERROR";
    else if (status === 429) errorType = "RATE_LIMIT_ERROR";
    else if (status >= 500) errorType = "SERVER_ERROR";

    return new ApiError({
      statusCode: responseData?.statusCode ?? status,
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
    if (statusCode === 400) errorType = "VALIDATION_ERROR";
    else if (statusCode === 401) errorType = "AUTH_ERROR";
    else if (statusCode === 403) errorType = "FORBIDDEN_ERROR";
    else if (statusCode === 404) errorType = "NOT_FOUND_ERROR";
    else if (statusCode === 429) errorType = "RATE_LIMIT_ERROR";
    else if (statusCode >= 500) errorType = "SERVER_ERROR";

    // Validation errors in details
    if (errorObj.details && typeof errorObj.details === "object") {
      const invalidMessages: string[] = [];
      Object.entries(errorObj.details).forEach(([field, fieldMessages]) => {
        if (Array.isArray(fieldMessages)) {
          fieldMessages.forEach((msg) => invalidMessages.push(msg));
        } else if (typeof fieldMessages === "string") {
          invalidMessages.push(fieldMessages);
        }
      });
      if (invalidMessages.length > 0) {
        return new ApiError({
          statusCode,
          message: invalidMessages,
          errorType: "VALIDATION_ERROR",
          rawErrors: errorObj.details,
        });
      }
    }

    // Compose rawErrors
    const rawErrors: Record<string, unknown> = {};
    if (errorObj.details) rawErrors.details = errorObj.details;
    if (errorObj.rawErrors) Object.assign(rawErrors, errorObj.rawErrors);

    return new ApiError({
      statusCode,
      message: messages,
      errorType,
      rawErrors: Object.keys(rawErrors).length > 0 ? rawErrors : undefined,
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
  dataKey?: string | string[];
}

const extractNestedData = <T = unknown>(
  obj: any,
  path?: string | string[]
): T | undefined => {
  if (!path) return undefined;

  if (typeof path === "string") {
    return obj?.[path] as T;
  }

  return path.reduce((current, key) => current?.[key], obj) as T;
};




export const makeApiRequest = async <T>(
  endpoint: string,
  method: "POST" | "GET",
  options: Partial<MakeApiRequestOptions> = {}
): Promise<MakeApiSuccess<T> | ApiError> => {
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

          response = await backendAPiClient.post<ApiResponse<T>>(
            endpoint,
            formDataObj,
            {
              headers: {
                "Content-Type": "application/json",
              },
              params,
            }
          );
        } else {
          response = await backendAPiClient.post<ApiResponse<T>>(
            endpoint,
            body,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              params,
            }
          );
        }
      } else {
        response = await backendAPiClient.post<ApiResponse<T>>(endpoint, body, {
          params,
        });
      }
    }

    const data = response.data;

    if (data.success === false || data.status === false) {
      return new ApiError({
        statusCode: response.status || 500,
        message: Array.isArray(data.message)
          ? data.message
          : [data.message || "Unknown error occured"],
        rawErrors: data as unknown as Record<string, unknown>,
      });
    }

    const extractedData = extractNestedData<T>(data, dataKey ?? "data") ?? (data as T);

    return {
      success: true,
      status: response.status || 200,
      message: data.message || "Request Completed Successfully",
      data: extractedData,
      rawResponse: data,
    };
    
  } catch (error) {
    logger.error(`Error in ${endpoint}:`, error);
    return handleApiBackendError(error);
  }
};
