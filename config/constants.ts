import { HealthRecord } from "@/lib/health-record-types";
import { CaregiverSchedule, MedicalDocument, Patient, Payment } from "@/types";
export const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/davidleo/image/upload/v1744904805/a7a43fbe914a6e94b710e593d67989bf_ciwm02.png";

export const durations = [
  { label: "10 mins", value: 10 },
  { label: "15 mins", value: 15 },
  { label: "20 mins", value: 20 },
  { label: "30 mins", value: 30 },
  { label: "45 mins", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "1 hour 30 mins", value: 90 },
  { label: "2 hours", value: 120 },
  { label: "2 hours 30 mins", value: 150 },
  { label: "3 hours", value: 180 },
  { label: "3 hours 30 mins", value: 210 },
  { label: "4 hours", value: 240 },
  { label: "4 hours 30 mins", value: 270 },
  { label: "5 hours", value: 300 },
  { label: "5 hours 30 mins", value: 330 },
  { label: "6 hours", value: 360 },
  { label: "6 hours 30 mins", value: 390 },
  { label: "7 hours", value: 420 },
  { label: "7 hours 30 mins", value: 450 },
  { label: "8 hours", value: 480 },
  { label: "8 hours 30 mins", value: 510 },
  { label: "9 hours", value: 540 },
  { label: "9 hours 30 mins", value: 570 },
  { label: "10 hours", value: 600 },
];

export const TIME_SLOTS = [
  "09:00 AM – 09:45 AM",
  "09:45 AM – 10:30 AM",
  "10:30 AM – 11:15 AM",
  "11:15 AM – 12:00 PM",
  "12:00 PM – 12:45 PM",
  "12:45 PM – 01:30 PM",
  "01:30 PM – 02:15 PM",
  "02:15 PM – 03:00 PM",
  "03:00 PM – 03:45 PM",
];
export const affiliateHospitals = [
  {
    id: "hosp-001",
    name: "Lagos State University Teaching Hospital",
    location: "Ikeja, Nigeria",
  },
  {
    id: "hosp-002",
    name: "University College Hospital",
    location: "Ibadan, Nigeria",
  },
  {
    id: "hosp-003",
    name: "Ahmadu Bello University Teaching Hospital",
    location: "Zaria, Nigeria",
  },
  {
    id: "hosp-004",
    name: "Federal Medical Centre",
    location: "Owerri, Nigeria",
  },
  {
    id: "hosp-005",
    name: "National Hospital Abuja",
    location: "Abuja, Nigeria",
  },
  {
    id: "hosp-006",
    name: "University of Port Harcourt Teaching Hospital",
    location: "Port Harcourt, Nigeria",
  },
  {
    id: "hosp-007",
    name: "Obafemi Awolowo University Teaching Hospital",
    location: "Ile-Ife, Nigeria",
  },
  {
    id: "hosp-008",
    name: "Delta State University Teaching Hospital",
    location: "Oghara, Nigeria",
  },
  {
    id: "hosp-009",
    name: "Benue State University Teaching Hospital",
    location: "Makurdi, Nigeria",
  },
  {
    id: "hosp-010",
    name: "Nnamdi Azikiwe University Teaching Hospital",
    location: "Nnewi, Nigeria",
  },
];

// export const appointmentData: TableAppointment[] = [
//   {
//     id: '1',
//     clientName: 'Hafsat Idris',
//     clientImage: DEFAULT_IMAGE_URL,
//     appointmentDate: new Date('2024-11-25T10:00:00'),
//     consultantName: 'Adanma Pepple',
//     consultantImage: DEFAULT_IMAGE_URL,
//     status: AppointmentStatus.Completed,
//     selected: false,
//   },
//   {
//     id: '2',
//     clientName: 'Hafsat Idris',
//     clientImage: DEFAULT_IMAGE_URL,
//     appointmentDate: new Date('2024-11-25T10:00:00'),
//     consultantName: 'Adanma Pepple',
//     consultantImage: DEFAULT_IMAGE_URL,
//     status: AppointmentStatus.Cancelled,
//     selected: false,
//   },
//   {
//     id: '3',
//     clientName: 'Hafsat Idris',
//     clientImage: DEFAULT_IMAGE_URL,
//     appointmentDate: new Date('2024-11-25T10:00:00'),
//     consultantName: 'Daniel James',
//     consultantImage: DEFAULT_IMAGE_URL,
//     status: AppointmentStatus.Completed,
//     selected: false,
//   },
//   {
//     id: '4',
//     clientName: 'Hafsat Idris',
//     clientImage: DEFAULT_IMAGE_URL,
//     appointmentDate: new Date('2024-12-15T14:30:00'),
//     consultantName: 'Daniel James',
//     consultantImage: DEFAULT_IMAGE_URL,
//     status: AppointmentStatus.Completed,
//     selected: false,
//   },
//   {
//     id: '5',
//     clientName: 'Hafsat Idris',
//     clientImage: DEFAULT_IMAGE_URL,
//     appointmentDate: new Date('2025-01-30T09:45:00'),
//     consultantName: 'Daniel James',
//     consultantImage: DEFAULT_IMAGE_URL,
//     status: AppointmentStatus.Completed,
//     selected: false,
//   },
// ];

