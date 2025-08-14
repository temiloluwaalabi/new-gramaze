import React from "react";

import { getCaregiverAppointments } from "@/app/actions/services/appointment.actions";
import CaregiverAppointmentClientPage from "@/components/pages/caregiver-appointment-page";
export const dynamic = "force-dynamic";

export default async function CaregiverAppointmentDashboard() {
  const appointments = await getCaregiverAppointments();

  return (
    <CaregiverAppointmentClientPage
      appointments={
        Array.isArray(appointments?.appointments)
          ? appointments.appointments
          : appointments?.appointments?.data || []
      }
    />
  );
}
