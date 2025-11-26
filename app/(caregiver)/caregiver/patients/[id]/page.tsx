import { notFound } from "next/navigation";
import React from "react";

import { getAppointmentByUser } from "@/app/actions/appointment.actions";
import {
  getPatientHealthNotes,
  getPatientHealthReports,
} from "@/app/actions/caregiver-patient.actions";
import {
  getHealthRecordsByUserId,
  getPatientHistoryDetails,
} from "@/app/actions/services/caregiver.actions";
import { getAllHealthMetrics } from "@/app/actions/services/health.tracker.actions";
import { getSession } from "@/app/actions/session.actions";
import SinglePatientDetailsPage from "@/components/pages/single-patient-details-page";

export default async function CaregiverPatientDash({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const session = await getSession();
  const id = (await params).id;

  const [
    patient,
    patientRecords,
    patientReport,
    patientNotes,
    patientAppointments,
    metrics,
  ] = await Promise.all([
    getPatientHistoryDetails(id.toString()),
    getHealthRecordsByUserId(id.toString()),
    getPatientHealthReports(id.toString()),
    getPatientHealthNotes(id.toString()),
    getAppointmentByUser({
      user_id: id,
    }),
    getAllHealthMetrics(),
  ]);
  if (!patient.data?.patient) {
    return notFound();
  }
  const caregiverAppointments = Array.isArray(patientAppointments.data)
    ? patientAppointments.data.filter(
        (appointment) =>
          appointment.caregiver_id?.toString() === session.user_id.toString()
      )
    : [];
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
      metrics={metrics.metrics || []}
      patient={patient.data?.patient}
      appointments={upcomingAppointments}
      patientReports={patientReport.data || []}
      patientNotes={patientNotes.data || []}
      healthRecords={patientRecords.data || []}
    />
  );
}
