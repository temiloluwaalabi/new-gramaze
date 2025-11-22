"use server";

import { revalidatePath } from "next/cache";

import { appointmentService } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import { ApiResponse, Appointment } from "@/types";

import { getSession } from "../session.actions";

// User Appointment Actions
export const getUserAppointments = async ({
  date,
  caregiver,
  time,
  per_page,
  page,
}: {
  date?: string;
  caregiver?: string;
  time?: string;
  per_page?: number;
  page?: number;
} = {}) => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await appointmentService.user.getUserAppointments({
      date,
      caregiver,
      time,
      per_page,
      page,
    });

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
        appointments: {
          current_page: number;
          data: Appointment[];
          from: number;
          last_page: number;
          to: number;
          total: number;
        };
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        appointments: {
          current_page: number;
          data: Appointment[];
          from: number;
          last_page: number;
          to: number;
          total: number;
        };
      }>;
    };

    
    return {
      success: true,
      message: successResponse.message,
      appointments: successResponse.data.appointments,
    };
  } catch (error) {
    console.error("Get User Appointments Error:", error);

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

export const getAppointmentDetail = async (appointmentId: string) => {
  try {
    if (!appointmentId) {
      throw new ApiError({
        statusCode: 400,
        message: "Appointment ID is required",
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

    const response =
      await appointmentService.user.getAppointmentDetail(appointmentId);

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
        appointment: Appointment;
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        appointment: Appointment;
      }>;
    };

    
    return {
      success: true,
      message: successResponse.message,
      appointment: successResponse.data.appointment,
    };
  } catch (error) {
    console.error("Get Appointment Detail Error:", error);

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

export const rescheduleAppointment = async ({
  id,
  date,
  time,
  additional_note,
}: {
  id: number;
  date: string;
  time: string;
  additional_note: string;
}) => {
  try {
    if (!id || !date || !time) {
      throw new ApiError({
        statusCode: 400,
        message: "ID, date, and time are required",
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

    const response = await appointmentService.user.rescheduleAppointment({
      id,
      date,
      time,
      additional_note,
    });

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
        appointment: Appointment;
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        appointment: Appointment;
      }>;
    };

    
    revalidatePath("/appointments");
    revalidatePath("/");
    return {
      success: true,
      message: successResponse.message,
      appointment: successResponse.data.appointment,
    };
  } catch (error) {
    console.error("Reschedule Appointment Error:", error);

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

// Caregiver Appointment Actions
export const getCaregiverAppointments = async ({
  per_page,
  page,
}: {
  date?: string;
  caregiver?: string;
  time?: string;
  per_page?: number;
  page?: number;
} = {}) => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response =
      await appointmentService.caregiver.getCaregiverAppointments({
        per_page,
        page,
      });

    if (ApiError.isAPiError(response)) {
      return {
        success: false,
        message: "Error fetching data",
        appointments: [],
      };
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
          to: number;
          total: number;
        };
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        appointments: {
          current_page: number;
          data: Appointment[];
          from: number;
          last_page: number;
          to: number;
          total: number;
        };
      }>;
    };

    
    return {
      success: true,
      message: successResponse.message,
      appointments: successResponse.data.appointments,
    };
  } catch (error) {
    console.error("Get Caregiver Appointments Error:", error);

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

export const getCaregiverAppointmentDetails = async (appointmentId: string) => {
  try {
    if (!appointmentId) {
      throw new ApiError({
        statusCode: 400,
        message: "Appointment ID is required",
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

    const response =
      await appointmentService.caregiver.getCaregiverAppointmentDetails(
        appointmentId
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
        appointment: Appointment;
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        appointment: Appointment;
      }>;
    };

    
    return {
      success: true,
      message: successResponse.message,
      appointment: successResponse.data.appointment,
    };
  } catch (error) {
    console.error("Get Caregiver Appointment Details Error:", error);

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

export const markAppointmentAsArrived = async (
  values: FormData,
  pathname: string
) => {
  try {
    // if (!values.id) {
    //   throw new ApiError({
    //     statusCode: 400,
    //     message: "Appointment ID is required",
    //     errorType: "ValidationError",
    //   });
    // }
    console.log("FORMDATA", values);

    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response =
      await appointmentService.caregiver.markAppointmentAsArrived(values);

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
        appointment: Appointment;
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        appointment: Appointment;
      }>;
    };

    
    revalidatePath("/appointments");
    revalidatePath(pathname);
    return {
      success: true,
      message: successResponse.message,
      appointment: successResponse.data.appointment,
    };
  } catch (error) {
    console.error("Mark Appointment As Arrived Error:", error);

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

export const confirmAppointmentArrival = async (values: {
  id: string;
  arrival_photo: string;
  arrival_current_address: string;
}) => {
  try {
    if (
      !values.id ||
      !values.arrival_photo ||
      !values.arrival_current_address
    ) {
      throw new ApiError({
        statusCode: 400,
        message: "ID, arrival photo, and current address are required",
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

    const response =
      await appointmentService.caregiver.confirmAppointmentArrival(values);

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
        appointment: Appointment;
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        appointment: Appointment;
      }>;
    };

    
    revalidatePath("/appointments");
    revalidatePath("/");
    return {
      success: true,
      message: successResponse.message,
      appointment: successResponse.data.appointment,
    };
  } catch (error) {
    console.error("Confirm Appointment Arrival Error:", error);

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
