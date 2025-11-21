// health-record-types.ts

export type ReportType =
  | "clinical_note"
  | "diagnosis"
  | "prescription"
  | "lab_report"
  | "imaging_report"
  | "procedure_report"
  | "discharge_summary"
  | "immunization_record"
  | "allergy_record"
  | "progress_report";

export type NoteType = "caregiver_note" | "admin_note";

export type RecordStatus = "pending" | "approved" | "rejected";

export type CreatorRole = "admin" | "caregiver";

// Main Health Record
export interface HealthRecord {
  id: number;
  patient_id: number;
  appointment_id?: number;
  title: string;
  record_type: ReportType;
  description: string;
  status: RecordStatus;
  created_by_role: CreatorRole;
  created_by_id: number;
  created_by_name?: string;

  // Relationships
  reports: Report[];
  notes: Note[];
  health_tracker_ids: number[]; // IDs of health trackers included

  // Approval info
  approved_at?: string;
  approved_by_id?: number;
  approved_by_name?: string;
  rejection_reason?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// Report within a Health Record
export interface Report {
  id: number;
  health_record_id: number;
  report_type: ReportType;
  title: string;
  content: string; // JSON string or text
  findings?: string;
  recommendations?: string;
  attachments: Attachment[];

  created_by_id: number;
  created_by_name?: string;
  created_by_role: CreatorRole;

  created_at: string;
  updated_at: string;
}

// Note within a Health Record
export interface Note {
  id: number;
  health_record_id: number;
  note_type: NoteType;
  content: string;

  created_by_id: number;
  created_by_name?: string;
  created_by_role: CreatorRole;

  created_at: string;
  updated_at: string;
}

// Attachment
export interface Attachment {
  id: number;
  report_id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

// Health Tracker (from your existing system)
export interface HealthTrackerSnapshot {
  id: number;
  metrics: Array<{
    code: string;
    name: string;
    value: string;
  }>;
  user_id: number;
  caregiver_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// For creating a new health record
export interface CreateHealthRecordPayload {
  patient_id: number;
  appointment_id?: number;
  title: string;
  record_type: ReportType;
  description: string;
  health_tracker_ids: number[];
  reports: CreateReportPayload[];
  notes: CreateNotePayload[];
  created_by_role: CreatorRole;
  created_by_id: number;
}

export interface CreateReportPayload {
  report_type: ReportType;
  title: string;
  content: string;
  findings?: string;
  recommendations?: string;
  attachments?: File[];
}

export interface CreateNotePayload {
  note_type: NoteType;
  content: string;
}

// Report type configurations
export interface ReportTypeConfig {
  type: ReportType;
  label: string;
  description: string;
  icon: string;
  color: string;
  fields: ReportField[];
}

export interface ReportField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "date" | "file";
  required: boolean;
  placeholder?: string;
  options?: string[];
}

// Report type configurations
export const REPORT_TYPE_CONFIGS: Record<ReportType, ReportTypeConfig> = {
  clinical_note: {
    type: "clinical_note",
    label: "Clinical Note",
    description: "General clinical observations and notes",
    icon: "FileText",
    color: "blue",
    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        required: true,
        placeholder: "e.g., Follow-up Visit Note",
      },
      {
        name: "content",
        label: "Clinical Observations",
        type: "textarea",
        required: true,
        placeholder: "Document your clinical observations...",
      },
      {
        name: "recommendations",
        label: "Recommendations",
        type: "textarea",
        required: false,
        placeholder: "Any recommendations or follow-up actions...",
      },
    ],
  },

  diagnosis: {
    type: "diagnosis",
    label: "Diagnosis",
    description: "Medical diagnosis and assessment",
    icon: "Stethoscope",
    color: "red",
    fields: [
      {
        name: "title",
        label: "Diagnosis Title",
        type: "text",
        required: true,
        placeholder: "e.g., Type 2 Diabetes Mellitus",
      },
      {
        name: "content",
        label: "Detailed Diagnosis",
        type: "textarea",
        required: true,
        placeholder: "Provide detailed diagnosis information...",
      },
      {
        name: "findings",
        label: "Clinical Findings",
        type: "textarea",
        required: false,
        placeholder: "Document clinical findings...",
      },
      {
        name: "recommendations",
        label: "Treatment Plan",
        type: "textarea",
        required: false,
        placeholder: "Recommended treatment plan...",
      },
    ],
  },

  prescription: {
    type: "prescription",
    label: "Prescription",
    description: "Medication prescription",
    icon: "Pill",
    color: "green",
    fields: [
      {
        name: "title",
        label: "Prescription Title",
        type: "text",
        required: true,
        placeholder: "e.g., Hypertension Medication",
      },
      {
        name: "content",
        label: "Medications",
        type: "textarea",
        required: true,
        placeholder: "List medications with dosage and frequency...",
      },
      {
        name: "recommendations",
        label: "Instructions",
        type: "textarea",
        required: false,
        placeholder: "Special instructions for the patient...",
      },
    ],
  },

