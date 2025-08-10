import React from "react";

import { getCaregiverPatientHistory } from "@/app/actions/caregiver-patient.actions";
import CaregiverPatientsClientPage from "@/components/pages/caregiver-patient-dashboard";
export const dynamic = "force-dynamic";

export default async function CaregiverPatientDash() {
  const patients = await getCaregiverPatientHistory();

  return (
    <CaregiverPatientsClientPage
      allPatients={
        Array.isArray(patients.patients)
          ? patients.patients
          : patients.patients.data || []
      }
    />
  );
}
