// components/dashboard/dashboard-header.tsx
"use client";
import { Bell, Search, Settings, LogOut, Pencil } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { GlobalSearchDialog } from "@/components/dialogs/global-search-dialog";
import { LogoutModal } from "@/components/dialogs/logout-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchableData } from "@/lib/search/search-types";
import { initialsFromName } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";

import PageTitleHeader from "../page-title-header";

type Props = {
  isCare?: boolean;
  searchData: SearchableData;
};

export default function DashboardHeader(props: Props) {
  const { user } = useUserStore();
  const isMobile = useIsMobile();
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
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
          {/* Search Button */}
          <Button
            variant="outline"
            className="items-left hidden !h-[40px] w-[320px] gap-2 rounded-md border border-gray-200 !px-2 !py-2 shadow-none md:flex"
            onClick={() => setSearchOpen(true)}
          >
            <div className="flex w-full items-center gap-1">
              <Search className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Search...</span>
            </div>
            <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* Mobile Search Icon */}
          <Search
            className="size-5 cursor-pointer text-gray-400 md:hidden"
            onClick={() => setSearchOpen(true)}
          />

          <Bell className="size-5 cursor-pointer border-[#66666B]" />

          {/* Avatar Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-10 cursor-pointer">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {initialsFromName(
                    [user?.first_name, user?.last_name]
                      .filter(Boolean)
                      .join(" ")
                      .trim()
                  )}
                </AvatarFallback>
                {user?.image && <AvatarImage src={user.image} />}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {[user?.first_name, user?.last_name]
                      .filter(Boolean)
                      .join(" ")
                      .trim() || "User"}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
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

      {/* Global Search Dialog */}
      <GlobalSearchDialog
        searchData={props.searchData}
        open={searchOpen}
        onOpenChange={setSearchOpen}
      />
    </>
  );
}
