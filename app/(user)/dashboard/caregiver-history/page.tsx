import React from "react";

import { getCaregiverHistory } from "@/app/actions/services/caregiver.actions";
import CargiverHistoryDashboard from "@/components/pages/caregiver-history-dashboard";
export const dynamic = "force-dynamic";

export default async function CaregiverHistoryPDashboard() {
  const patientCaregivers = await getCaregiverHistory();

  return (
    <CargiverHistoryDashboard
      caregivers={patientCaregivers.caregivers?.data || []}
    />
  );
}
