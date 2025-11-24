import { notFound } from "next/navigation";
import React, { Suspense } from "react";

import OnboardingSuccess from "@/components/shared/onboarding/onboarding-successful-page";

import { getAppointmentDetail } from "../actions/services/appointment.actions";
import { getAllHospitals } from "../actions/services/hospital.actions";

export default async function OnboardingBookedPage({
  searchParams,
}: {
  searchParams: Promise<{ id: number }>;
}) {
  const id = (await searchParams).id;

  const [appointment, allHospitals] = await Promise.all([
    getAppointmentDetail(id.toString()),
    getAllHospitals(),
  ]);

  if (!appointment.appointment) {
    return notFound();
  }

  return (
    <Suspense>
      <OnboardingSuccess
        appointment={appointment.appointment}
        hospitals={allHospitals.hospitals || []}
      />
    </Suspense>
  );
}
