import { notFound } from "next/navigation";
import React from "react";

import {
  getCaregiverHistory,
  getCaregiverHistoryDetails,
} from "@/app/actions/services/caregiver.actions";
import SingleCaregiverDetailsPage from "@/components/pages/single-caregiver-details-page";

export default async function SingleCaregiverDash({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  // const users = await getAllUsers();
  const id = (await params).id;
  const caregiver = await getCaregiverHistoryDetails(id.toString());
  const patientCaregivers = await getCaregiverHistory();

  if (!caregiver.data) {
    return notFound();
  }

  return (
    <SingleCaregiverDetailsPage
      caregivers={patientCaregivers.caregivers.data.filter(
        (user) => user.caregiver_id === id.toString()
      )}
      caregiverId={id}
      caregiver={caregiver.data}
      // currentUser={pageUser}
    />
  );
}
