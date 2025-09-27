import React from "react";

import { getUserPaymentNotifications } from "@/app/actions/payment.actions";
import { getUserAppointments } from "@/app/actions/services/appointment.actions";
import { getCaregiverHistory } from "@/app/actions/services/caregiver.actions";
import {
  fetchConversations,
  fetchMessages,
} from "@/app/actions/services/chats.actions";
import { getLastTrackers } from "@/app/actions/services/health.tracker.actions";
import { getSession } from "@/app/actions/session.actions";
import { MainUserDashboard } from "@/components/pages/main-user-dashboard";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function UserDashboard() {
  const appointments = await getUserAppointments();
  const mainAppointments = appointments.appointments.data;

  const paymentNotifications = await getUserPaymentNotifications();
  const trackers = await getLastTrackers();
  const userCaregivers = await getCaregiverHistory();
  const session = await getSession();

  console.log("APPOINTMENTS", mainAppointments);
  const { conversations } = await fetchConversations();

  const getSenderName = (id: string) => {
    const match = conversations.find((c) => String(c.id) === id);
    if (!match) {
      console.warn(`No match found for sender ID: ${id}`);
    }
    return match?.name || `User ${id}`;
  };

  const rawMessages = await fetchMessages(String(session.user_id));

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
      payment_notification={paymentNotifications.payment_notifications || []}
      appointments={mainAppointments}
      healthTrackers={trackers.health_tracker}
      caregivers={userCaregivers.caregivers?.data || []}
      messages={userMessages}
    />
  );
}
