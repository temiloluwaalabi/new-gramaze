import React from "react";

import { getLastThreeReports } from "@/app/actions/services/health.tracker.actions";
import { getSession } from "@/app/actions/session.actions";
// import { HealthTrackerPage } from "@/components/pages/health-tracker-page";
import { HealthTrackerPageTwo } from "@/components/pages/health-tracker-page-two";
import { gramazeEndpoints } from "@/config/routes";
import { backendAPiClient } from "@/lib/api/api-client";
// This tells Next.js: "Don't try to pre-render this page at build time"
export const dynamic = "force-dynamic";
export default async function HealthTrackerDashboard() {
  const session = await getSession();
  const reports = await getLastThreeReports();

  const response = await backendAPiClient.request({
    method: "GET",
    url: `${gramazeEndpoints.health.user.trackers}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    // params: {
    //   ...(end_date && { end_date }),
    //   ...(start_date && { start_date }),
    // },
  });
  // const trackers = await getLastTrackers();

  return (
    <HealthTrackerPageTwo
      reports={reports.reports}
      healthTrackers={response.data.health_tracker}
    />
  );
}