export const caregiverAppointmentData = [
  // Demo data to match the image
  {
    id: 1,
    name: "Kelechi Onwudiwe",
    email: "kelechi@example.com",
    phone: "+234 903 532 0853",
    date: "Feb 25, 2025",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    location: "42 Bishop Oluwole Street, Victoria Island, Lagos",
    status: "Ongoing",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg",
    locationTag: { fill: "415", hue: "21" },
  },
  {
    id: 2,
    name: "Ezinne Agbasi",
    email: "ezinne@example.com",
    phone: "+234 816 538 1500",
    date: "Feb 25, 2025",
    startTime: "10:30 AM",
    endTime: "11:30 AM",
    location: "42 Bishop Oluwole Street, Victoria Island, Lagos",
    status: "",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg",
  },
  {
    id: 3,
    name: "Ekine Iwowari",
    email: "ekine@example.com",
    phone: "+234 912 643 5939",
    date: "Feb 25, 2025",
    startTime: "01:00 PM",
    endTime: "02:00 PM",
    location: "",
    isVirtual: true,
    status: "",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg",
  },
  {
    id: 4,
    name: "Diobu Dokubo",
    email: "diobu@example.com",
    phone: "+234 915 187 6329",
    date: "Feb 25, 2025",
    startTime: "03:00 PM",
    endTime: "05:00 PM",
    location: "42 Bishop Oluwole Street, Victoria Island, Lagos",
    status: "",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg",
  },
];

export const patientsData: Patient[] = [
  {
    id: "1",
    patientId: "#25PM312",
    name: "Diobu Dokubo",
    profileImage: DEFAULT_IMAGE_URL,
    gender: "Female",
    age: 64,
    selected: false,
  },
  {
    id: "2",
    patientId: "#25PM101",
    name: "Bolaji Adebayo",
    profileImage: DEFAULT_IMAGE_URL,
    gender: "Female",
    age: 64,
    selected: false,
  },
  {
    id: "3",
    patientId: "#25DT222",
    name: "Ezinne Agbasi",
    profileImage: DEFAULT_IMAGE_URL,
    gender: "Male",
    age: 64,
    selected: false,
  },
  {
    id: "4",
    patientId: "#24DT211",
    name: "Ekine Iwowari",
    profileImage: DEFAULT_IMAGE_URL,
    gender: "Female",
    age: 64,
    selected: false,
  },
  {
    id: "5",
    patientId: "#24PM109",
    name: "Daniel James",
    profileImage: DEFAULT_IMAGE_URL,
    gender: "Male",
    age: 64,
    selected: false,
  },
];

export const paymentsData: Payment[] = [
  {
    id: "1",
    amount: 300,
    date: new Date("2024-11-25"),
    description: "Bulk booking",
    status: "Completed",
    selected: false,
  },
  {
    id: "2",
    amount: 300,
    date: new Date("2024-11-25"),
    description: "Bulk booking",
    status: "Cancelled",
    selected: false,
  },
  {
    id: "3",
    amount: 300,
    date: new Date("2024-11-25"),
    description: "Bulk booking",
    status: "Completed",
    selected: false,
  },
  {
    id: "4",
    amount: 300,
    date: new Date("2024-12-15"),
    description: "Bulk booking",
    status: "Completed",
    selected: false,
  },
  {
    id: "5",
    amount: 300,
    date: new Date("2025-01-30"),
    description: "Bulk booking",
    status: "Completed",
    selected: false,
  },
];

