import React from "react";

import { getHealthRecordsByUserId } from "@/app/actions/services/caregiver.actions";
import { getSession } from "@/app/actions/session.actions";
import { SettingsClientPage } from "@/components/pages/settings-page";

export default async function SettingsDashboard() {
  const session = await getSession();
  const patientRecords = await getHealthRecordsByUserId(
    session.user_id.toString()
  );

  return <SettingsClientPage healthRecords={patientRecords.data || []} />;
}
