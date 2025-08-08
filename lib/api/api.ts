import { format } from "date-fns";

import { getSession } from "@/app/actions/session.actions";
import { gramazeEndpoints } from "@/config/routes";
import {
  Appointment,
  Plan,
  User,
  ChatListResponse,
  MessagesResponse,
  SendMessagePayload,
  SendMessageResponse,
  SearchUsersResponse,
  BackendMessagesResponse,
  ConversationsResponse,
  ChatUser,
} from "@/types";

import { ApiError, backendAPiClient } from "./api-client";
import { handleApiBackendError, makeApiRequest } from "./api-request-setup";
import {
  BiodataSchemaType,
  LoginSchemaType,
  RegisterSchemaType,
} from "../schemas/user.schema";

export const authService = {
  getUserDetails: async () => {
    return makeApiRequest<{
      status: true;
      message: string;
      user: User;
    }>(`${gramazeEndpoints.onboarding.getUserInfo}`, "GET");
  },

  // updateUserInfo: async (values: ) => {

  // },
  registerStepOne: async (values: RegisterSchemaType, pathname: string) => {
    return makeApiRequest<{
      status: true;
      message: string;
      token: string;
    }>(`${gramazeEndpoints.auth.register}`, "POST", {
      pathname,
      body: values,
    });
  },
  onboardSetUserType: async (type: string, pathname: string) => {
    return makeApiRequest<{
      status: true;
      message: string;
    }>(`${gramazeEndpoints.onboarding.setUserType}`, "POST", {
      pathname,
      body: { user_type: type },
    });
  },
  onboardSetUserPlan: async (plan: string, pathname: string) => {
    return makeApiRequest<{
      status: true;
      message: string;
    }>(`${gramazeEndpoints.onboarding.setUserPlan}`, "POST", {
      pathname,
      body: { plan_code: plan },
    });
  },
  InitiatePasswordReset: async (
    values?: { email?: string },
    authSide?: boolean
  ) => {
    console.log("ERR", {
      frontend_url: process.env.NEXT_PUBLIC_CLIENT_URL,
      email: values?.email,
    });
    if (authSide) {
      return makeApiRequest<{
        status: true;
        message: string;
      }>(`${gramazeEndpoints.auth.forgotPassword}`, "POST", {
        body: {
          frontend_url: process.env.NEXT_PUBLIC_CLIENT_URL,
          email: values?.email,
        },
      });
    } else {
      return makeApiRequest<{
        status: true;
        message: string;
      }>(`${gramazeEndpoints.accountSettings.password.resetInitiate}`, "POST", {
        body: {
          frontend_url: process.env.NEXT_PUBLIC_CLIENT_URL,
          email: values?.email,
        },
      });
    }
  },
  UpdateuserBiodata: async (values: BiodataSchemaType) => {
    try {
      const session = await getSession();
      const response = await backendAPiClient.request({
        method: "GET",
        maxBodyLength: Infinity,
        url: `${gramazeEndpoints.onboarding.updateProfile}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        data: {
          first_name: values.first_name,
          last_name: values.last_name,
          dob: format(values.dob, "yyyy-MM-dd"),
          gender: values.gender,
          phone: values.phoneNumber,
          address: values.address,
        },
      });

      console.log("RESPONSE TWO", response);
      return {
        status: response.data.status as boolean,
        message: response.data.message as string,
        user: response.data.user as User,
      };
    } catch (error) {
      return handleApiBackendError(error);
    }
  },
  UpdateuserProfile: async (values: BiodataSchemaType) => {
    return makeApiRequest<{
      status: true;
      message: string;
      user: User;
    }>(`${gramazeEndpoints.accountSettings.profile.update}`, "POST", {
      body: {
        first_name: values.first_name,
        last_name: values.last_name,
        dob: format(values.dob, "yyyy-MM-dd"),
        gender: values.gender,
        phone: values.phoneNumber,
        address: values.address,
        relationship_to_emergency_contact:
          values.emergencyContact?.relationship || "",
        emergency_contact_name: values.emergencyContact?.name || "",
        emergency_contact_phone: values.emergencyContact?.phoneNumber || "",
      },
    });
  },
  UpdateNotificationSettings: async (values: {
    activities_notification: string;
    factor_authentication: string;
    reminder_notification: string;
  }) => {
    return makeApiRequest<{
      status: true;
      message: string;
      user: User;
    }>(`${gramazeEndpoints.accountSettings.notification.update}`, "POST", {
      body: values,
    });
  },
  ResetPassword: async (values: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }) => {
    return makeApiRequest<{
      status: true;
      message: string;
      user: User;
    }>(`${gramazeEndpoints.accountSettings.password.reset}`, "POST", {
      body: values,
    });
  },

  UpdateMedicalReport: async (values: FormData, pathname: string) => {
    return makeApiRequest<{
      status: true;
      message: string;
      user: User;
    }>(`${gramazeEndpoints.onboarding.updateMedicalReport}`, "POST", {
      pathname,
      body: values,
    });
  },
  VirtualAppointment: async (
    values: {
      appointment_type: string;
      date: string;
      time: string;
      location: string;
      meeting_link: string;
      additional_address: string;
    },
    pathname: string
  ) => {
    return makeApiRequest<{
      status: true;
      message: string;
      appointment: Appointment;
    }>(`${gramazeEndpoints.onboarding.scheduleAppointment}`, "POST", {
      pathname,
      body: values,
    });
  },
  PhysicalHomeAppointment: async (
    values: {
      appointment_type: string;
      visit_type: string;
      date: string;
      time: string;
      home_address: string;
      contact: string;
      additional_note: string;
    },
    pathname: string
  ) => {
    return makeApiRequest<{
      status: true;
      message: string;
      appointment: Appointment;
    }>(`${gramazeEndpoints.onboarding.scheduleAppointment}`, "POST", {
      pathname,
      body: values,
    });
  },
  PhysicalHospitalAppointment: async (
    values: {
      appointment_type: string;
      visit_type: string;
      date: string;
      time: string;
      hospital_name: string;
      hospital_address: string;
      contact: string;
      additional_note: string;
    },
    pathname: string
  ) => {
    return makeApiRequest<{
      status: true;
      message: string;
      appointment: Appointment;
    }>(`${gramazeEndpoints.onboarding.scheduleAppointment}`, "POST", {
      pathname,
      body: values,
    });
  },
  Login: async (values: LoginSchemaType, pathname: string) => {
    return makeApiRequest<{
      status: true;
      message: string;
      token: string;
      user: User;
    }>(`${gramazeEndpoints.auth.login}`, "POST", {
      pathname,
      body: values,
    });
  },
};

export const appointmentService = {
  user: {
    getUserAppointments: async ({
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
      return makeApiRequest<{
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
      }>(`${gramazeEndpoints.appointment.user.all}`, "GET", {
        params: {
          ...(date && { date }),
          ...(caregiver && { caregiver }),
          ...(time && { time }),
          ...(per_page && { per_page }),
          ...(page && { page }),
        },
      });
    },
    getAppointmentDetail: async (appointmentId: string) => {
      return makeApiRequest<{
        status: true;
        message: string;
        appointment: Appointment;
      }>(
        `${gramazeEndpoints.appointment.user.detail}/${appointmentId}`,
        "GET",
        {}
      );
    },
    rescheduleAppointment: async ({
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
      return makeApiRequest<{
        status: true;
        message: string;
        appointment: Appointment;
      }>(`${gramazeEndpoints.appointment.user.reschedule}`, "POST", {
        body: { id, date, time, additional_note },
      });
    },
  },
  caregiver: {
    getCaregiverAppointments: async ({
      per_page,
      page,
    }: {
      date?: string;
      caregiver?: string;
      time?: string;
      per_page?: number;
      page?: number;
    } = {}) => {
      return makeApiRequest<{
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
      }>(`${gramazeEndpoints.appointment.caregiver.all}`, "GET", {
        params: {
          ...(per_page && { per_page }),
          ...(page && { page }),
        },
      });
    },
    getCaregiverAppointmentDetails: async (appointmentId: string) => {
      return makeApiRequest<{
        status: true;
        message: string;
        appointment: Appointment;
      }>(
        `${gramazeEndpoints.appointment.caregiver.detail}/${appointmentId}`,
        "GET",
        {}
      );
    },
    markAppointmentAsArrived: async (values: {
      id: string;

      additional_note_caregiver: string;
    }) => {
      return makeApiRequest<{
        status: true;
        message: string;
        appointment: Appointment;
      }>(`${gramazeEndpoints.appointment.caregiver.markArrival}`, "POST", {
        body: values,
      });
    },
    confirmAppointmentArrival: async (values: {
      id: string;
      arrival_photo: string;
      arrival_current_address: string;
    }) => {
      return makeApiRequest<{
        status: true;
        message: string;
        appointment: Appointment;
      }>(`${gramazeEndpoints.appointment.caregiver.confirmArrival}`, "POST", {
        body: values,
      });
    },
  },
};

export const healthTrackerService = {
  getLastTracker: async () => {
    return makeApiRequest<{
      status: true;
      message: string;
      health_tracker: {
        blood_glucose: string;
        blood_pressure: string;
        weight: number;
        pulse: number;
      };
    }>(`${gramazeEndpoints.health.user.lastTracker}`, "GET");
  },
  getLastTrackers: async ({
    start_date,
    end_date,
  }: { start_date?: string; end_date?: string } = {}) => {
    return makeApiRequest<{
      status: true;
      message: string;
      health_tracker: {
        id: number;
        blood_glucose: string;
        blood_pressure: string;
        weight: string;
        pulse: string;
        created_at: string;
        updated_at: string;
        user_id: string;
        caregiver_id: string;
      }[];
    }>(`${gramazeEndpoints.health.user.trackers}`, "GET", {
      params: {
        ...(end_date && { end_date }),
        ...(start_date && { start_date }),
      },
    });
  },
  getLastThreeReports: async () => {
    return makeApiRequest<{
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
    }>(`${gramazeEndpoints.health.user.lastThreeReports}`, "GET");
  },
  getLastThreeNotes: async () => {
    return makeApiRequest<{
      status: true;
      message: string;
      notes: [];
    }>(`${gramazeEndpoints.health.user.lastThreeNotes}`, "GET");
  },
  getUserHealthReports: async ({
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
    return makeApiRequest<{
      status: true;
      message: string;
      reports: [];
    }>(`${gramazeEndpoints.health.user.reports}`, "GET", {
      params: {
        ...(start_date && { start_date }),
        ...(end_date && { end_date }),
        ...(caregiver_name && { caregiver_name }),
        ...(report_name && { report_name }),
      },
    });
  },
  getUserHealthNotess: async ({
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
    return makeApiRequest<{
      status: true;
      message: string;
      reports: [];
    }>(`${gramazeEndpoints.health.user.notes}`, "GET", {
      params: {
        ...(start_date && { start_date }),
        ...(end_date && { end_date }),
        ...(caregiver_name && { caregiver_name }),
        ...(notes && { notes }),
      },
    });
  },
};
export const caregiverServices = {
  user: {
    getCaregiverHistory: async ({
      per_page,
      end_date,
      start_date,
      caregiver,
    }: {
      start_date?: string;
      caregiver?: string;
      end_date?: string;
      per_page?: number;
    } = {}) => {
      return makeApiRequest<{
        status: true;
        message: string;
        histories: {
          current_page: number;
          data: User[];
          from: number;
          last_page: number;
          per_page: number;
          to: number;
          total: number;
        };
      }>(`${gramazeEndpoints.caregiver.user.history}`, "GET", {
        params: {
          ...(per_page && { per_page }),
          ...(start_date && { start_date }),
          ...(typeof end_date !== "undefined" && { end_date }),
          ...(caregiver && { caregiver }),
        },
      });
    },
    getCaregiverHistoryDetails: async (caregiver_id: string) => {
      return makeApiRequest<{
        status: true;
        message: string;
        appointment: Appointment;
      }>(`${gramazeEndpoints.caregiver.user.detail}`, "GET", {
        params: {
          caregiver_id,
        },
      });
    },
    rateCaregiver: async (values: {
      caregiver_id: number;
      rating: number;
      feedback: string;
    }) => {
      return makeApiRequest<{
        status: true;
        message: string;
        appointment: Appointment;
      }>(`${gramazeEndpoints.caregiver.user.rating}`, "POST", {
        body: values,
      });
    },
  },
  caregiver: {
    getPatientHistory: async ({
      per_page,
      end_date,
      start_date,
      caregiver,
    }: {
      start_date?: string;
      caregiver?: string;
      end_date?: string;
      per_page?: number;
    } = {}) => {
      return makeApiRequest<{
        status: true;
        message: string;
        histories: {
          current_page: number;
          data: User[];
          from: number;
          last_page: number;
          per_page: number;
          to: number;
          total: number;
        };
      }>(`${gramazeEndpoints.caregiver.patient.history}`, "GET", {
        params: {
          ...(per_page && { per_page }),
          ...(start_date && { start_date }),
          ...(typeof end_date !== "undefined" && { end_date }),
          ...(caregiver && { caregiver }),
        },
      });
    },
  },
};
export const billingService = {
  getAvailablePlans: async () => {
    return makeApiRequest<{
      status: true;
      message: string;
      plans: Plan[];
    }>(`${gramazeEndpoints.billing.plan.lists}`, "GET");
  },
  getCurrentUserPlan: async () => {
    return makeApiRequest<{
      status: true;
      message: string;
      current_plan: Plan;
    }>(`${gramazeEndpoints.billing.user.currentPlan}`, "GET");
  },
  buyPlan: async (values: { plan_code: string }) => {
    return makeApiRequest<{
      status: true;
      message: string;
    }>(`${gramazeEndpoints.billing.user.buyPlan}`, "POST", {
      body: {
        ...values,
        callback_url: process.env.NEXT_PUBLIC_ADMIN_URL,
      },
    });
  },
  initiatePayment: async (values: {
    plan_code: string;
    callback_url: string;
  }) => {
    return makeApiRequest<{
      status: true;
      message: string;
      initiate_payment_data: {
        authorization_url: string;
        access_code: string;
        reference: string;
      };
    }>(`${gramazeEndpoints.billing.user.buyPlan}`, "POST", {
      body: values,
    });
  },
  verifyPayment: async (reference: string) => {
    return makeApiRequest<{
      status: true;
      message: string;
    }>(`${gramazeEndpoints.billing.user.verifyPayment}`, "GET", {
      params: {
        reference,
      },
    });
  },
  getUserBillHistory: async ({
    date,
    status,
    amount,
    per_page,
  }: {
    date?: string;
    status?: string;
    amount?: number;
    per_page?: number;
  } = {}) => {
    return makeApiRequest<{
      status: true;
      message: string;
      payments: {
        current_page: number;
        data: [];
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
      };
    }>(`${gramazeEndpoints.billing.user.history}`, "GET", {
      params: {
        ...(date && { date }),
        ...(status && { status }),
        ...(amount && { amount }),
        ...(per_page && { per_page }),
      },
    });
  },
};

async function unwrapApiResult<T>(resPromise: Promise<unknown>): Promise<T> {
  const raw = await resPromise;

  // If the ApiError helper marks it as an error, throw it
  if (ApiError.isAPiError(raw)) {
    throw raw;
  }

  // Narrow raw to an object
  if (raw && typeof raw === "object") {
    const dataWrapper = raw as { data?: T };

    if ("data" in dataWrapper && dataWrapper.data !== undefined) {
      return dataWrapper.data;
    }
  }

  // Fallback: assume raw itself is T
  return raw as T;
}

export const chatServices = {
  fetchChatList: async (): Promise<ChatListResponse> => {
    const resPromise = makeApiRequest<ChatListResponse>(
      gramazeEndpoints.chats.fetchChatList,
      "GET"
    );
    return unwrapApiResult<ChatListResponse>(resPromise);
  },

  fetchMessages: async (userId: string): Promise<MessagesResponse> => {
    const url =
      typeof gramazeEndpoints.chats.fetchMessages === "function"
        ? gramazeEndpoints.chats.fetchMessages(userId)
        : `${String(gramazeEndpoints.chats.fetchMessages)}?user_id=${encodeURIComponent(userId)}`;

    const raw = await unwrapApiResult<BackendMessagesResponse>(
      makeApiRequest<BackendMessagesResponse>(url, "GET")
    );

    const backendMessages = Array.isArray(raw?.messages) ? raw.messages : [];

    const mapped = backendMessages.map((m) => ({
      id: String(m.id),
      senderId: String(m.sender_id),
      receiverId: String(m.receiver_id),
      message: m.message,
      timestamp: m.created_at,
      isRead: m.read_at !== null && m.read_at !== undefined,
    }));

    return { messages: mapped };
  },

  sendMessage: async (
    payload: SendMessagePayload
  ): Promise<SendMessageResponse> => {
    // transform frontend payload -> backend payload shape
    const body = {
      sender_id: payload.senderId,
      receiver_id: payload.receiverId,
      message: payload.message,
    };

    const resPromise = makeApiRequest<SendMessageResponse>(
      gramazeEndpoints.chats.sendMessage,
      "POST",
      {
        body,
      }
    );

    return unwrapApiResult<SendMessageResponse>(resPromise);
  },

  markMessageAsRead: async (
    messageId: string
  ): Promise<{ message: string }> => {
    const resPromise = makeApiRequest<{ message: string }>(
      gramazeEndpoints.chats.markAsRead,
      "POST",
      {
        body: { message_id: messageId },
      }
    );
    return unwrapApiResult<{ message: string }>(resPromise);
  },

  searchByName: async (name: string): Promise<SearchUsersResponse> => {
    const url =
      typeof gramazeEndpoints.chats.searchByName === "function"
        ? gramazeEndpoints.chats.searchByName(name)
        : `${String(gramazeEndpoints.chats.searchByName)}?${encodeURIComponent(name)}`;

    const resPromise = makeApiRequest<SearchUsersResponse>(url, "GET");
    return unwrapApiResult<SearchUsersResponse>(resPromise);
  },

  fetchConversations: async (): Promise<ChatUser[]> => {
    const resPromise = makeApiRequest<ConversationsResponse>(
      gramazeEndpoints.chats.fetchConversations,
      "GET"
    );
    const raw = await unwrapApiResult<ConversationsResponse>(resPromise);

    // raw is an array of { id, first_name }
    const convs = Array.isArray(raw) ? raw : [];
    const mapped = convs.map((c) => {
      const safe = c as { id: string | number; first_name?: string };
      return {
        id: String(safe.id),
        name: safe.first_name ?? "",
        avatar: undefined,
        message_notification: null,
      };
    }) as ChatUser[];

    return mapped;
  },
};

export const adminServices = {
  user_management: {
    getUserDetails: async (userId: number) => {
      return makeApiRequest<{
        status: true;
        message: string;
        user: User;
      }>(`${gramazeEndpoints.admin.user.actions.view}`, "GET", {
        params: {
          user_id: userId,
        },
      });
    },

    //  getUserDetails: async (userId: string) => {
    // try {
    //   const session = await getSession();
    //   const response = await backendAPiClient.request({
    //     method: 'GET',
    //     maxBodyLength: Infinity,
    //     url: `${gramazeEndpoints.onboarding.updateProfile}`,
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${session.accessToken}`,
    //     },
    //     data: {
    //       first_name: values.first_name,
    //       last_name: values.last_name,
    //       dob: values.dob,
    //       gender: values.gender,
    //       phone: values.phoneNumber,
    //       address: values.address,
    //     },
    //   });

    //   console.log('RESPONSE TWO', response);
    //   return {
    //     status: response.data.status as boolean,
    //     message: response.data.message as string,
    //     user: response.data.user as User,
    //   };
    // } catch (error) {
    //   return handleApiBackendError(error);
    // }
  },
  patient_management: {
    getPatientStats: async () => {
      return makeApiRequest<{
        status: true;
        message: string;
        data: {
          total_patients: number;
          active_patients: number;
          suspended_patients: number;
          high_risky_patient: number;
        };
      }>(`${gramazeEndpoints.admin.patient.stats}`, "GET");
    },

    updatePlan: async (
      values: {
        user_id: number;
        plan: string;
      },
      pathname: string
    ) => {
      return makeApiRequest<{
        status: true;
        message: string;
        user: User;
      }>(`${gramazeEndpoints.admin.plan.update}`, "POST", {
        pathname,
        body: values,
      });
    },
    addHealthTracker: async (
      values: {
        blood_glucose?: string;
        blood_pressure?: string;
        weight?: number;
        pulse?: number;
        user_id: number;
        caregiver_id: number;
      },
      pathname: string
    ) => {
      console.log("NEW VALUES", values);
      return makeApiRequest<{
        status: true;
        message: string;
        tracker: {
          id: number;
          blood_glucose: string;
          blood_pressure: string;
          weight: string;
          pulse: string;
          created_at: string;
          updated_at: string;
          user_id: number;
          caregiver_id: number;
        };
      }>(`${gramazeEndpoints.admin.healthTracker.add}`, "POST", {
        pathname,
        body: {
          ...values,
          weight: Number(values.weight),
          pulse: Number(values.pulse),
        },
      });
    },
    updateHealthTracker: async (
      values: {
        blood_glucose?: string;
        blood_pressure?: string;
        weight?: string;
        pulse?: string;
        user_id: number;
        caregiver_id: number;
        id: number;
      },
      pathname: string
    ) => {
      return makeApiRequest<{
        status: true;
        message: string;
        tracker: {
          id: number;
          blood_glucose: string;
          blood_pressure: string;
          weight: string;
          pulse: string;
          created_at: string;
          updated_at: string;
          user_id: number;
          caregiver_id: number;
        };
      }>(`${gramazeEndpoints.admin.healthTracker.update}`, "POST", {
        pathname,
        body: values,
      });
    },
    fetchHealthTracker: async (values: { user_id: number }) => {
      try {
        const session = await getSession();
        const response = await backendAPiClient.request({
          method: "POST",
          maxBodyLength: Infinity,
          url: `${gramazeEndpoints.admin.healthTracker.fetch}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          data: {
            user_id: values.user_id,
          },
        });
        console.log("HEALTH_TRACKER_RESPONSE", response.data);
        return {
          status: response.data.status as boolean,
          message: response.data.message as string,
          tracker: response.data.trackers as {
            id: number;
            blood_glucose: string;
            blood_pressure: string;
            weight: string;
            pulse: string;
            created_at: string;
            updated_at: string;
            user_id: string;
            caregiver_id: string;
          }[],
        };
      } catch (error) {
        return handleApiBackendError(error);
      }
    },
    addHealthReport: async (values: FormData, pathname: string) => {
      return makeApiRequest<{
        status: true;
        message: string;
        user: User;
      }>(`${gramazeEndpoints.admin.healthReport.add}`, "POST", {
        pathname,
        body: values,
      });
    },
    fetchUserHealthReports: async (
      values: {
        user_id: string;
      },
      pathname?: string
    ) => {
      return makeApiRequest<{
        status: true;
        message: string;
        data: [];
      }>(`${gramazeEndpoints.admin.healthReport.fetch}`, "POST", {
        pathname,
        body: values,
      });
    },
    deleteHealthReport: async (
      values: {
        id: string;
      },
      pathname: string
    ) => {
      return makeApiRequest<{
        status: true;
        message: string;
        data: [];
      }>(`${gramazeEndpoints.admin.healthReport.delete}`, "POST", {
        pathname,
        body: values,
      });
    },
  },
};
export const helpCenterServices = {
  getFaqCategories: async () => {
    return makeApiRequest<{
      status: true;
      message: string;
    }>(`${gramazeEndpoints.faq.categories}`, "GET");
  },
  getFaqContent: async (category_code: string) => {
    return makeApiRequest<{
      status: true;
      message: string;
    }>(`${gramazeEndpoints.faq.categoryContent}`, "GET", {
      params: {
        category_code,
      },
    });
  },
};
export const notificationServices = {
  getAllNotification: async () => {
    return makeApiRequest<{
      status: true;
      message: string;
      all: [];
      read: [];
      unread: [];
    }>(`${gramazeEndpoints.notification.getAll}`, "GET");
  },
  viewNotification: async (notification_id: number) => {
    return makeApiRequest<{
      status: true;
      message: string;
    }>(`${gramazeEndpoints.notification.view}`, "GET", {
      params: {
        notification_id,
      },
    });
  },
};