export const caregiverScheduleData: CaregiverSchedule[] = [
  {
    id: "1",
    caregiverName: "Adanma Pepple",
    caregiverImage: DEFAULT_IMAGE_URL,
    startDate: new Date("2024-11-25"),
    endDate: new Date("2024-11-25T10:00:00"),
    selected: false,
  },
  {
    id: "2",
    caregiverName: "Adanma Pepple",
    caregiverImage: DEFAULT_IMAGE_URL,
    startDate: new Date("2024-11-25"),
    endDate: new Date("2024-11-25T10:00:00"),
    selected: false,
  },
  {
    id: "3",
    caregiverName: "Daniel James",
    caregiverImage: DEFAULT_IMAGE_URL,
    startDate: new Date("2024-11-25"),
    endDate: new Date("2024-11-25T10:00:00"),
    selected: false,
  },
  {
    id: "4",
    caregiverName: "Daniel James",
    caregiverImage: DEFAULT_IMAGE_URL,
    startDate: new Date("2024-12-15"),
    endDate: new Date("2024-12-15T14:30:00"),
    selected: false,
  },
  {
    id: "5",
    caregiverName: "Daniel James",
    caregiverImage: DEFAULT_IMAGE_URL,
    startDate: new Date("2025-01-30"),
    endDate: new Date("2025-01-30T09:45:00"),
    selected: false,
  },
];
export const medicalDocumentsData: MedicalDocument[] = [
  {
    id: "1",
    name: "PCR test.pdf",
    fileType: "pdf",
    date: new Date("2025-02-18T10:00:00"),
    selected: false,
  },
  {
    id: "2",
    name: "Cardio_test.doc",
    fileType: "doc",
    date: new Date("2025-02-05T10:00:00"),
    selected: false,
  },
  {
    id: "3",
    name: "Physiotherapy.pdf",
    fileType: "pdf",
    date: new Date("2025-01-15T10:00:00"),
    selected: false,
  },
  {
    id: "4",
    name: "Red blood cells count.pdf",
    fileType: "pdf",
    date: new Date("2025-01-12T21:30:00"),
    selected: false,
  },
  {
    id: "5",
    name: "Provision of information.doc",
    fileType: "doc",
    date: new Date("2025-01-10T09:45:00"),
    selected: false,
  },
];

// Sample data for conversations
export const conversations = [
  {
    id: 1,
    name: "Aileen McCoy",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744904805/a7a43fbe914a6e94b710e593d67989bf_ciwm02.png",
    lastMessage: "Hello, how are you today?",
    time: "10:30 AM",
    unread: true,
    online: true,
  },
  {
    id: 2,
    name: "Robert Fox",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744904805/a7a43fbe914a6e94b710e593d67989bf_ciwm02.png",
    lastMessage: "Will be there before 2PM",
    time: "10:00 AM",
    unread: false,
    online: false,
  },
  {
    id: 3,
    name: "Fill (245)",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744904805/a7a43fbe914a6e94b710e593d67989bf_ciwm02.png",
    lastMessage: "PO Mtg",
    time: "9:45 AM",
    unread: true,
    online: false,
  },
  {
    id: 4,
    name: "Blessing Bruce",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744904805/a7a43fbe914a6e94b710e593d67989bf_ciwm02.png",
    lastMessage: "Good idea! Let me check what we discussed",
    time: "9:30 AM",
    unread: true,
    online: false,
  },
  {
    id: 5,
    name: "Abidemi Gbenle",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744904805/a7a43fbe914a6e94b710e593d67989bf_ciwm02.png",
    lastMessage: "I am available to meet your customers",
    time: "9:00 AM",
    unread: false,
    online: false,
  },
  {
    id: 6,
    name: "Felicia Adams",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744904805/a7a43fbe914a6e94b710e593d67989bf_ciwm02.png",
    lastMessage: "I already sent tomorrow's report. Let me",
    time: "8:45 AM",
    unread: true,
    online: false,
  },
  {
    id: 7,
    name: "Ashley Alder",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744904805/a7a43fbe914a6e94b710e593d67989bf_ciwm02.png",
    lastMessage: "Conference call tomorrow",
    time: "8:40 AM",
    unread: false,
    online: false,
  },
  {
    id: 8,
    name: "McCoy Team",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744904805/a7a43fbe914a6e94b710e593d67989bf_ciwm02.png",
    lastMessage: "Let's plan for following...",
    time: "8:30 AM",
    unread: false,
    online: false,
  },
  {
    id: 9,
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744904805/a7a43fbe914a6e94b710e593d67989bf_ciwm02.png",
    name: "Aileen McCoy",
    lastMessage: "Files for your future work",
    time: "8:15 AM",
    unread: true,
    online: true,
  },
  {
    id: 10,
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744904805/a7a43fbe914a6e94b710e593d67989bf_ciwm02.png",
    name: "Aileen McCoy",
    lastMessage: "Files for your future work",
    time: "8:00 AM",
    unread: true,
    online: true,
  },
];

