import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { twMerge } from "tailwind-merge";

import { AppointmentStatus } from "@/components/table/columns/appointment-columns";
import { Appointment, User } from "@/types";

dayjs.extend(customParseFormat);

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
  // let hours = dateObj.getHours();
  // const ampm = hours >= 12 ? "PM" : "AM";
  // hours = hours % 12;
  // hours = hours || 12; // Convert 0 to 12

  // Format minutes with leading zero
  // const minutes = dateObj.getMinutes().toString().padStart(2, "0");

  // Combine all parts
  return `${day} ${month}, ${year}`;
};
export const revertFormattedDate = (formattedDate: string) => {
  try {
    // Parse the formatted date "19 Aug, 2025"
    const parsed = dayjs(formattedDate, "DD MMM, YYYY");

    if (!parsed.isValid()) {
      console.error("Invalid date format:", formattedDate);
      return null;
    }

    return {
      // Standard formats
      iso: parsed.format("YYYY-MM-DD"), // "2025-08-19"
      standard: parsed.format("YYYY-MM-DD HH:mm:ss"), // "2025-08-19 00:00:00"
      jsDate: parsed.toDate(), // JavaScript Date object
      timestamp: parsed.valueOf(), // Unix timestamp in milliseconds

      // Alternative formats
      american: parsed.format("MM/DD/YYYY"), // "08/19/2025"
      european: parsed.format("DD/MM/YYYY"), // "19/08/2025"
      readable: parsed.format("MMMM D, YYYY"), // "August 19, 2025"
      short: parsed.format("MMM D, YYYY"), // "Aug 19, 2025"

      // With time (if you need to add specific time)
      withTime: (timeString: string) => {
        // Example: addTimeToDate("19 Aug, 2025", "02:15 PM")
        const timePattern = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
        const match = timeString.match(timePattern);

        if (match) {
          const [, hour, minute, period] = match;
          const hour24 =
            period.toLowerCase() === "pm" && parseInt(hour) !== 12
              ? parseInt(hour) + 12
              : period.toLowerCase() === "am" && parseInt(hour) === 12
                ? 0
                : parseInt(hour);

          return parsed.hour(hour24).minute(parseInt(minute)).second(0);
        }

        return parsed;
      },
    };
  } catch (error) {
    console.error("Error parsing date:", formattedDate, error);
    return null;
  }
};
export const formatDateToJSDate = (formattedDate: string): Date | null => {
  const result = revertFormattedDate(formattedDate);
  return result ? result.jsDate : null;
};
export const parseAppointmentTimeToDateTime = (
  date: string,
  timeRange: string
) => {
  try {
    // Parse the date part (e.g., "28 Aug, 2025")
    const appointmentDate = dayjs(date, "DD MMM, YYYY");

    if (!appointmentDate.isValid()) {
      console.error("Invalid date:", date);
      return { start: null, end: null };
    }

    // Parse the time range (e.g., "02:15 PM – 03:00 PM")
    const timePattern =
      /(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i;
    const match = timeRange.match(timePattern);

    if (!match) {
      console.error("Invalid time format:", timeRange);
      return { start: null, end: null };
    }

    const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] =
      match;

    // Convert to 24-hour format
    const start24Hour = convertTo24Hour(
      parseInt(startHour),
      startPeriod.toUpperCase()
    );
    const end24Hour = convertTo24Hour(
      parseInt(endHour),
      endPeriod.toUpperCase()
    );

    // Create start and end datetime objects
    const startDateTime = appointmentDate
      .hour(start24Hour)
      .minute(parseInt(startMin))
      .second(0);

    const endDateTime = appointmentDate
      .hour(end24Hour)
      .minute(parseInt(endMin))
      .second(0);

    return {
      start: startDateTime.toDate(),
      end: endDateTime.toDate(),
    };
  } catch (error) {
    console.error("Error parsing appointment time:", error);
    return { start: null, end: null };
  }
};

// Helper function to convert 12-hour to 24-hour format
export const convertTo24Hour = (hour: number, period: string): number => {
  if (period === "AM") {
    return hour === 12 ? 0 : hour;
  } else {
    return hour === 12 ? 12 : hour + 12;
  }
};
// Example usage:
// const dateStr = "19 Aug, 2025 1:00AM";
// const parsedDate = parseAppointmentDate(dateStr);
// console.log(parsedDate); // Returns a Date object or null if inval
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
// Function to combine date and time into full datetime
export const combineDateAndTime = (
  dateString: string,
  timeString: string
): Date | null => {
  try {
    // Parse the date
    const date = dayjs(dateString, "DD MMM, YYYY");

    if (!date.isValid()) {
      console.error("Invalid date:", dateString);
      return null;
    }

    // Parse the time (e.g., "02:15 PM")
    const timePattern = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
    const match = timeString.match(timePattern);

    if (!match) {
      console.error("Invalid time format:", timeString);
      return null;
    }

    const [, hour, minute, period] = match;

    // Convert to 24-hour format
    let hour24 = parseInt(hour);
    if (period.toLowerCase() === "pm" && hour24 !== 12) {
      hour24 += 12;
    } else if (period.toLowerCase() === "am" && hour24 === 12) {
      hour24 = 0;
    }

    // Combine date and time
    return date.hour(hour24).minute(parseInt(minute)).second(0).toDate();
  } catch (error) {
    console.error("Error combining date and time:", error);
    return null;
  }
};
export const initialsFromName = (name?: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0][0] ?? "";
  const second = parts[1][0] ?? parts[0][1] ?? "";
  return (first + second).toUpperCase();
};
