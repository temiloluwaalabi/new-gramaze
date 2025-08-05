import { cookies } from "next/headers";
import React from "react";

import CaregiverDashboardSidebar from "@/components/shared/layout/caregiver-dashboard-sidebar";
import DashboardHeader from "@/components/shared/layout/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const CaregiverDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();

  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <CaregiverDashboardSidebar />
      <SidebarInset className="w-full">
        <DashboardHeader isCare={true} />
        <main className="relative size-full bg-white">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default CaregiverDashboardLayout;
