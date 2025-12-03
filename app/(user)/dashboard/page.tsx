import React from "react";

import { getUserPaymentNotifications } from "@/app/actions/payment.actions";
import { getUserAppointments } from "@/app/actions/services/appointment.actions";
import { getCaregiverHistory } from "@/app/actions/services/caregiver.actions";
import { getLastTrackers } from "@/app/actions/services/health.tracker.actions";
import { getConversations } from "@/app/actions/services/messages.actions";
import { MainUserDashboard } from "@/components/pages/main-user-dashboard";

export const dynamic = "force-dynamic";

export default async function UserDashboard() {
  const [
    appointments,
    paymentNotifications,
    trackers,
    userCaregivers,
    conversations,
  ] = await Promise.all([
    getUserAppointments(),
    getUserPaymentNotifications(),
    getLastTrackers(),
    getCaregiverHistory(),
    getConversations(),
  ]);

  return (
    <MainUserDashboard
      payment_notification={paymentNotifications.payment_notifications || []}
      appointments={appointments.appointments.data}
      healthTrackers={trackers.tracker}
      caregivers={userCaregivers.caregivers?.data || []}
      messages={conversations.data || []}
    />
  );
}
