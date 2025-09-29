"use server";

import { adminServices, healthTrackerService } from "@/lib/api/api";
import { ApiError } from "@/lib/api/api-client";
import { ApiResponse } from "@/types";

import { getSession } from "../session.actions";

export const getLastTracker = async () => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await healthTrackerService.getLastTracker();

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
        health_tracker: {
          blood_glucose: string;
          blood_pressure: string;
          weight: number;
          pulse: number;
        };
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        health_tracker: {
          blood_glucose: string;
          blood_pressure: string;
          weight: number;
          pulse: number;
        };
      }>;
    };

    console.log("SUCCESS RESPONSE", successResponse);
    return {
      success: true,
      message: successResponse.message,
      health_tracker: successResponse.data.health_tracker,
    };
  } catch (error) {
    console.error("Get Last Tracker Error:", error);

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

export const getLastTrackers = async ({
  start_date,
  end_date,
}: {
  start_date?: string;
  end_date?: string;
} = {}) => {
  try {
    // if (!start_date || !end_date) {
    //   throw new ApiError({
    //     statusCode: 400,
    //     message: 'Start date and end date are required',
    //     errorType: 'ValidationError',
    //   });
    // }

    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await healthTrackerService.getLastTrackers({
      start_date,
      end_date,
    });

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    const successResponse = response as {
      status: true;
      message: string;
      // current_page: number;
      // per_page: number;
      // total: number;
      // last_page: number;
      tracker: {
        id: number;
        user_id: string;
        caregiver_id: string;
        status: string;
        reason: string | null;
        created_at: string;
        updated_at: string;
        metrics: {
          name: string;
          value: string;
        }[];
        blood_glucose: string;
        blood_pressure: string;
        weight: string;
        pulse: string;
      }[];
    };

    console.log("SUCCESS RESPONSE", successResponse);
    return {
      success: true,
      message: successResponse.message,
      // current_page: successResponse.current_page,
      // per_page: successResponse.per_page,
      // total: successResponse.total,
      // last_page: successResponse.last_page,
      tracker: successResponse.tracker,
    };
  } catch (error) {
    console.error("Get Last Trackers Error:", error);

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

export const getLastThreeReports = async () => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await healthTrackerService.getLastThreeReports();

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
        reports: {
          id: number;
          report_name: string;
          report_file: string;
          user_id: string;
          caregiver_id: string;
          created_at: string;
          updated_at: string;
        }[];
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        reports: {
          id: number;
          report_name: string;
          report_file: string;
          user_id: string;
          caregiver_id: string;
          created_at: string;
          updated_at: string;
        }[];
      }>;
    };

    console.log("SUCCESS RESPONSE", successResponse);
    return {
      success: true,
      message: successResponse.message,
      reports: successResponse.data.reports,
    };
  } catch (error) {
    console.error("Get Last Three Reports Error:", error);

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

export const getLastThreeNotes = async () => {
  try {
    const sessionToken = await getSession();
    if (!sessionToken) {
      throw new ApiError({
        statusCode: 401,
        message: "No active session found",
        errorType: "SessionError",
      });
    }

    const response = await healthTrackerService.getLastThreeNotes();

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
        notes: [];
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        notes: [];
      }>;
    };

    console.log("SUCCESS RESPONSE", successResponse);
    return {
      success: true,
      message: successResponse.message,
      notes: successResponse.data.notes,
    };
  } catch (error) {
    console.error("Get Last Three Notes Error:", error);

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

export const getUserHealthReports = async ({
  start_date,
  end_date,
  caregiver_name,
  report_name,
}: {
  start_date?: string;
  end_date?: string;
  caregiver_name?: string;
  report_name?: number;
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

    const response = await healthTrackerService.getUserHealthReports({
      start_date,
      end_date,
      caregiver_name,
      report_name,
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
        reports: [];
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        reports: [];
      }>;
    };

    console.log("SUCCESS RESPONSE", successResponse);
    return {
      success: true,
      message: successResponse.message,
      reports: successResponse.data.reports,
    };
  } catch (error) {
    console.error("Get User Health Reports Error:", error);

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

export const getUserHealthNotes = async ({
  start_date,
  end_date,
  caregiver_name,
  notes,
}: {
  start_date?: string;
  end_date?: string;
  caregiver_name?: string;
  notes?: number;
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

    const response = await healthTrackerService.getUserHealthNotess({
      start_date,
      end_date,
      caregiver_name,
      notes,
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
        reports: [];
      };
      rawResponse: ApiResponse<{
        status: true;
        message: string;
        reports: [];
      }>;
    };

    console.log("SUCCESS RESPONSE", successResponse);
    return {
      success: true,
      message: successResponse.message,
      notes: successResponse.data.reports, // Note: API returns 'reports' but we're treating as notes
    };
  } catch (error) {
    console.error("Get User Health Notes Error:", error);

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
export const getAllHealthMetrics = async () => {
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
      await adminServices.patient_management.fetchHealthMetrics();

    if (ApiError.isAPiError(response)) {
      throw response;
    }

    const successResponse = response as {
      success: true;
      status: number;
      message: string;
      data: {
        status: true;
        metric_types: {
          id: number;
          name: string;
          code: string;
          created_at: string;
          updated_at: string;
        }[];
      };
    };

    return {
      success: true,
      message: successResponse.message,
      metrics: successResponse.data.metric_types,
    };
  } catch (error) {
    console.error("Get Appointment Stats Error:", error);

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
