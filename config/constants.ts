import { CaregiverSchedule, MedicalDocument, Patient, Payment } from "@/types";
const DEFAULT_IMAGE_URL =
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
