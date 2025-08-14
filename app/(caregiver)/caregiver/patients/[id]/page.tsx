import { notFound } from "next/navigation";
import React from "react";

import { getAppointmentByUser } from "@/app/actions/appointment.actions";
import { getPatientHistoryDetails } from "@/app/actions/services/caregiver.actions";
import { getSession } from "@/app/actions/session.actions";
import SinglePatientDetailsPage from "@/components/pages/single-patient-details-page";

export default async function CaregiverPatientDash({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const session = await getSession();
  const id = (await params).id;

  const patient = await getPatientHistoryDetails(id.toString());
  const patientAppointments = await getAppointmentByUser({
    user_id: id,
  });

  console.log("patient-appointment", patientAppointments);

  if (!patient.data?.patient) {
    return notFound();
  }

  // Filter and process appointments for this caregiver
  const caregiverAppointments = Array.isArray(patientAppointments.data)
    ? patientAppointments.data.filter(
        (appointment) =>
          appointment.caregiver_id.toString() === session.user_id.toString()
      )
    : [];

  // Get upcoming appointments only and sort by date (ascending)
  const currentDate = new Date();
  const upcomingAppointments = caregiverAppointments
    .filter((appointment) => {
      // Assuming appointment has a date field - adjust the field name as needed
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= currentDate;
    })
    .sort((a, b) => {
      // Sort in ascending order (earliest first)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <SinglePatientDetailsPage
      patient={patient.data?.patient}
      appointments={upcomingAppointments}
    />
  );
}
