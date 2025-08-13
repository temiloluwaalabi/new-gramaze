import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { AppointmentStatus } from "@/components/table/columns/appointment-columns";
import { Appointment, User } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date in the format: "25 Nov, 2024 10:00AM"
 * @param date - Date object or string representing the date to format
 * @returns A formatted date string
 */
export function removeS(page: string): string {
  // Check if the string contains "s"
  if (page.charAt(page.length - 1) === "s") {
    // Remove the last character
    return page.slice(0, -1);
  } else {
    // If "s" is not found, return the original string
    return page;
  }
}
export const formatAppointmentDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  // Month names
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get components
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  // Format hours for 12-hour clock with AM/PM
  let hours = dateObj.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours || 12; // Convert 0 to 12

  // Format minutes with leading zero
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");

  // Combine all parts
  return `${day} ${month}, ${year} ${hours}:${minutes}${ampm}`;
};

// Utility function for date formatting
export const formatDate = (
  date: Date | string,
  includeTime: boolean = false
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  let formattedDate = `${day} ${month}, ${year}`;

  if (includeTime) {
    let hours = dateObj.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours || 12;
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    formattedDate += ` ${hours}:${minutes}${ampm}`;
  }

  return formattedDate;
};
// Helper function to generate avatar URL (you can customize this)
export const generateAvatarUrl = (user: User): string => {
  // Option 1: Use a service like Gravatar
  // return `https://www.gravatar.com/avatar/${md5(user.email.toLowerCase())}?d=identicon`;

  // Option 2: Use initials-based avatar service
  const initials =
    `${user.first_name[0] || ""}${user.last_name[0] || ""}`.toUpperCase();
  return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;

  // Option 3: Return default avatar
  // return '/default-avatar.png';
};
// Helper function to create appointment end time (assuming 1 hour duration)
export const createAppointmentEndTime = (date: string, time: string): Date => {
  const startDateTime = new Date(`${date}T${time}`);
  const endDateTime = new Date(startDateTime);
  endDateTime.setHours(endDateTime.getHours() + 1); // Add 1 hour
  return endDateTime;
};

// Helper function to determine appointment status
export const determineAppointmentStatus = (
  appointment: Appointment
): AppointmentStatus => {
  const appointmentDateTime = new Date(
    `${appointment.date}T${appointment.time}`
  );
  const now = new Date();

  // You can modify this logic based on your business rules
  if (appointment.mark_as_arrived === true) {
    return AppointmentStatus.Completed;
  }

  // If appointment is in the past and not marked as arrived, consider it cancelled
  if (appointmentDateTime < now && !appointment.mark_as_arrived) {
    return AppointmentStatus.Cancelled;
  }

  // Future appointments are pending
  return AppointmentStatus.Pending;
};

// Helper function to get full name from user
export const getFullName = (user: User): string => {
  return `${user.first_name} ${user.last_name}`.trim();
};

export function transformAppointmentData(
  apiData: Appointment[]
): Appointment[] {
  return apiData.map((appointment) => {
    const [startTime, endTime] = appointment.time.includes("–")
      ? appointment.time.split(" – ")
      : [appointment.time, ""];

    return {
      ...appointment,
      name: appointment.patient
        ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
        : "Unknown Patient",
      phone: appointment.contact || "",
      avatar: "/default-avatar.png", // Provide default avatar
      startTime,
      endTime,
      isVirtual: appointment.appointment_type === "virtual",
    };
  });
}
export // Get appointment location based on type
const getAppointmentLocation = (appointment: Appointment) => {
  if (appointment.appointment_type === "virtual") {
    return appointment.location || "Online";
  } else if (appointment.visit_type === "hospital") {
    return appointment.hospital_address || "Hospital";
  } else if (appointment.visit_type === "home") {
    return appointment.home_address || "Patient's Home";
  }
  return "Location TBD";
};
export const getAppointmentTitle = (appointment: Appointment) => {
  if (appointment.appointment_type === "virtual") {
    return "Virtual appointment";
  } else if (appointment.visit_type === "hospital") {
    return "Hospital appointment";
  } else if (appointment.visit_type === "home") {
    return "At-home appointment";
  }
  return "Appointment";
};
