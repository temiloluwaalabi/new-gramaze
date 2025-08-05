import { cookies } from "next/headers";
import React from "react";

import DashboardHeader from "@/components/shared/layout/dashboard-header";
import UserDashboardSidebar from "@/components/shared/layout/user-dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/providers/theme-provider";

const UserDashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();

  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        <UserDashboardSidebar />
        <SidebarInset className="w-full">
          <DashboardHeader />
          <main className="relative !size-full bg-white">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default UserDashboardLayout;
