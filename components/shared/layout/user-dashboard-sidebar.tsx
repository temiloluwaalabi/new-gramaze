"use client";
import { LogOut } from "lucide-react";
import React from "react";

import { LogoutModal } from "@/components/dialogs/logout-modal";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, 
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SIDEBAR_ITEMS } from "@/config";
import { cn } from "@/lib/utils";

import { Logo } from "../logo";
import SidebarMain from "./sidebar-main";

export default function UserDashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      {...props}
      side="left"
      variant="sidebar"
      collapsible="icon"
      className="!border-r !border-[#E8E8E8] !bg-white p-4"
    >
<SidebarHeader className="group-data-[collapsible=icon]:!p-0 px-2">
  <div className="flex items-center justify-between">
    <SidebarMenu>
      <SidebarMenuButton asChild size={"lg"} className="!p-0">
        <Logo
          logoLink="https://res.cloudinary.com/davidleo/image/upload/v1744665654/gramaze-logo_yt4zo6.png"
          className="flex h-[39px] w-[180.8px] items-end justify-end group-data-[collapsible=icon]:!hidden"
        />
      </SidebarMenuButton>
    </SidebarMenu>

    {/* ✅ Make this always visible on all screens */}
    <SidebarTrigger className="cursor-pointer w-8 min-w-8 shrink-0" />
  </div>
</SidebarHeader>



      <SidebarContent className="custom-scrollbar group-data-[collapsible=icon]:!p-0">
        <SidebarMain sidebarItems={SIDEBAR_ITEMS} />
        <SidebarMenuItem className="relative mt-auto flex">
          <SidebarMenuButton
            asChild
            className={cn(
              "group flex h-[40px] items-center !py-3 group-data-[collapsible=icon]:!p-0 hover:bg-blue-50"
            )}
          >
            <LogoutModal
              trigger={
                <Button
                  variant={"ghost"}
                  className="flex w-full cursor-pointer items-center justify-end bg-red-800 hover:bg-red-900"
                >
                  <LogOut className="!size-5 rotate-180 text-white group-data-[collapsible=icon]:-ml-[2px]" />
                  <span className="hover:text-primary ms-1 truncate text-sm font-normal text-white hover:font-medium dark:text-gray-300">
                    Logout
                  </span>
                </Button>
              }
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
