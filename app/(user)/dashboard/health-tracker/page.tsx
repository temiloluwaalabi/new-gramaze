import React from "react";

import {
  getLastThreeReports,
  getLastTrackers,
} from "@/app/actions/services/health.tracker.actions";
import { HealthTrackerPage } from "@/components/pages/health-tracker-page";
// This tells Next.js: "Don't try to pre-render this page at build time"
export const dynamic = "force-dynamic";
export default async function HealthTrackerDashboard() {
  const reports = await getLastThreeReports();
  const trackers = await getLastTrackers();

  return (
    <HealthTrackerPage
      reports={reports.reports}
      healthTrackers={trackers.health_tracker}
    />
  );
}
