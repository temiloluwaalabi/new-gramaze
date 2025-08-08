// Transform enriched appointment to table appointment

import { TableAppointment } from "@/components/table/columns/appointment-columns";
import {
  createAppointmentEndTime,
  determineAppointmentStatus,
  formatAppointmentDate,
  generateAvatarUrl,
  getFullName,
} from "@/lib/utils";
import { User } from "@/types";

import { CalendarEvent, EnrichedAppointment } from "./day-js-calendar";

export const transformToTableAppointment = (
  enrichedAppointment: EnrichedAppointment
): TableAppointment => {
  console.log("EnrichedAppointment", enrichedAppointment);
  const clientName = enrichedAppointment.client
    ? getFullName(enrichedAppointment.client)
    : `Client ${enrichedAppointment.user_id}`;

  const clientImage = enrichedAppointment.client
    ? generateAvatarUrl(enrichedAppointment.client)
    : "/default-avatar.png";

  const consultantName = enrichedAppointment.caregiverDetails
    ? getFullName(enrichedAppointment.caregiverDetails)
    : `${enrichedAppointment.caregiver?.first_name} ${enrichedAppointment.caregiver?.last_name}` ||
      "Unassigned";

  const consultantImage = enrichedAppointment.caregiverDetails
    ? generateAvatarUrl(enrichedAppointment.caregiverDetails)
    : "/default-consultant-avatar.png";

  return {
    id: enrichedAppointment.id.toString(),
    clientName,
    clientImage,
    appointmentDate: formatAppointmentDate(enrichedAppointment.date),
    consultantName,
    appointmentTime: enrichedAppointment.time,
    consultantImage,
    status: determineAppointmentStatus(enrichedAppointment),
    selected: false,
  };
};
// Transform enriched appointment to calendar event
export const transformToCalendarEvent = (
  enrichedAppointment: EnrichedAppointment
): CalendarEvent => {
  const clientName = enrichedAppointment.client
    ? getFullName(enrichedAppointment.client)
    : `Client ${enrichedAppointment.user_id}`;

  const consultantName = enrichedAppointment.caregiverDetails
    ? getFullName(enrichedAppointment.caregiverDetails)
    : `${enrichedAppointment.caregiver?.first_name} ${enrichedAppointment.caregiver?.last_name}` ||
      "Unassigned";

  const attendees = [];

  if (enrichedAppointment.client) {
    attendees.push({
      name: clientName,
      avatar: generateAvatarUrl(enrichedAppointment.client),
    });
  }

  if (enrichedAppointment.caregiverDetails) {
    attendees.push({
      name: consultantName,
      avatar: generateAvatarUrl(enrichedAppointment.caregiverDetails),
    });
  }

  return {
    id: enrichedAppointment.id.toString(),
    title: `${clientName} - ${enrichedAppointment.appointment_type}`,
    start: new Date(`${enrichedAppointment.date}T${enrichedAppointment.time}`),
    end: createAppointmentEndTime(
      enrichedAppointment.date,
      enrichedAppointment.time
    ),
    attendees,
    caregiver: enrichedAppointment.caregiverDetails as User,
  };
};
// Transform array of enriched appointments to table appointments
export const transformEnrichedAppointmentsForTable = (
  enrichedAppointments: EnrichedAppointment[]
): TableAppointment[] => {
  return enrichedAppointments.map(transformToTableAppointment);
};

// Transform array of enriched appointments to calendar events
export const transformEnrichedAppointmentsForCalendar = (
  enrichedAppointments: EnrichedAppointment[]
): CalendarEvent[] => {
  return enrichedAppointments.map(transformToCalendarEvent);
};