  lab_report: {
    type: "lab_report",
    label: "Lab Report",
    description: "Laboratory test results",
    icon: "Flask",
    color: "purple",
    fields: [
      {
        name: "title",
        label: "Lab Test Name",
        type: "text",
        required: true,
        placeholder: "e.g., Complete Blood Count (CBC)",
      },
      {
        name: "content",
        label: "Test Results",
        type: "textarea",
        required: true,
        placeholder: "Document test results...",
      },
      {
        name: "findings",
        label: "Findings",
        type: "textarea",
        required: false,
        placeholder: "Notable findings or abnormalities...",
      },
      {
        name: "recommendations",
        label: "Recommendations",
        type: "textarea",
        required: false,
        placeholder: "Follow-up recommendations...",
      },
    ],
  },

  imaging_report: {
    type: "imaging_report",
    label: "Imaging Report",
    description: "X-ray, MRI, CT scan results",
    icon: "Scan",
    color: "indigo",
    fields: [
      {
        name: "title",
        label: "Imaging Type",
        type: "text",
        required: true,
        placeholder: "e.g., Chest X-Ray",
      },
      {
        name: "content",
        label: "Imaging Results",
        type: "textarea",
        required: true,
        placeholder: "Document imaging findings...",
      },
      {
        name: "findings",
        label: "Radiologist Findings",
        type: "textarea",
        required: false,
        placeholder: "Detailed radiologist interpretation...",
      },
      {
        name: "recommendations",
        label: "Recommendations",
        type: "textarea",
        required: false,
        placeholder: "Follow-up recommendations...",
      },
    ],
  },

  procedure_report: {
    type: "procedure_report",
    label: "Procedure/Surgery Report",
    description: "Surgical or medical procedure documentation",
    icon: "Activity",
    color: "orange",
    fields: [
      {
        name: "title",
        label: "Procedure Name",
        type: "text",
        required: true,
        placeholder: "e.g., Appendectomy",
      },
      {
        name: "content",
        label: "Procedure Details",
        type: "textarea",
        required: true,
        placeholder: "Document procedure details...",
      },
      {
        name: "findings",
        label: "Operative Findings",
        type: "textarea",
        required: false,
        placeholder: "Findings during procedure...",
      },
      {
        name: "recommendations",
        label: "Post-Operative Care",
        type: "textarea",
        required: false,
        placeholder: "Post-operative instructions...",
      },
    ],
  },

  discharge_summary: {
    type: "discharge_summary",
    label: "Discharge Summary",
    description: "Hospital discharge documentation",
    icon: "LogOut",
    color: "teal",
    fields: [
      {
        name: "title",
        label: "Discharge Summary Title",
        type: "text",
        required: true,
        placeholder: "e.g., Post-Surgery Discharge",
      },
      {
        name: "content",
        label: "Summary",
        type: "textarea",
        required: true,
        placeholder: "Discharge summary details...",
      },
      {
        name: "findings",
        label: "Hospital Course",
        type: "textarea",
        required: false,
        placeholder: "Summary of hospital stay...",
      },
      {
        name: "recommendations",
        label: "Discharge Instructions",
        type: "textarea",
        required: false,
        placeholder: "Instructions for home care...",
      },
    ],
  },

  immunization_record: {
    type: "immunization_record",
    label: "Immunization Record",
    description: "Vaccination documentation",
    icon: "Syringe",
    color: "pink",
    fields: [
      {
        name: "title",
        label: "Vaccine Name",
        type: "text",
        required: true,
        placeholder: "e.g., COVID-19 Vaccine",
      },
      {
        name: "content",
        label: "Vaccination Details",
        type: "textarea",
        required: true,
        placeholder: "Vaccine details, lot number, etc...",
      },
      {
        name: "recommendations",
        label: "Next Dose Information",
        type: "textarea",
        required: false,
        placeholder: "Information about booster shots...",
      },
    ],
  },

  allergy_record: {
    type: "allergy_record",
    label: "Allergy Record",
    description: "Documented allergies and reactions",
    icon: "AlertTriangle",
    color: "red",
    fields: [
      {
        name: "title",
        label: "Allergen",
        type: "text",
        required: true,
        placeholder: "e.g., Penicillin",
      },
      {
        name: "content",
        label: "Reaction Details",
        type: "textarea",
        required: true,
        placeholder: "Describe the allergic reaction...",
      },
      {
        name: "recommendations",
        label: "Precautions",
        type: "textarea",
        required: false,
        placeholder: "Recommended precautions...",
      },
    ],
  },

  progress_report: {
    type: "progress_report",
    label: "Progress Report",
    description: "Patient progress documentation",
    icon: "TrendingUp",
    color: "green",
    fields: [
      {
        name: "title",
        label: "Progress Report Title",
        type: "text",
        required: true,
        placeholder: "e.g., Weekly Progress Update",
      },
      {
        name: "content",
        label: "Progress Details",
        type: "textarea",
        required: true,
        placeholder: "Document patient progress...",
      },
      {
        name: "findings",
        label: "Observations",
        type: "textarea",
        required: false,
        placeholder: "Notable observations...",
      },
      {
        name: "recommendations",
        label: "Next Steps",
        type: "textarea",
        required: false,
        placeholder: "Recommended next steps...",
      },
    ],
  },
};

// Helper to get report type config
export function getReportTypeConfig(type: ReportType): ReportTypeConfig {
  return REPORT_TYPE_CONFIGS[type];
}

// Helper to get all report types
export function getAllReportTypes(): ReportType[] {
  return Object.keys(REPORT_TYPE_CONFIGS) as ReportType[];
}

// Helper to format report type for display
export function formatReportType(type: ReportType): string {
  return REPORT_TYPE_CONFIGS[type]?.label || type;
}
