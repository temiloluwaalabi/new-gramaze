"use client";
import { Bell, Search, Settings, LogOut, Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";

import { LogoutModal } from "@/components/dialogs/logout-modal";
import { NotificationPanelSheet } from "@/components/sheets/notification-panel-sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { initialsFromName } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";

import PageTitleHeader from "../page-title-header";

type Props = {
  isCare?: boolean;
};

export default function DashboardHeader(props: Props) {
  const { user } = useUserStore();
  const isMobile = useIsMobile();

  return (
    <div className="flex h-auto min-h-[64px] w-full items-center justify-between border-b border-[#E8E8E8] bg-white p-4 md:h-[84px] md:p-6">
      <div className="flex w-full items-center gap-1">
        <SidebarTrigger className="mr-2 flex shrink-0 cursor-pointer md:hidden" />

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
        <NotificationPanelSheet
          sheetTrigger={
            <Bell className="size-5 cursor-pointer border-[#66666B]" />
          }
        />

        {/* Avatar Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {initialsFromName(
                  [user?.first_name, user?.last_name]
                    .filter(Boolean)
                    .join(" ")
                    .trim()
                )}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {[user?.first_name, user?.last_name]
                    .filter(Boolean)
                    .join(" ")
                    .trim() || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/appointment"
                className="flex cursor-pointer items-center"
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Book Appointment</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/settings"
                className="flex cursor-pointer items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <LogoutModal
              trigger={
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>

     
      </div>
    </div>
  );
}