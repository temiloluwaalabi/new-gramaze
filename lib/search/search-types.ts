/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessagePreview } from "@/components/pages/main-user-dashboard";
import { Appointment, HealthReport, HealthNote } from "@/types";

// lib/search/search-types.ts
export type SearchResultType =
  | "appointment"
  | "message"
  | "caregiver"
  | "health-tracker"
  | "health-report"
  | "health-note"
  | "payment"
  | "page";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  url: string;
  metadata?: {
    date?: string;
    status?: string;
    avatar?: string;
    amount?: string;
    [key: string]: any;
  };
  matchScore: number;
};

export type SearchableData = {
  appointments: Appointment[];
  messages: MessagePreview[];
  caregivers: Array<{
    id: number;
    user_id: string;
    caregiver_id: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    caregiver: {
      id: number;
      first_name: string;
      last_name: string;
    };
  }>;
  healthTrackers: Array<{
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
  }>;
  healthReports: HealthReport[];
  healthNotes: HealthNote[];
  paymentNotifications: Array<{
    id: number;
    pay_reference: string;
    user_id: number;
    plan_code: string;
    amount: string;
    status: string;
    message: string;
    created_at: string;
    updated_at: string;
  }>;
};
