import React from "react";

import { getCaregiverHistory } from "@/app/actions/services/caregiver.actions";
import SingleCaregiverDetailsPage from "@/components/pages/single-caregiver-details-page";

export default async function SingleCaregiverDash({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  // const users = await getAllUsers();
  const id = (await params).id;
  // const pageUser = users.users.find((user) => user.id === Number(id));
  const patientCaregivers = await getCaregiverHistory();

  // if (!pageUser) {
  //   return notFound();
  // }
  return (
    <SingleCaregiverDetailsPage
      caregivers={patientCaregivers.caregivers.data.filter(
        (user) => user.caregiver_id !== id.toString()
      )}
      caregiverId={id}
      // currentUser={pageUser}
    />
  );
}
