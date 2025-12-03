import React from "react";

import { getCaregiverPatientHistory } from "@/app/actions/caregiver-patient.actions";
import { getCaregiverAppointments } from "@/app/actions/services/appointment.actions";
import { getConversations } from "@/app/actions/services/messages.actions";
import CaregiverMainDashboardClient from "@/components/pages/caregiver-main-dashboard";
export const dynamic = "force-dynamic";

export default async function CaregiverMainDashboard() {
  const [appointments, patients, conversations] = await Promise.all([
    getCaregiverAppointments(),
    getCaregiverPatientHistory(),
    getConversations(),
  ]);

  return (
    <CaregiverMainDashboardClient
      messages={conversations.data || []}
      appointments={
        Array.isArray(appointments?.appointments)
          ? appointments.appointments
          : appointments?.appointments?.data.filter((app) => app.patient) || []
      }
      allPatients={
        patients?.success && Array.isArray(patients.data) ? patients.data : []
      }
    />
  );
}
