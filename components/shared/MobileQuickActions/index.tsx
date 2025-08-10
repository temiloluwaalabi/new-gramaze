"use client";

import { HeartPulse, CalendarCheck } from "lucide-react";
import Link from "next/link";

import { allRoutes } from "@/config/routes";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MobileQuickActions() {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="mb-4 w-full sm:hidden">
      <div className="flex w-full gap-3">
        <Link
          href={allRoutes.user.dashboard.scheduleAppointment.url}
          className="flex-1"
        >
          <div className="flex h-full min-h-[70px] w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-3 py-4 text-white shadow-md">
            <CalendarCheck className="h-5 w-5 shrink-0" />
            <span className="text-[12px] font-medium whitespace-nowrap">
              Book Appointment
            </span>
          </div>
        </Link>

        <Link
          href={allRoutes.user.dashboard.healthTracker.url}
          className="flex-1"
        >
          <div className="flex h-full min-h-[70px] w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 py-4 text-white shadow-md">
            <HeartPulse className="h-5 w-5 shrink-0" />
            <span className="text-[12px] font-medium whitespace-nowrap">
              View Health Tracker
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
