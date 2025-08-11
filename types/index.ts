// Common types
type Status = "Completed" | "Cancelled" | "Pending";
// type ActionOptions = 'view' | 'edit' | 'delete';

// 1. Patient Data (Image 1)
export interface Patient {
  id: string;
  patientId: string;
  name: string;
  profileImage: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  selected?: boolean;
}

// 2. Payment Data (Image 2)
export interface Payment {
  id: string;
  amount: number;
  date: Date;
  description: string;
  status: Status;
  selected?: boolean;
}

// 3. Caregiver Schedule Data (Image 3)
export interface CaregiverSchedule {
  id: string;
  caregiverName: string;
  caregiverImage: string;
  startDate: Date;
  endDate: Date;
  selected?: boolean;
}

export interface MedicalDocument {
  id: string;
  name: string;
  fileType: "pdf" | "doc" | "docx" | "other";
  date: Date;
  selected?: boolean;
}

export interface ApiResponse<T> {
  status?: boolean;
  message?: string;
  success?: boolean;
  [key: string]: T | string | boolean | undefined;
}

export interface Plan {
  plan_name: string;
  plan_code: string;
  amount: number;
  features: string[];
}
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  agree_to_terms: string;
  user_type: string | null;
  user_role: string;
  has_set_user_type: string;
  plan: string | null;
  dob: string | null;
  gender: string | null;
  phone: string | null;
  has_set_bio_data: string;
  address: string | null;
  medical_history: string | null;
  medical_file: string | null;
  has_set_medical_history: string;
  has_set_up_appointment: string;
  has_set_plan: string;
  user_status: string;
  last_login_time: string | null;
  created_at: string;
  updated_at: string;
  activities_notification: string | null;
  factor_authentication: string | null;
  reminder_notification: string | null;
  dependents: string | null;
  message_notification: string | null;
  relationship_to_emergency_contact: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  connected_device: string | null;
}
export interface Appointment {
  id: number;
  user_id: string;
  caregiver_id: string | number;
  appointment_type: "virtual" | "physical";
  visit_type: "home" | "hospital" | null;
  date: string;
  time: string;
  location?: string | null;
  meeting_link?: string | null;
  additional_address?: string | null;
  home_address?: string | null;
  contact?: string | null;
  additional_note?: string | null;
  extra_charges?: string | null; // Note: API returns string, not number
  hospital_name?: string | null;
  hospital_address?: string | null;
  created_at: string;
  updated_at: string;
  mark_as_arrived?: boolean | null;
  arrival_photo?: string | null;
  arrival_current_address?: string | null;
  additional_note_caregiver?: string | null;
  status: "arrived" | "pending" | "completed" | "cancelled";
  patient?: {
    id: number;
    first_name: string;
    last_name: string;
  };

  caregiver?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  // Computed properties for component compatibility
  name?: string; // Will be derived from patient or caregiver
  phone?: string; // Will be derived from contact
  avatar?: string; // Will need to be provided or use default
  startTime?: string; // Will be derived from time
  endTime?: string; // Will be derived from time
  isVirtual?: boolean; // Will be derived from appointment_type
}

export type MakeApiSuccess<T> = {
  success: true;
  status: number;
  message: string;
  data: T;
  rawResponse: ApiResponse<T>;
};

// types/chat.ts
export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  message_notification: string | null;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

/**
 * UPDATED: payload to match backend
 * instead of conversationId, we supply senderId and receiverId
 */
export interface SendMessagePayload {
  senderId: string; // map -> sender_id
  receiverId: string; // map -> receiver_id
  message: string;
}

/**
 * Example response of sending a message. Adjust if backend returns different shape.
 */
export interface SendMessageResponse {
  messageId?: string | number;
  message?: string;
  // optionally include created message object etc
}

/* existing responses */
export interface ChatListResponse {
  chatUsers: ChatUser[];
  message: string;
}

export interface MessagesResponse {
  messages: Message[];
}

/* backend / search */
export interface BackendUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  medical_file?: string | null;
  message_notification?: string | null;
}

export interface SearchUsersResponse {
  status: boolean;
  message: string;
  users: BackendUser[];
}

/* backend messages */
export interface BackendMessage {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  read_at: string | null;
}

export interface BackendMessagesResponse {
  status: boolean;
  message: string;
  messages: BackendMessage[];
}

/* Conversations API */
export interface BackendConversation {
  id: number;
  first_name: string;
  // other fields if returned
}

export type ConversationsResponse = BackendConversation[]; // API returns raw array

// Define the data type based on your actual service response
export type PatientHistoryDetails = {
  // status: true;
  // message: string;
  patient: Partial<User>;
};
