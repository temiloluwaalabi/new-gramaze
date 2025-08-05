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
  user_id: number | string;
  appointment_type: string;
  visit_type: string | null;
  date: string;
  time: string;
  location?: string | null;
  meeting_link?: string | null;
  additional_address?: string | null;
  home_address?: string | null;
  contact?: string | null;
  additional_note?: string | null;
  extra_charges?: number | null;
  hospital_name?: string | null;
  hospital_address?: string | null;
  created_at: string;
  updated_at: string;
  mark_as_arrived?: boolean | null;
  arrival_photo?: string | null;
  arrival_current_address?: string | null;
  additional_note_caregiver?: string | null;
  caregiver_id: string;
  caregiver?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}
