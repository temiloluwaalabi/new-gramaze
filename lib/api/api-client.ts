/* eslint-disable promise/param-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
 
import { getSession } from "@/app/actions/session.actions";

export class ApiError extends Error {
  readonly statusCode: number; // HTTP status code of the error
  readonly errorType: string; // Type of the error (e.g., validation, server error)
  readonly rawErrors?: Record<string, unknown>; // Optional raw error details for debugging
  readonly isError: boolean = true; // Always mark ApiError instances

  constructor(response: {
    statusCode: number;
    message: string | string[];
    errorType?: string; // Optional error type
    rawErrors?: Record<string, unknown>; // Optional raw error details
  }) {
    const message = Array.isArray(response.message)
      ? response.message
      : [response.message];

    const finalMessage = message.join("; ");

    super(
      finalMessage ||
        `API ERROR: ${response.statusCode} - ${response.errorType}`
    );

    this.name = "ApiError";
    this.statusCode = response.statusCode;
    this.errorType = response.errorType || "API_ERROR";
    this.rawErrors = response.rawErrors;

    Object.defineProperty(this, "message", {
      value: finalMessage,
      enumerable: true,
      writable: true,
      configurable: true,
    });

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    console.log("✅ ApiError created successfully:", this);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      errorType: this.errorType,
      rawErrors: this.rawErrors,
      isError: true,
    };
  }

  log() {
    console.error(`[${this.statusCode}] ${this.errorType}: ${this.message}`);
  }

  static isAPiError(obj: unknown): obj is ApiError {
    return (
      obj instanceof ApiError ||
      (typeof obj === "object" &&
        obj !== null &&
        "isError" in obj &&
        (obj as any).isError === true)
    );
  }
  

  static markAsApiError(error: unknown): Record<string, unknown> {
    console.log("ERROR MARKED AS ERROR", error);
    if (error instanceof ApiError) {
      // If it's already an ApiError, just make sure it has the isError property
      return {
        ...error,
        isError: true,
        statusCode: error.statusCode,
        errorType: error.errorType,
        message: error.message,
        rawErrors: error.rawErrors,
      };
    }

    if (error instanceof Error) {
      return {
        isError: true,
        name: "ApiError",
        message: error.message,
        statusCode: 500,
        errorType: "GENERIC_ERROR",
        stack: error.stack,
      };
    }

    // For unknown error types
    return {
      isError: true,
      name: "ApiError",
      message: String(error || "Unknown error occurred"),
      statusCode: 500,
      errorType: "UNKNOWN_ERROR",
    };
  }
}

// Type to represent API response data structure
interface ApiErrorResponse {
  message?: string | string[];
  error?: string | string[];
  errorType?: string;
  rawErrors?: Record<string, unknown>;
  [key: string]: unknown; // Allow other properties
}

// Common configuration for API clients
const BASE_CONFIG = {
  timeout: 15000, // 10 seconds is a common standard for API requests
  headers: {
    // "Content-Type": "application/json",
    Accept: "*/*",
  },
  withCredentials: true,
  maxBodyLength: 20 * 1024 * 1024, // 20MB
  maxContentLength: 20 * 1024 * 1024, // 20MB
};

export const userApiClient: AxiosInstance = axios.create({
  ...BASE_CONFIG,
  baseURL: process.env.NEXT_PUBLIC_CLIENT_API_URL,
});

export const backendAPiClient: AxiosInstance = axios.create({
  ...BASE_CONFIG,
  baseURL: process.env.NEXT_PUBLIC_ADMIN_API_URL,
});

const RETRY_CONFIG = {
  maxRetries: 3, // Maximum number of retry attempts
  retryDelay: 500, // Base delay between retries in ms
  retryStatusCodes: [408, 429, 500, 502, 503, 504], // Status codes to retry
  timeoutErrorCodes: ["ECONNABORTED", "ETIMEDOUT"], // Axios error codes for timeouts
};

// /**
//  * Adds retry functionality to an Axios instance.
//  * Retries on network errors and 5xx responses up to `maxRetries` times.
//  */
// function addRetryInterceptor(client: AxiosInstance, maxRetries = 3, retryDelay = 500) {
//     client.interceptors.response.use(
//         response => response,
//         async (error: AxiosError) => {
//             const config = error.config as any;
//             if (!config || config.__isRetryRequest) {
//                 return Promise.reject(error);
//             }