// Sample message thread data
export const messageThread = [
  {
    id: 1,
    sender: "Aileen McCoy",
    message: "Hello, nice visitor. How are you feeling today?",
    time: "10:30 AM",
    isUserMessage: false,
  },
  {
    id: 2,
    sender: "Aileen McCoy",
    message: "Will be there before 2PM",
    time: "10:32 AM",
    isUserMessage: false,
  },
  {
    id: 3,
    sender: "You",
    message:
      "Hey 👋 Aileen McCoy, I'm feeling much better today, thanks for checking in.",
    time: "10:41 AM",
    isUserMessage: true,
  },
  {
    id: 4,
    sender: "You",
    message: "Okay no problem, we'll be waiting for you.",
    time: "10:42 AM",
    isUserMessage: true,
  },
  {
    id: 5,
    sender: "Aileen McCoy",
    message: "Would you like me to pick up anything for on my way?",
    time: "10:45 AM",
    isUserMessage: false,
  },
  {
    id: 6,
    sender: "You",
    message:
      "That's kind of you! If you don't mind, could you grab orange for me? Thank you!",
    time: "10:47 AM",
    isUserMessage: true,
  },
  {
    id: 7,
    sender: "Aileen McCoy",
    message: "Of course! I'll pick that up for you.",
    time: "10:50 AM",
    isUserMessage: false,
  },
  {
    id: 8,
    sender: "Aileen McCoy",
    message: "Of course! I'll pick that up for you.",
    time: "10:50 AM",
    isUserMessage: false,
  },
];
export const patientData = [
  {
    id: 1,
    name: "Ezinne Agbasi",
    phone: "+234 912 643 5939",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg",
  },
  {
    id: 2,
    name: "Ekine Iwowari",
    phone: "+234 707 945 8392",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg",
  },
  {
    id: 3,
    name: "Diobu Dokubo",
    phone: "+234 707 798 5690",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg",
  },
  {
    id: 4,
    name: "Bolaji Adebayo",
    phone: "+234 915 187 6329",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg",
  },
  {
    id: 5,
    name: "Kuroebi Obubra",
    phone: "+234 803 333 3476",
    avatar:
      "https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg",
  },
];
export const chatMessagesData = [
  {
    id: 1,
    sender: {
      name: "Kelechi Onwudiwe",
      avatar:
        "https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg",
    },
    message: "Will be there before 4PM",
    timestamp: "04:03 AM",
    tags: [
      { label: "49 Hub", color: "blue" },
      { label: "21 Hub", color: "blue" },
    ],
    unread: true,
  },
  {
    id: 2,
    sender: {
      name: "Robert Fox",
      avatar:
        "https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg",
    },
    message: "Alcohol based exposures through inadvertently cons...",
    timestamp: "04:03 AM",
    unread: false,
  },
  {
    id: 3,
    sender: {
      name: "Dr. Nneka Anozie",
      avatar:
        "https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg",
    },
    message: "Even factoring differences in body weight between chil...",
    timestamp: "04:03 AM",
    unread: false,
  },
  {
    id: 4,
    sender: {
      name: "Adeola Akinyemi",
      avatar:
        "https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg",
    },
    message: "Even factoring differences in body weight between chil...",
    timestamp: "04:03 AM",
    unread: false,
  },
  {
    id: 5,
    sender: {
      name: "Ogechi Obi",
      avatar:
        "https://res.cloudinary.com/davidleo/image/upload/v1744896654/aa876a7a2f9aac97c39f34649357f02b_eqqhqh.jpg",
    },
    message: "Even factoring differences in body weight between chil...",
    timestamp: "04:03 AM",
    unread: false,
  },
];

