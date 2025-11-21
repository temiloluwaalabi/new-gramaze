/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { toast } from "sonner";

import { ApiError } from "../api/api-client";
import logger from "../logger";
interface MutationErrorObject {
  success?: boolean;
  message?: string | string[];
  errors?: Record<string, string[]>;
  statusCode?: number;
  errorType?: string;
  rawErrors?: Record<string, unknown>;
}
/**
 * Enhanced mutation error handler that properly displays all error types
 * including field-specific validation errors
 */
export const handleMutationError = (error: unknown) => {
  console.error("Mutation Error:", error);

  // Handle error objects returned from server actions
  if (typeof error === "object" && error !== null && "success" in error) {
    const errorObj = error as MutationErrorObject;

    if (errorObj.success === false) {
      // Handle field-specific errors first
      if (errorObj.errors && typeof errorObj.errors === "object") {
        let hasFieldErrors = false;

        Object.entries(errorObj.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            hasFieldErrors = true;
            messages.forEach((msg: string) => {
              // You can choose to show field name or not
              // Option 1: Show just the message
              toast.error(msg);

              // Option 2: Show field name with message
              // toast.error(`${field}: ${msg}`);

              // Option 3: Show formatted field name
              // const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
              // toast.error(`${fieldName}: ${msg}`);
            });
          } else if (typeof messages === "string") {
            hasFieldErrors = true;
            toast.error(messages);
          }
        });

        // If we showed field errors, we might not need to show the general message
        if (hasFieldErrors) {
          return;
        }
      }

      // Handle general error messages
      if (errorObj.message) {
        const messages = Array.isArray(errorObj.message)
          ? errorObj.message
          : [errorObj.message];

        messages.forEach((msg: string) => {
          if (msg && msg.trim()) {
            toast.error(msg);
          }
        });
        return;
      }

      // Handle by status code if no other message
      handleByStatusCode(errorObj.statusCode || 500, errorObj.errorType);
      return;
    }
  }

  // Handle ApiError instances
  if (error instanceof ApiError) {
    processApiError(error);
    return;
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    // Check if the error has additional properties
    const errorWithDetails = error as any;

    if (
      errorWithDetails.errors &&
      typeof errorWithDetails.errors === "object"
    ) {
      // Handle field-specific errors attached to Error object
      Object.entries(errorWithDetails.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((msg: string) => {
            toast.error(msg);
          });
        }
      });
      return;
    }

    toast.error(error.message || "An unexpected error occurred");
    return;
  }

  // Fallback for unknown error types
  toast.error("An unknown error occurred");
};

const processApiError = (error: ApiError) => {
  const { statusCode, message, rawErrors, errorType } = error;

  logger.info("Processing ApiError", {
    statusCode,
    message,
    errorType,
    rawErrors,
  });

  // First check for field-specific errors in rawErrors
  if (rawErrors && typeof rawErrors === "object") {
    let hasFieldErrors = false;

    // Check for 'errors' field (your API's format)
    if ("errors" in rawErrors && typeof rawErrors.errors === "object") {
      const errors = rawErrors.errors as Record<string, string[]>;
      Object.entries(errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          hasFieldErrors = true;
          messages.forEach((msg: string) => {
            toast.error(msg);
          });
        }
      });
    }

    // Check for direct field errors in rawErrors
    if (!hasFieldErrors) {
      Object.entries(rawErrors).forEach(([field, errorMessages]) => {
        if (
          field !== "message" &&
          field !== "status" &&
          field !== "statusCode"
        ) {
          if (Array.isArray(errorMessages)) {
            hasFieldErrors = true;
            errorMessages
              .filter((msg) => typeof msg === "string")
              .forEach((msg: string) => {
                toast.error(msg);
              });
          } else if (typeof errorMessages === "string") {
            hasFieldErrors = true;
            toast.error(errorMessages);
          }
        }
      });
    }

    if (hasFieldErrors) {
      return; // Don't show general message if we showed field errors
    }
  }

  const errorMessage: string =
    typeof message === "string"
      ? message
      : Array.isArray(message)
        ? (message as string[]).join(";")
        : "An error occured";

  // Handle by status code
  handleByStatusCode(statusCode, errorType, errorMessage);
};
/**
 * Handle errors by status code
 */
const handleByStatusCode = (
  statusCode: number,
  errorType?: string,
  message?: string
) => {
  switch (statusCode) {
    case 400:
    case 422:
      toast.error(message || "Validation failed. Please check your input.");
      break;
    case 401:
      toast.error(message || "You are not authenticated. Please log in.");
      break;
    case 403:
      toast.error(
        message || "You do not have permission to perform this action."
      );
      break;
    case 404:
      toast.error(message || "The requested resource was not found.");
      break;
    case 408:
      toast.error(message || "Request timed out. Please try again.");
      break;
    case 429:
      toast.error(message || "Too many requests. Please try again later.");
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      toast.error(message || "Server error. Please try again later.");
      break;
    default:
      toast.error(message || "An unexpected error occurred.");
  }
};
/**
 * Helper to format field names for display
 */
export const formatFieldName = (field: string): string => {
  return field
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Helper to extract all error messages from an error object
 */
export const extractErrorMessages = (error: unknown): string[] => {
  const messages: string[] = [];

  if (typeof error === "object" && error !== null) {
    const errorObj = error as any;

    // Check for errors field
    if (errorObj.errors && typeof errorObj.errors === "object") {
      Object.values(errorObj.errors).forEach((fieldErrors) => {
        if (Array.isArray(fieldErrors)) {
          messages.push(
            ...fieldErrors.filter((msg) => typeof msg === "string")
          );
        } else if (typeof fieldErrors === "string") {
          messages.push(fieldErrors);
        }
      });
    }

    // Check for message field
    if (errorObj.message) {
      if (Array.isArray(errorObj.message)) {
        messages.push(
          ...errorObj.message.filter((msg: any) => typeof msg === "string")
        );
      } else if (typeof errorObj.message === "string") {
        messages.push(errorObj.message);
      }
    }
  } else if (error instanceof Error) {
    messages.push(error.message);
  }

  return messages.filter((msg, index, self) => self.indexOf(msg) === index); // Remove duplicates
};
