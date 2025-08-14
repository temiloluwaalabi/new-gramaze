"use server";

import { adminServices } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import { Appointment } from "@/types";

import { ServerActionResult } from "./services/caregiver.actions";
import { getSession } from "./session.actions";

// // Appointment Management Actions
// export const rescheduleAppointmentAdmin = async ({
//   id,
//   date,
//   time,
//   additional_note,
//   caregiver_id,
// }: {
//   id: number;
//   date: string;
//   time: string;
//   additional_note: string;
//   caregiver_id: number;
// }) => {
//   try {
//     if (!id || !date || !time || !caregiver_id) {
//       throw new ApiError({
//         statusCode: 400,
//         message: 'ID, date, time, and caregiver ID are required',
//         errorType: 'ValidationError',
//       });
//     }

//     const sessionToken = await getSession();
//     if (!sessionToken) {
//       throw new ApiError({
//         statusCode: 401,
//         message: 'No active session found',
//         errorType: 'SessionError',
//       });
//     }

//     const response = await adminServices.appointment_management.rescheduleAppointment({
//       id,
//       date,
//       time,
//       additional_note,
//       caregiver_id,
//     });

//     if (ApiError.isAPiError(response)) {
//       throw response;
//     }

//     const successResponse = response as {
//       success: true;
//       status: number;
//       message: string;
//       data: {
//         status: true;
//         message: string;
//         appointment: Appointment;
//       };
//     };

//     revalidatePath('/admin/appointments');
//     return {
//       success: true,
//       message: successResponse.message,
//       appointment: successResponse.data.appointment,
//     };
//   } catch (error) {
//     console.error('Reschedule Appointment Admin Error:', error);

//     if (error instanceof ApiError) {
//       throw error;
//     }

//     throw new ApiError({
//       statusCode: 500,
//       message: error instanceof Error ? error.message : 'An unknown error occurred',
//       errorType: 'UnknownError',
//     });
//   }
// };

export const getAppointmentByUser = async ({
  user_id,
}: { user_id?: number } = {}): Promise<ServerActionResult<Appointment[]>> => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      return {
        success: false,
        message: "Authentication required",
        errors: ["Please log in to continue"],
      };
    }

    const response =
      await adminServices.appointment_management.getAppointmentByUser({
        user_id,
      });

    if (ApiError.isAPiError(response)) {
      const apiError = response as ApiError;

      const result: ServerActionResult<Appointment[]> = {
        success: false,
        message: Array.isArray(apiError.message)
          ? apiError.message[0]
          : apiError.message || "An error occured",
        errors: Array.isArray(apiError.message)
          ? apiError.message[0]
          : apiError.message || "An error occured",
      };

      if (apiError.errorType === "VALIDATION_ERROR" && apiError.rawErrors) {
        result.fieldErrors = {};

        if (apiError.rawErrors && typeof apiError.rawErrors === "object") {
          for (const [field, messages] of Object.entries(apiError.rawErrors)) {
            if (Array.isArray(messages)) {
              result.fieldErrors[field] = messages;
            } else if (typeof messages === "string") {
              result.fieldErrors[field] = [messages];
            }
          }
        }
      }

      return result;
    }

    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: {
        status: true;
        message: string;
        appointments: {
          current_page: number;
          data: Appointment[];
          from: number;
          last_page: number;
          per_page: number;
          to: number;
          total: number;
        };
      };
    };

    return {
      success: true,
      message: successResponse.message,
      data: successResponse.data.appointments.data,
    };
  } catch (error) {
    console.error("Get Appointment By User Error:", error);

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