export const healthRecords: HealthRecord[] = [
  {
    id: 101,
    patient_id: 1,
    appointment_id: 201,
    title: "Admission for acute chest pain",
    record_type: "diagnosis",
    description:
      "Patient admitted with acute chest pain and shortness of breath. Initial workup ordered.",
    status: "pending",
    created_by_role: "caregiver",
    created_by_id: 301,
    created_by_name: "Nurse Joy",

    reports: [
      {
        id: 1001,
        health_record_id: 101,
        report_type: "lab_report",
        title: "CBC & Metabolic Panel",
        content: JSON.stringify({
          tests: ["CBC", "BMP"],
          summary: { wbc: "8.2", hemoglobin: "13.1", sodium: "138" },
        }),
        findings: "No leukocytosis. Electrolytes within normal limits.",
        recommendations: "Repeat BMP in 24 hours. Monitor electrolytes.",
        attachments: [
          {
            id: 9001,
            report_id: 1001,
            file_name: "cbc_bmp_2025-02-20.pdf",
            file_url: "https://example.com/files/cbc_bmp_2025-02-20.pdf",
            file_type: "pdf",
            file_size: 142_560,
            uploaded_at: "2025-02-20T09:15:00Z",
          },
        ],
        created_by_id: 301,
        created_by_name: "Nurse Joy",
        created_by_role: "caregiver",
        created_at: "2025-02-20T09:10:00Z",
        updated_at: "2025-02-20T09:15:00Z",
      },
      {
        id: 1002,
        health_record_id: 101,
        report_type: "imaging_report",
        title: "Portable Chest X-Ray",
        content:
          "Cardiomediastinal silhouette unchanged. No focal consolidation or effusion.",
        findings:
          "No acute cardiopulmonary disease identified on portable film.",
        recommendations:
          "Correlate with clinical exam. Consider CT angiography if PE suspected.",
        attachments: [
          {
            id: 9002,
            report_id: 1002,
            file_name: "cxr_2025-02-20.jpg",
            file_url: "https://example.com/images/cxr_2025-02-20.jpg",
            file_type: "jpg",
            file_size: 512_000,
            uploaded_at: "2025-02-20T09:30:00Z",
          },
        ],
        created_by_id: 401,
        created_by_name: "Dr. Sam Okoro",
        created_by_role: "admin",
        created_at: "2025-02-20T09:28:00Z",
        updated_at: "2025-02-20T09:30:00Z",
      },
    ],

    notes: [
      {
        id: 5001,
        health_record_id: 101,
        note_type: "caregiver_note",
        content:
          "Patient reports pain level 6/10. Oxygen sat 95% on room air. Monitoring closely.",
        created_by_id: 301,
        created_by_name: "Nurse Joy",
        created_by_role: "caregiver",
        created_at: "2025-02-20T09:05:00Z",
        updated_at: "2025-02-20T09:05:00Z",
      },
    ],

    health_tracker_ids: [10, 11],
    created_at: "2025-02-20T09:02:00Z",
    updated_at: "2025-02-20T09:30:00Z",
  },

  {
    id: 102,
    patient_id: 2,
    appointment_id: 202,
    title: "Post-operative discharge summary — laparoscopic cholecystectomy",
    record_type: "discharge_summary",
    description:
      "Routine laparoscopic cholecystectomy. Uneventful intra-op. Discharged with analgesia and follow-up plan.",
    status: "approved",
    created_by_role: "admin",
    created_by_id: 2,
    created_by_name: "Admin User",

    reports: [
      {
        id: 1003,
        health_record_id: 102,
        report_type: "procedure_report",
        title: "Laparoscopic Cholecystectomy Operative Note",
        content:
          "Procedure performed under general anesthesia. No intraoperative complications. Estimated blood loss minimal.",
        findings: "Acute cholecystitis confirmed on inspection.",
        recommendations: "Standard post-op care. Follow-up in 2 weeks.",
        attachments: [
          {
            id: 9003,
            report_id: 1003,
            file_name: "op_note_2025-01-15.pdf",
            file_url: "https://example.com/files/op_note_2025-01-15.pdf",
            file_type: "pdf",
            file_size: 235_000,
            uploaded_at: "2025-01-15T14:00:00Z",
          },
        ],
        created_by_id: 402,
        created_by_name: "Dr. Ada Eze",
        created_by_role: "admin",
        created_at: "2025-01-15T13:50:00Z",
        updated_at: "2025-01-15T14:00:00Z",
      },
      {
        id: 1004,
        health_record_id: 102,
        report_type: "prescription",
        title: "Discharge Medications",
        content: JSON.stringify({
          medications: [
            {
              name: "Amoxicillin-clavulanate",
              dose: "625mg",
              freq: "TID",
              duration: "5 days",
            },
            {
              name: "Paracetamol",
              dose: "500mg",
              freq: "Q6H PRN",
              duration: "7 days",
            },
          ],
        }),
        findings: "",
        recommendations:
          "Adhere to medication schedule. Return for fever/persistent pain.",
        attachments: [],
        created_by_id: 402,
        created_by_name: "Dr. Ada Eze",
        created_by_role: "admin",
        created_at: "2025-01-15T14:05:00Z",
        updated_at: "2025-01-15T14:05:00Z",
      },
    ],

    notes: [
      {
        id: 5002,
        health_record_id: 102,
        note_type: "admin_note",
        content:
          "Patient educated on wound care and activity restrictions. Contact number provided for concerns.",
        created_by_id: 2,
        created_by_name: "Admin User",
        created_by_role: "admin",
        created_at: "2025-01-15T14:10:00Z",
        updated_at: "2025-01-15T14:10:00Z",
      },
    ],

    health_tracker_ids: [20],
    approved_at: "2025-01-15T15:00:00Z",
    approved_by_id: 402,
    approved_by_name: "Dr. Ada Eze",
    created_at: "2025-01-15T13:45:00Z",
    updated_at: "2025-01-15T15:00:00Z",
  },

  {
    id: 103,
    patient_id: 3,
    appointment_id: 203,
    title: "Medication review — antihypertensive regimen",
    record_type: "prescription",
    description:
      "Review of current antihypertensive medications. Dose clarification required.",
    status: "rejected",
    created_by_role: "caregiver",
    created_by_id: 303,
    created_by_name: "Caregiver Tom",

    reports: [
      {
        id: 1005,
        health_record_id: 103,
        report_type: "prescription",
        title: "Proposed Medication Changes",
        content: JSON.stringify({
          proposed: [
            { drug: "Amlodipine", old_dose: "5mg", new_dose: "10mg" },
            { drug: "Lisinopril", old_dose: "10mg", new_dose: "10mg" },
          ],
        }),
        findings: "Home BP readings average 150/95 mmHg.",
        recommendations:
          "Increase amlodipine to 10mg and re-evaluate in 2 weeks.",
        attachments: [
          {
            id: 9004,
            report_id: 1005,
            file_name: "bp_log_jan2025.csv",
            file_url: "https://example.com/files/bp_log_jan2025.csv",
            file_type: "csv",
            file_size: 12_480,
            uploaded_at: "2025-02-01T08:00:00Z",
          },
        ],
        created_by_id: 303,
        created_by_name: "Caregiver Tom",
        created_by_role: "caregiver",
        created_at: "2025-02-01T08:05:00Z",
        updated_at: "2025-02-01T08:05:00Z",
      },
    ],

    notes: [
      {
        id: 5003,
        health_record_id: 103,
        note_type: "caregiver_note",
        content:
          "Patient reports dizziness when standing after last dose. Suggested dose clarification before change.",
        created_by_id: 303,
        created_by_name: "Caregiver Tom",
        created_by_role: "caregiver",
        created_at: "2025-02-01T08:02:00Z",
        updated_at: "2025-02-01T08:02:00Z",
      },
    ],

    health_tracker_ids: [30, 31],
    rejection_reason:
      "Incomplete dosage instructions and no clinician sign-off.",
    created_at: "2025-02-01T08:00:00Z",
    updated_at: "2025-02-01T08:10:00Z",
  },
];
