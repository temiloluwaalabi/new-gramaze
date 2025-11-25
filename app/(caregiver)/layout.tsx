import { cookies } from "next/headers";
import React from "react";

import CaregiverDashboardSidebar from "@/components/shared/layout/caregiver-dashboard-sidebar";
import DashboardHeader from "@/components/shared/layout/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SearchableData } from "@/lib/search/search-types";

import { getUserAppointments } from "../actions/services/appointment.actions";
import { getCaregiverHistory } from "../actions/services/caregiver.actions";
import {
  getLastTrackers,
  getUserHealthReports,
  getUserHealthNotes,
} from "../actions/services/health.tracker.actions";

const CaregiverDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();
  const [appointments, trackers, userCaregivers, allReports, allNotes] =
    await Promise.all([
      getUserAppointments(),
      getLastTrackers(),
      getCaregiverHistory(),
      getUserHealthReports(),
      getUserHealthNotes(),
    ]);
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  const searchData: SearchableData = {
    appointments: appointments.appointments.data || [],
    messages: [],
    caregivers: userCaregivers.caregivers.data,
    healthTrackers: trackers.tracker,
    healthReports: allReports.reports,
    healthNotes: allNotes.notes,
    paymentNotifications: [],
  };

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <CaregiverDashboardSidebar />
      <SidebarInset className="w-full">
        <DashboardHeader isCare={true} searchData={searchData} />
        <main className="relative size-full bg-white">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default CaregiverDashboardLayout;
