import React from "react";

import { getCaregiverPatientHistory } from "@/app/actions/caregiver-patient.actions";
import { getCaregiverAppointments } from "@/app/actions/services/appointment.actions";
import {
  fetchConversations,
  fetchMessages,
} from "@/app/actions/services/chats.actions";
import { getSession } from "@/app/actions/session.actions";
import CaregiverMainDashboardClient from "@/components/pages/caregiver-main-dashboard";
import { formatDate } from "@/lib/utils";
export const dynamic = "force-dynamic";

export default async function CaregiverMainDashboard() {
  const session = await getSession();

  const appointments = await getCaregiverAppointments();
  const patients = await getCaregiverPatientHistory();
  const { conversations } = await fetchConversations();
  const getSenderName = (id: string) => {
    const match = conversations.find((c) => String(c.id) === id);
    if (!match) {
      console.warn(`No match found for sender ID: ${id}`);
    }
    return match?.name || `User ${id}`;
  };

  const rawMessages = await fetchMessages(String(session.user_id));
  console.log("Fetched Raw Messages:", rawMessages.messages);

  const userMessages = rawMessages.messages
    .filter((msg) => {
      const isReceiver = String(msg.receiverId) === String(session.user_id);
      if (isReceiver) {
        console.log("Message received by user:", msg);
      }
      return isReceiver;
    })
    .reverse()
    .map((msg) => {
      const formatted = {
        id: msg.id,
        avatar: "/asset/images/robert.jpg",
        name: getSenderName(msg.senderId),
        message: msg.message,
        timestamp: formatDate(new Date(msg.timestamp)),
        unreadCount: msg.isRead ? 0 : 1,
      };
      console.log("Mapped Message:", formatted);
      return formatted;
    });

  return (
    // Option 2: Inline with type assertion
    <CaregiverMainDashboardClient
      messages={userMessages}
      appointments={
        Array.isArray(appointments?.appointments)
          ? appointments.appointments
          : appointments?.appointments?.data || []
      }
      allPatients={
        Array.isArray(patients.patients)
          ? patients.patients
          : patients.patients.data || []
      }
    />
  );
}