//             // Only retry for network errors or 5xx server errors
//             const shouldRetry =
//                 (!error.response && error.code !== 'ECONNABORTED') ||
//                 (error.response && error.response.status >= 500 && error.response.status < 600);

//             if (shouldRetry) {
//                 config.__retryCount = config.__retryCount || 0;
//                 if (config.__retryCount < maxRetries) {
//                     config.__retryCount += 1;
//                     config.__isRetryRequest = true;
//                     await new Promise(res => setTimeout(res, retryDelay));
//                     return client(config);
//                 }
//             }

//             return Promise.reject(error);
//         }
//     );
// }

// // Attach retry logic to both clients
// addRetryInterceptor(userApiClient);
// addRetryInterceptor(backendAPiClient);

// Token management
export const setAuthToken = (token: string | null): void => {
  const bearerToken = token ? `Bearer ${token}` : null;
  [userApiClient, backendAPiClient].forEach((client) => {
    if (bearerToken) {
      client.defaults.headers.common.Authorization = bearerToken;
    } else {
      delete client.defaults.headers.common.Authorization;
    }
  });
};

const handleApiError = (error: AxiosError<unknown>) => {
  if (!error.response) {
    let statusCode = 500;
    let message = "An unknown error occured. Please try again later";

    if (error.code === "ECONNABORTED") {
      statusCode = 408;
      message = "Request timed out. Please try again.";
    } else if (error.message.includes("Network Error")) {
      message = "Network error. Please check your connection.";
    }

    return Promise.reject(
      new ApiError({
        statusCode,
        message,
        errorType: "NETWORK_ERROR",
      })
    );
  }

  const { status, data } = error.response as {
    status: number;
    data: Partial<ApiErrorResponse>;
  };

  // Log full error response for debugging
  console.error("🚨 FULL ERROR RESPONSE:", {
    status: error.response?.status,
    data: error.response?.data,
  });

  let errorMessages: string[] = [];

  if (data?.message) {
    errorMessages = Array.isArray(data.message)
      ? data.message.filter((msg: unknown) => typeof msg === "string")
      : [typeof data.message === "string" ? data.message : "An error occured"];
  } else if (data?.error) {
    errorMessages = Array.isArray(data.error)
      ? data.error.filter((err: unknown) => typeof err === "string")
      : [typeof data.error === "string" ? data.error : "An error occurred"];
  } else {
    errorMessages = ["An unexpected error occured"];
  }

  return Promise.reject(
    new ApiError({
      statusCode: status,
      message: errorMessages,
      errorType: data?.errorType || "API_ERROR",
      rawErrors: data?.rawErrors || undefined,
    })
  );
};

/**
 * Handles successful API responses.
 * Returns the response data directly, or wraps it if needed.
 */
const handleApiSuccess = <T = unknown>(response: AxiosResponse<T>) => {
  return response;
};

backendAPiClient.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();

      // Only add Authorization header if accessToken exists
      if (session && session.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      } else {
        // Ensure Authorization header is not set if no accessToken
        if (config.headers && "Authorization" in config.headers) {
          delete config.headers.Authorization;
        }
      }
    } catch (error) {
      console.error("Error getting session for backend API request:", error);
    }

    return config;
  },
  (error) => {
    console.error("Error in backend API request interceptor:", error);
    return Promise.reject(error);
  }
);

[userApiClient, backendAPiClient].forEach((client) => {
  client.interceptors.response.use(
    handleApiSuccess,
    async (error: AxiosError) => {
      const config = error.config as any;
      if (!config || config.__isRetryRequest) {
        return handleApiError(error);
      }

      // Only retry for network errors or 5xx server errors
      const shouldRetry =
        (!error.response && error.code !== "ECONNABORTED") ||
        (error.response &&
          error.response.status >= 500 &&
          error.response.status < 600);

      if (shouldRetry) {
        config.__retryCount = config.__retryCount || 0;
        if (config.__retryCount < RETRY_CONFIG.maxRetries) {
          config.__retryCount += 1;
          config.__isRetryRequest = true;
          await new Promise((res) => setTimeout(res, RETRY_CONFIG.retryDelay));
          return client(config);
        }
      }

      return handleApiError(error);
    }
  );
});
