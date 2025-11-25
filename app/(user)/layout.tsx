import { cookies } from "next/headers";
import React from "react";

import DashboardHeader from "@/components/shared/layout/dashboard-header";
import UserDashboardSidebar from "@/components/shared/layout/user-dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SearchableData } from "@/lib/search/search-types";

import { getUserAppointments } from "../actions/services/appointment.actions";
import { getCaregiverHistory } from "../actions/services/caregiver.actions";
import {
  getLastTrackers,
  getUserHealthReports,
  getUserHealthNotes,
} from "../actions/services/health.tracker.actions";

// import { ThemeProvider } from "@/providers/theme-provider";

const UserDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();

  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  const [appointments, trackers, userCaregivers, allReports, allNotes] =
    await Promise.all([
      getUserAppointments(),
      getLastTrackers(),
      getCaregiverHistory(),
      getUserHealthReports(),
      getUserHealthNotes(),
    ]);

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
    // <ThemeProvider
    //   attribute="class"
    //   defaultTheme="light"
    //   disableTransitionOnChange
    // >
    <SidebarProvider defaultOpen={defaultOpen}>
      <UserDashboardSidebar />
      <SidebarInset className="w-full overflow-x-hidden">
        <DashboardHeader searchData={searchData} />
        <main className="relative !size-full bg-white">{children}</main>
      </SidebarInset>
    </SidebarProvider>
    // </ThemeProvider>
  );
};

export default UserDashboardLayout;
