import React from "react";

import { getUserAppointments } from "@/app/actions/services/appointment.actions";
import { getCaregiverHistory } from "@/app/actions/services/caregiver.actions";
import { fetchConversations, fetchMessages } from "@/app/actions/services/chats.actions";
import { getLastTrackers } from "@/app/actions/services/health.tracker.actions";
import { getSession } from "@/app/actions/session.actions";
import { MainUserDashboard } from "@/components/pages/main-user-dashboard";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function UserDashboard() {
  const appointments = await getUserAppointments();
  const mainAppointments = appointments.appointments.data;

  const trackers = await getLastTrackers();
  const userCaregivers = await getCaregiverHistory();
  const session = await getSession();

  const { conversations } = await fetchConversations();
  console.log("Fetched Conversations:", conversations);
  
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
    <MainUserDashboard
      appointments={mainAppointments}
      healthTrackers={trackers.health_tracker}
      caregivers={userCaregivers.caregivers?.data || []}
      messages={userMessages}
    />
  );
}
