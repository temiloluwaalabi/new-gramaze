import React from "react";

import { getUserAppointments } from "@/app/actions/services/appointment.actions";
import { getCaregiverHistory } from "@/app/actions/services/caregiver.actions";
import { fetchMessages } from "@/app/actions/services/chats.actions";
import { getLastTrackers } from "@/app/actions/services/health.tracker.actions";
import { getSession } from "@/app/actions/session.actions";
import { MainUserDashboard } from "@/components/pages/main-user-dashboard";
// This tells Next.js: "Don't try to pre-render this page at build time"
export const dynamic = "force-dynamic";
export default async function UserDashboard() {
 
  const appointments = await getUserAppointments();
  const mainAppointments = appointments.appointments.data;
  const trackers = await getLastTrackers();
  const userCaregivers = await getCaregiverHistory();
  const session = await getSession();
  // const userMessages = await fetchMessages(session.user_id);

  return (
    <MainUserDashboard
      appointments={mainAppointments}
      healthTrackers={trackers.health_tracker}
      caregivers={userCaregivers.caregivers?.data || []} messages={[]}      // messages={userMessages.messages}
    />
  );
}
