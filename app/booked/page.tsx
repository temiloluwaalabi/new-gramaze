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

  const appointment = await getAppointmentDetail(id.toString());

  if (!appointment.appointment) {
    return notFound();
  }

  console.log("ID", id);

  const allHospitals = await getAllHospitals()
  return (
    <Suspense>
      <OnboardingSuccess appointment={appointment.appointment} hospitals={allHospitals.hospitals || []}/>
    </Suspense>
  );
}
