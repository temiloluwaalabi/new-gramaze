/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { toast } from "sonner";

import { ApiError } from "../api/api-client";
import logger from "../logger";

export const handleMutationError = (error: unknown) => {
  console.error("Mutation Error", error);

  if (error instanceof ApiError) {
    const apiError = error instanceof ApiError ? error : new ApiError(error);
    processApiError(apiError);
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message || "An unexpected error occured");
    return;
  }

  toast.error("An unknown error occured");
};

const processApiError = (error: ApiError) => {
  const { statusCode, message, rawErrors, errorType } = error;

  logger.info("Processing ApiError", {
    statusCode,
    message,
    errorType,
    rawErrors,
  });

  const errorMessage: string =
    typeof message === "string"
      ? message
      : Array.isArray(message)
        ? (message as string[]).join(";")
        : "An error occured";

  switch (statusCode) {
    case 400:
      toast.error(errorMessage || "Invalid request.");
      break;
    case 401:
      toast.error(errorMessage || "Invalid credentials. Please try again.");
      break;
    case 403:
      toast.error(
        errorMessage || "You do not have permission to perform this action."
      );
      break;
    case 404:
      toast.error(errorMessage || "Resource not found.");
      break;
    case 408:
      toast.error(
        errorMessage || "Request timed out. Please try again-client."
      );
      break;
    case 422:
      if (rawErrors && typeof rawErrors === "object") {
        // Better handling of raw validation errors
        try {
          Object.entries(rawErrors).forEach(([field, errorMessages]) => {
            if (Array.isArray(errorMessages)) {
              errorMessages
                .filter((msg) => typeof msg === "string")
                .forEach((msg: string) => {
                  toast.error(msg);
                });
            } else if (typeof errorMessages === "string") {
              toast.error(errorMessages);
            }
          });
        } catch (error) {
          console.error("Error processing rawErrors", error);
          // Fallback if raw errors processing fails
          toast.error(
            errorMessage || "Validation failed. Please check your input."
          );
        }
      } else {
        toast.error(
          errorMessage || "Validation failed. Please check your input."
        );
      }
      break;
    case 429:
      toast.error(errorMessage || "Too many requests. Please try again later.");
      break;
    case 500:
      toast.error(errorMessage || "Server error. Please try again later.");
      break;
    default:
      toast.error(errorMessage || "An unexpected error occurred.");
  }
};
