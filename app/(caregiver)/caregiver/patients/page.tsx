import React from "react";

import { getCaregiverPatientHistory } from "@/app/actions/caregiver-patient.actions";
import CaregiverPatientsClientPage from "@/components/pages/caregiver-patient-dashboard";
export const dynamic = "force-dynamic";

export default async function CaregiverPatientDash() {
  const patients = await getCaregiverPatientHistory();
  return (
    <CaregiverPatientsClientPage
      allPatients={
        patients?.success && Array.isArray(patients.data)
          ? patients.data.filter(
              (data) => data.patient.email !== "superadmin@gramaze.com"
            )
          : []
      }
    />
  );
}
