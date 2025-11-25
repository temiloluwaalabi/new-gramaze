import { ROLES } from ".";

export type Role = (typeof ROLES)[keyof typeof ROLES];

// --- Route Definitions ---
export const allRoutes = {
  auth: {
    signIn: { url: "/sign-in" },
    signUp: { url: "/sign-up" },
    forgotPassword: { url: "/forgot-password" },
    resetPassword: { url: "/reset-password" },
    onboarding: { url: "/onboarding" },
  },

  user: {
    dashboard: {
      home: { url: "/dashboard" },
      appointment: { url: "/dashboard/appointment" },
      scheduleAppointment: {
        url: "/dashboard/appointment/schedule",
      },
      billing: { url: "/dashboard/billing" },
      caregiverHistory: { url: "/dashboard/caregiver-history" },
      caregiverUserHistory: { url: "/dashboard/caregiver-history/1" },
      healthTracker: { url: "/dashboard/health-tracker" },
      helpCenter: { url: "/dashboard/help-center" },
      helpCenterSingle: { url: "/dashboard/help-center/general-faqs" },
      message: { url: "/dashboard/message" },
      messageChat: { url: "/dashboard/message/chat" },
      // notifications: { url: '/dashboard/notifications' },
      settings: { url: "/dashboard/settings" },
    },
  },

  caregiver: {
    home: { url: "/caregiver" },
    appointments: { url: "/caregiver/appointments" },
    helpCenter: { url: "/caregiver/help-center" },
    messages: { url: "/caregiver/messages" },
    messageChat: { url: "/caregiver/messages/chat" },
    patients: { url: "/caregiver/patients" },
    settings: { url: "/caregiver/settings" },
  },
};

// BACKEND ENDPOINTS

