import { notFound } from "next/navigation";
import React from "react";

import { fetchAllPAtientVitals } from "@/app/actions/caregiver-patient.actions";
import { getSingleHealthRecord } from "@/app/actions/services/caregiver.actions";
import { getAllHealthMetrics } from "@/app/actions/services/health.tracker.actions";
import { getSession } from "@/app/actions/session.actions";
import SingleHealthRecordPage from "@/components/pages/single-health-record-page";
import { HealthTracker2 } from "@/lib/health-tracker-utils";

export default async function HealthRecordDetailsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const session = await getSession();
  const id = (await params).id;
  const patient = await getSingleHealthRecord(id.toString());

  if (!patient.data) {
    return notFound();
  }

  let healthTrackers: HealthTracker2[] = [];

  if (patient.data.patient) {
    const healthTrackerss = await fetchAllPAtientVitals({
      user_id: patient.data?.patient?.id,
    });

    healthTrackers = healthTrackerss.data || [];
  }

  const metrics = await getAllHealthMetrics();

  return (
    <SingleHealthRecordPage
      metrics={metrics.metrics || []}
      healthRecord={patient.data}
      currentUserId={session.user_id}
      currentUserRole="caregiver"
      allPatientTrackers={healthTrackers}
    />
  );
}
