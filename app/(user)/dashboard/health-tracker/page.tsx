/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { redirect } from "next/navigation";
import React from "react";

import {
  getLastThreeNotes,
  getLastThreeReports,
  getUserHealthNotes,
  getUserHealthReports,
} from "@/app/actions/services/health.tracker.actions";
import { getSession } from "@/app/actions/session.actions";
import { HealthTrackerPageTwo } from "@/components/pages/health-tracker-page-two";
import { gramazeEndpoints } from "@/config/routes";
import { backendAPiClient, ApiError } from "@/lib/api/api-client";

export const dynamic = "force-dynamic";

export default async function HealthTrackerDashboard() {
  try {
    const session = await getSession();

    if (!session?.accessToken) {
      redirect("/login");
    }

    // Use Promise.allSettled instead of Promise.all to handle individual failures
    const [
      sessionResult,
      reportsResult,
      notesResult,
      allNotesResult,
      allReportsResult,
      trackersResult,
    ] = await Promise.allSettled([
      Promise.resolve(session),
      getLastThreeReports(),
      getLastThreeNotes(),
      getUserHealthNotes(),
      getUserHealthReports(),
      backendAPiClient.request({
        method: "GET",
        url: `${gramazeEndpoints.health.user.trackers}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      }),
    ]);

    // Extract data with fallbacks
    const reports =
      reportsResult.status === "fulfilled" ? reportsResult.value.reports : [];

    const notes =
      notesResult.status === "fulfilled" ? notesResult.value.notes : [];

    const allNotes =
      allNotesResult.status === "fulfilled" ? allNotesResult.value.notes : [];

    const allReports =
      allReportsResult.status === "fulfilled"
        ? allReportsResult.value.reports
        : [];

    const healthTrackers =
      trackersResult.status === "fulfilled"
        ? trackersResult.value.data.health_tracker
        : [];

    // Log any failures for debugging
    const failures = [
      { name: "reports", result: reportsResult },
      { name: "notes", result: notesResult },
      { name: "allNotes", result: allNotesResult },
      { name: "allReports", result: allReportsResult },
      { name: "trackers", result: trackersResult },
    ].filter(({ result }) => result.status === "rejected");

    if (failures.length > 0) {
      console.error(
        "Some requests failed:",
        failures.map((f) => ({
          name: f.name,
          error: f.result.status === "rejected" ? f.result.reason : null,
        }))
      );
    }

    return (
      <HealthTrackerPageTwo
        reports={reports}
        healthTrackers={healthTrackers}
        notes={notes}
        allNotes={allNotes}
        allReports={allReports}
      />
    );
  } catch (error) {
    console.error("Critical error in HealthTrackerDashboard:", error);

    // You can redirect to an error page or show a fallback UI
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Unable to Load Dashboard</h1>
          <p className="text-muted-foreground mb-4">
            We&apos;re experiencing some technical difficulties. Please try
            again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground rounded-md px-4 py-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
}
