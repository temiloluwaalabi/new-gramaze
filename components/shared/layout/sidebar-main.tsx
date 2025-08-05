"use client";
import { usePathname } from "next/navigation";
import React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarItem } from "@/config";
import { cn } from "@/lib/utils";

type SidebarProps = {
  sidebarItems: SidebarItem[];
};

export default function SidebarMain({ sidebarItems }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div>
      {sidebarItems.map((item, index) => {
        const isActive = () => {
          // Exact match for the root dashboard
          if (item.href === "/dashboard") {
            return pathname === "/dashboard";
          }

          if (item.href === "/caregiver") {
            return pathname === "/caregiver";
          }

          // For other routes, check if the current path starts with the item's href
          // BUT make sure it's at the right "level" by checking path segments
          if (pathname.startsWith(item.href as string)) {
            // Get the next segment after this item's path (if any)
            const remainingPath = pathname.slice((item.href as string).length);
            // If there's no next segment or it starts with a slash followed by something,
            // this is the correct active item
            return remainingPath === "" || remainingPath.startsWith("/");
          }

          return false;
        }; // const pathnameExistsInDropdown: any = item.dropdownItems?.filter(
        //   (dropdownItem) => dropdownItem.href === pathname
        // );
        // const isDropdown = Boolean(pathnameExistsInDropdown.length);

        return (
          <SidebarGroup key={item.name + "-" + index}>
            {item?.href ? (
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.dropdownItems ? (
                    <h3>Collapsible</h3>
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.name}
                        // isActive={isActive}
                        className={cn(
                          'group "group-data-[collapsible=icon]:!p-0 " flex h-[40px] items-center !py-3 hover:bg-blue-50',
                          isActive() && "bg-blue-600 hover:bg-blue-600"
                        )}
                      >
                        <a
                          href={item.href}
                          className={cn("", isActive() && "text-blue-600")}
                        >
                          {item.icon && (
                            <item.icon
                              className={cn(
                                "-ml-[2px] !size-5 !text-[#66666B]",
                                isActive() && "!text-white"
                              )}
                            />
                          )}
                          <span
                            className={cn(
                              "truncate text-sm font-normal text-[#66666B]",
                              isActive() && "text-white"
                            )}
                          >
                            {item.name}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            ) : (
              <SidebarGroupLabel
                className={cn(
                  "mt-10 h-fit px-0 text-sm font-normal text-[#AFAFAF] uppercase",
                  index === 0 && "nt-0"
                )}
              >
                {item.name}
              </SidebarGroupLabel>
            )}
          </SidebarGroup>
        );
      })}
    </div>
  );
}
