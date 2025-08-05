"use client";
import { Bell, Search } from "lucide-react";
import React from "react";

import { NotificationPanelSheet } from "@/components/sheets/notification-panel-sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

import PageTitleHeader from "../page-title-header";

type Props = {
  isCare?: boolean;
};
export default function DashboardHeader(props: Props) {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-auto min-h-[64px] w-full items-center justify-between border-b border-[#E8E8E8] bg-white p-4 md:h-[84px] md:p-6">
      <div className="flex w-full items-center gap-1">
        <SidebarTrigger className="hidden cursor-pointer group-data-[collapsible=icon]:w-full" />

        {props.isCare ? (
          isMobile ? (
            <h1 className="dark:text-light-200 text-sm font-normal tracking-tight text-[#797979]">
              Caregiver
            </h1>
          ) : (
            <PageTitleHeader
              page="Caregiver"
              showCrumbs
              homeCrumb={{
                label: "Caregiver",
                href: "/caregiver",
              }}
            />
          )
        ) : isMobile ? (
          <h1 className="dark:text-light-200 text-sm font-normal tracking-tight text-[#797979]">
            Dashboard
          </h1>
        ) : (
          <PageTitleHeader
            page="Dashboard"
            showCrumbs
            homeCrumb={{
              label: "Dashboard",
              href: "/dashboard",
            }}
          />
        )}
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden items-center gap-2 rounded-md border border-gray-200 px-2 md:flex">
          <Search className="size-5 text-gray-400" />
          <Input
            placeholder="Search"
            className="no-focus h-[40px] w-[320px] border-none shadow-none outline-none"
          />
        </div>
        {/* <Button
          variant={"outline"}
          className="relative !h-[32px] cursor-pointer shadow-none lg:!h-[40px]"
        >
          <Link
            href={props.isCare ? "/dashboard" : "/caregiver"}
            className="absolute top-0 left-0 z-20 size-full"
          />
          {props.isCare ? "User" : "Caregiver"}{" "}
          <ChevronRight className="size-4" />
        </Button> */}
        {/* Small search icon for mobile */}
        {/* <button className="md:hidden p-2 rounded-full hover:bg-gray-100">
          <Search className="size-5 text-gray-500" />
        </button> */}
        <NotificationPanelSheet
          sheetTrigger={
            <Bell className="size-5 cursor-pointer border-[#66666B]" />
          }
        />
        <Avatar>
          <AvatarFallback className="bg-[#B8B9BA] text-white">
            TE
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