export const gramazeEndpoints = {
  // Base URL placeholder
  baseUrl: process.env.NEXT_PUBLIC_ADMIN_API_URL,

  // Authentication endpoints
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    resendOtp: "/auth/resend/otp",
    verifyOtp: "/auth/confirm/email/verification",
    resend2FAOTP: "/auth/resend/otp/2fa",
    confirm2FAOTP: "/auth/confirm/otp/2fa",
  },

  // Onboarding endpoints
  onboarding: {
    setUserType: "/onboarding/set-user-type",
    setUserPlan: "/onboarding/set-user-plan",
    getUserInfo: "/onboarding/get-user-info",
    updateProfile: "/onboarding/update-profile",
    updateProfileImage: "/upload/image",
    updateMedicalReport: "/onboarding/update-medical-report",
    scheduleAppointment: "/onboarding/schedule-appointment",
  },

  hospitals: {
    action: "/hospitals/user",
    state: "/states/user", // ?country_code=NG
    lga: "/lgas/user", // ?state_code=LA
  },
  // Appointment endpoints
  appointment: {
    // User appointments
    user: {
      all: "/appointment/user/all", // ?per_page=1&page=3
      detail: "/appointment/user/detail", // ?id=4
      reschedule: "/appointment/user/reschedule",
    },

    // Caregiver appointments
    caregiver: {
      all: "/appointment/caregiver/all", // ?per_page=3&page=
      detail: "/appointment/caregiver/detail", // ?id=4
      markArrival: "/appointment/caregiver/mark/arrival",
      confirmArrival: "/appointment/caregiver/confirm/arrival",
    },
  },

  // Health tracking endpoints
  health: {
    user: {
      lastTracker: "/health/user/last/tracker",
      trackers: "/health/user/trackers", // ?start_date=2025-05-01&end_date=2025-05-20
      lastThreeReports: "/health/user/last/three/report",
      lastThreeNotes: "/health/user/last/three/note",
      reports: "/health/user/reports", // ?report_name=Blood&caregiver_name=Jane&start_date=2025-05-01&end_date=2025-05-20
      notes: "/health/user/notes", // ?notes=Blood
    },
  },

  // Caregiver endpoints
  caregiver: {
    // User interactions with caregivers
    user: {
      history: "/caregiver/user/history", // ?per_page=5
      detail: "/caregiver/detail", // ?caregiver_id=1
      rating: "/caregiver/rating",
    },

    // Caregiver interactions with patients
    patient: {
      history: "/caregiver/patient/history", // ?per_page=5
      detail: "/caregiver/patient/detail", // ?patient_id=1
      rating: "/caregiver/rating",
    },

    "health-report": {
      add: "/caregiver/health-report/add",
      fetch: "/admin/health-report/fetch",
    },
    "health-note": {
      add: "/caregiver/notes",
      fetch: "/admin/health-report/fetch",
    },
  },

  // Billing endpoints
  billing: {
    plan: {
      lists: "/billing/plan/lists",
    },
    user: {
      currentPlan: "/billing/user/current/plan",
      buyPlan: "/billing/user/buy/plan",
      verifyPayment: "/billing/user/verify/payment", // ?reference=bjbllre877
      history: "/billing/user/history", // ?amount=5000&status=paid&date=2025-05-22&per_page=20
    },
  },

  // Notification endpoints
  notification: {
    getAll: "/notification/get/all",
    view: "/notification/view", // ?notification_id=9
    paymentNotification: "/billing/user/payment/notification",
    postPayment: "/billing/user/pay/payment/notification",
  },

  // Account settings endpoints
  accountSettings: {
    profile: {
      get: "/account_settings/profile",
      update: "/account_settings/profile/update",
      updateProfileImage: "/account_settings/upload/image",
    },
    notification: {
      update: "/account_settings/notification/update",
    },
    medical: {
      update: "/account_settings/medical/update",
    },
    twoFactor: {
      update: "/account_settings/2fa/update",
    },
    password: {
      resetInitiate: "/account_settings/password/reset/initiate",
      reset: "/account_settings/password/reset",
    },
  },

  // Chat endpoints
  chats: {
    fetchChatList: "/chats/list",
    // backend expects query param user_id
    fetchMessages: (userId: string) =>
      `/chats/fetch/messages?user_id=${encodeURIComponent(userId)}`,
    // send message endpoint
    sendMessage: "/chats/send/message",
    markAsRead: "/chats/conversations",
    searchByName: (name: string) =>
      `/chats/search/name?${encodeURIComponent(name)}`,
    // NEW: conversations list endpoint
    fetchConversations: "/chats/conversation",
  },

  // FAQ endpoints
  faq: {
    categories: "/faq-categories",
    categoryContent: "/faq-category/content", // ?category_code=billing
  },

  // Admin endpoints
  admin: {
    // Dashboard
    dashboard: {
      stats: "/admin/dashboard/stats",
      appointments: "/admin/dashboard/appointments",
      appointmentsCaregiver: "/admin/dashboard/appointments/caregiver",
      patientHistory: "/admin/dashboard/patient/history",
      caregiverHistory: "/admin/dashboard/caregiver/history",
    },

    // User management
    user: {
      all: "/admin/user/all",
      active: "/admin/user/active",
      inactive: "/admin/user/inactive",
      suspended: "/admin/user/suspended",
      actions: {
        suspend: "/admin/user/action/suspend",
        restore: "/admin/user/action/restore",
        view: "/admin/user/action/view",
      },
    },

    // Patient management
    patient: {
      stats: "/admin/patient/stats",
      getAppointments: "/admin/get/appointment/user", // ?user_id=1
      updateAppointments: "/admin/update/appointment/user",
      getPayments: "/admin/get/payment/user", // ?user_id=1
      getRatings: "/admin/get/rating/user", // ?user_id=1
    },

    // Appointment management
    appointment: {
      stats: "/admin/appointment/stats",
      getCaregiverAppointments: "/admin/get/appointment/caregiver", // ?caregiver_id=1
      getCaregiverRatings: "/admin/get/rating/caregiver", // ?caregiver_id=1
    },

    // Plan management
    plan: {
      update: "/admin/plan/update",
    },

    // Health tracker management
    healthTracker: {
      add: "/caregiver/health-tracker/add",
      update: "/caregiver/health-tracker/update",
      fetch: "/admin/health-tracker/fetch",
    },

    // Health report management
    healthReport: {
      add: "/admin/health-report/add",
      fetch: "/admin/health-report/fetch",
      delete: "/admin/health-report/delete",
      fetchHealthMetrics: "/health/get/health/metrics",
    },

    // Payment management
    payments: {
      all: "/admin/payments/all",
      pending: "/admin/payments/pending",
      failed: "/admin/payments/failed",
      paid: "/admin/payments/paid",
      totalRevenue: "/admin/payment/total/revenue",
    },

    // Rating management
    ratings: {
      leaderboard: "/admin/ratings/leaderboard",
      satisfactionSummary: "/admin/ratings/satisfaction-summary",
      monthlyAverage: "/admin/ratings/monthly-average",
    },
  },
};
